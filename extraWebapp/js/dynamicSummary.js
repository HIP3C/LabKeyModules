$(document).ready(function() {

    var errorCode = '<p style=\'margin-left: 30px; color: red;\'>Failed to retrieve the aggregate summary</p>';
    var myMask = new Ext.LoadMask(
        $('#Summary')[0],
        {
            msg: 'Please, wait, while the aggregate<br/> summary table is loading',
            msgCls: 'mask-loading'
        }
    );

    myMask.show();

    LABKEY.contextPath = '';
    LABKEY.container = {};
    LABKEY.container.path = '/home';

    LABKEY.Query.selectRows({
        failure: function(a, b, c){
            myMask.hide();
            $('#Summary').append( errorCode );
        },
        success: function(d){
            var numStudies = d.rows.length, filterString = [];

            if ( numStudies == 0 ){
                myMask.hide();
                $('#Summary').append( errorCode );
            } else {

                Ext.each( d.rows, function(row, i){
                    filterString.push( '\'' + row.Name + '\'' );
                });
    
                filterString = '(' + filterString.join(',') + ')';
    
                var sqlAggregateCounts =
                    'SELECT' +
                    ' result AS assay_type,' +
                    ' CAST( SUM(subject_count) AS INTEGER ) AS subject_count ' +
                    'FROM' +
                    ' summaryResults ' +
                    'WHERE' +
                    ' study_accession IN ' + filterString + ' ' +
                    'GROUP BY' +
                    ' result';
            
                var sqlParticipantsCount =
                    'SELECT' +
                    ' COUNT(*) AS participants_count ' +
                    'FROM' +
                    ' subject ' +
                    'LEFT JOIN arm_2_subject arm2sub ON subject.subject_accession = arm2sub.subject_accession ' +
                    'LEFT JOIN arm_or_cohort arm ON arm2sub.arm_accession = arm.arm_accession ' +
                    'WHERE' +
                    ' study_accession IN ' + filterString + ' ' +
                    '';
            
                LABKEY.Query.executeSql({
                    failure: function(){
                        myMask.hide();
                        $('#Summary').append( errorCode );
                    },
                    success: function(d){
            
                        var participantsCount = d.rows[0].participants_count;
            
                        LABKEY.Query.executeSql({
                            failure: function(){
                                myMask.hide();
                                $('#Summary').append( errorCode );
                            },
                            success: function(d){
                            
                                $('#Summary').append(
                                    '<table>' + 
                                        '<tbody>' +
                                            '<tr>' +
                                                '<td>Studies</td>' +
                                                '<td style="white-space: nowrap;" align="right">' + numStudies + '</td>' +
                                            '</tr><tr>' +
                                                '<td>Subjects</td>' +
                                                '<td style="white-space: nowrap;" align="right">' + participantsCount + '</td>' +
                                            '</tr><tr>' +
                                                '<td>&nbsp;</td>' +
                                                '<td>&nbsp;</td>' +
                                            '</tr>'
                                            );
                                    
                                            Ext.each( d.rows, function(row, i){
                                                $('#Summary tbody').append(
                                                    '<tr>' +
                                                        '<td>' + row.assay_type + '</td>' +
                                                        '<td style="white-space: nowrap;" align="right">' + row.subject_count + '</td>' +
                                                    '</tr>'
                                                );
                                            });
                        
                                myMask.hide();
                            },
                            sql: sqlAggregateCounts,
                            schemaName: 'hipcdb'
                        });
            
                    },
                    sql: sqlParticipantsCount,
                    schemaName: 'hipcdb'
                }); 
            }
        },
        containerFilter: LABKEY.Query.containerFilter.allFolders,
        queryName: 'studies',
        schemaName: 'study'
    });
});
