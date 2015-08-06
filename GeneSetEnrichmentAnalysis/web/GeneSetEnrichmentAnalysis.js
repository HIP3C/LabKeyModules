// vim: sw=4:ts=4:nu:nospell
/*
 Copyright 2014 Fred Hutchinson Cancer Research Center

 Licensed under the Apache License, Version 2.0 (the 'License');
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an 'AS IS' BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/

Ext.namespace('LABKEY.ext');

LABKEY.ext.GeneSetEnrichmentAnalysis = Ext.extend( Ext.Panel, {

    constructor : function(config) {

        /////////////////////////////////////
        //            Variables            //
        /////////////////////////////////////

        String.prototype.wpdi = function(){ return this + config.webPartDivId; };

        var
            me                  = this,
            maskReport          = undefined,
            fieldWidth          = 240,
            flagCohortSelect    = undefined
            ;

        var checkBtnRunStatus = function(){
            if (
                cbModules.isValid( true ) &&
                cbCohort.isValid( true )
            ){
                btnRun.setDisabled( false );
            } else {
                btnRun.setDisabled( true );
            }
        };

        var checkBtnResetStatus = function(){
            if (    cbModules.getValue() == cbModules.originalValue &&
                    cbCohort.getValue() == cbCohort.originalValue
            ){
                btnReset.setDisabled( true );
            } else {
                btnReset.setDisabled( false );
            }
        };


        ///////////////////////////////////
        //            Stores             //
        ///////////////////////////////////

        var strCohort = new LABKEY.ext.Store({
            autoLoad: true,
            listeners: {
                load: function(){
                    if ( this.getCount() > 0 ){
                        cbCohort.setDisabled( false );
                    }

                    decodeParams( window.location.hash );
                },
                loadexception: LABKEY.ext.ISCore.onFailure
            },
            queryName: 'expression_matrices_cohorts',
            schemaName: 'study'
        });


        /////////////////////////////////////
        //     ComboBoxes / TextFields     //
        /////////////////////////////////////

        var cbCohort = new Ext.ux.form.ExtendedComboBox({
            allowBlank: false,
            disabled: true,
            displayField: 'cohort',
            fieldLabel: 'Cohort',
            id: 'cbCohort',
            lazyInit: false,
            listeners: {
                blur: function(){
                    checkBtnRunStatus();
                    checkBtnResetStatus();
                },
                change: function(){
                    if ( ! flagCohortSelect ) {
                        checkBtnRunStatus();
                        checkBtnResetStatus();
                    }
                },
                cleared: function(){
                    btnRun.setDisabled( true );
                },
                focus: function(){
                    flagCohortSelect = false;
                },
                select: function(){
                    flagCohortSelect = true;

                    checkBtnRunStatus();
                    checkBtnResetStatus();
                }
            },
            store: strCohort,
            valueField: 'cohort',
            width: fieldWidth
        });

        var cbModules = new Ext.ux.form.ExtendedComboBox({
            allowBlank: false,
            displayField: 'name',
            fieldLabel: 'Modules',
            id: 'cbModules',
            listeners: {
                change: function(){
                    checkBtnRunStatus();
                    checkBtnResetStatus();
                },
                cleared: function(){
                    checkBtnRunStatus();
                    checkBtnResetStatus();
                },
                select: function(){
                    checkBtnRunStatus();
                    checkBtnResetStatus();
                }
            },
            qtipField: 'qtip',
            store: new Ext.data.ArrayStore({
                data: [
                    [ 'Blood transcription', 'Blood transcription', 'Set of transcription modules in blood.' ],
                    [ 'MSigDB c7', 'MSigDB c7', 'Gene sets that represent cell states and perturbations within the immune system.' ],
                    [ 'G2 (Trial 8) Modules', 'G2 (Trial 8) Modules', 'Repertoire of co-clustering genes.' ]
                ],
                fields: [ 'name', 'value', 'qtip' ]
            }),
            value: 'Blood transcription',
            valueField: 'value',
            width: fieldWidth
        });

        var taImportExport = new Ext.form.TextArea({
            //value: '#Cohort=LAIV group 2008&Modules=Blood transcription'
        });


        /////////////////////////////////////
        //    Buttons and Radio Groups     //
        /////////////////////////////////////

        var btnRun = new Ext.Button({
            disabled: true,
            handler: function(){
                cnfReport.inputParams = {
                    signature:  cbModules.getValue(),
                    cohort:     cbCohort.getValue()
                };

                setReportRunning( true );
                LABKEY.Report.execute( cnfReport );
            },
            text: 'Run'
        });

        var btnReset = new Ext.Button({
            disabled: true,
            handler: function(){
                cbCohort.reset();
                cbModules.reset();

                checkBtnRunStatus();
                checkBtnResetStatus();
            },
            text: 'Reset'
        });


        /////////////////////////////////////
        //      Back-end Configuration     //
        /////////////////////////////////////

        var cnfReport = {
            failure: function( errorInfo, options, responseObj ){
                setReportRunning( false );

                LABKEY.ext.ISCore.onFailure( errorInfo, options, responseObj );
            },
            reportId: 'module:GeneSetEnrichmentAnalysis/GeneSetEnrichmentAnalysis.Rmd',
            success: function( result ){
                setReportRunning( false );

                var errors = result.errors;
                var outputParams = result.outputParams;

                if (errors && errors.length > 0){
                    LABKEY.ext.ISCore.onFailure({
                        exception: errors.join('\n')
                    });
                } else {
                    var p = outputParams[0];

                    pnlView.update(p.value);

                    $('#res_table_GSEA').dataTable();

                    pnlTabs.setActiveTab(1);
                }
            }
        };


        /////////////////////////////////////
        //  Panels, Containers, Components //
        /////////////////////////////////////

        var tlbrRun = new Ext.Toolbar({
            border: true,
            defaults: {
                style: 'padding-top: 1px; padding-bottom: 1px;'
            },
            enableOverflow: true,
            items: [
                btnRun,
                btnReset
            ],
            style: 'padding-right: 2px; padding-left: 2px;'
        });

        var pnlInput = new Ext.form.FormPanel({
            bodyStyle: { paddingTop: '1px' },
            defaults: {
                autoHeight: true,
                forceLayout: true,
                hideMode: 'offsets'
            },
            deferredRender: false,
            items: [
                {
                    html: '<a class="labkey-text-link bold-text" onclick="LABKEY.help.Tour.show(\'immport-gsea-tour\')">Quick help</a><br><br>',
                    border: false,
                    defaults: {
                        border: false
                    },
                    items: [
                        { html: 'For information and help on how to use the Gene Set Enrichment Analysis module, click the' },
                        new Ext.Container({
                            autoEl: 'a',
                            html: '&nbsp;\'About\'&nbsp;',
                            listeners: {
                                afterrender: {
                                    fn: function(){
                                        this.getEl().on( 'click', function(){ pnlTabs.setActiveTab( 2 ); } );
                                    },
                                    single: true
                                }
                            }
                        }),
                        { html: 'and' },
                        new Ext.Container({
                            autoEl: 'a',
                            html: '&nbsp;\'Help\'&nbsp;',
                            listeners: {
                                afterrender: {
                                    fn: function(){
                                        this.getEl().on( 'click', function(){ pnlTabs.setActiveTab( 3 ); } );
                                    },
                                    single: true
                                }
                            }
                        }),
                        { html: 'tabs above.</br></br>' }
                    ],
                    layout: 'hbox'
                },
                
                new Ext.form.FieldSet({
                    autoScroll: true,
                    items: [
                        cbCohort,
                        cbModules
                    ],
                    title: 'Parameters'
                }),
                new Ext.Panel({
                    border: true,
                    items: [
                        tlbrRun
                    ],
                    style: 'padding-right: 2px; padding-left: 2px;'
                })
            ],
            labelWidth: 100,
            tabTip: 'Input',
            title: 'Input'
        });

        var pnlView = new Ext.Panel({
            bodyStyle: 'padding: 1px;',
            defaults: {
                autoHeight: true,
                hideMode: 'offsets'
            },
            items: {
                border: false,
                defaults: {
                    border: false
                },
                items: [
                    { html: 'Switch to the' },
                    new Ext.Container({
                        autoEl: 'a',
                        html: '&nbsp;\'Input\'&nbsp;',
                        listeners: {
                            afterrender: {
                                fn: function(){
                                    this.getEl().on( 'click', function(){ pnlTabs.setActiveTab( 0 ); } );
                                },
                                single: true
                            }
                        }
                    }),
                    { html: 'tab, select the parameter values and click the \'RUN\' button to generate the report' },
                ],
                layout: 'hbox'
            },
            layout: 'fit',
            tabTip: 'View',
            title: 'View'
        });

        var tabItems = [
            pnlInput,
            pnlView,
            new Ext.Panel({
                defaults: {
                    autoHeight: true,
                    bodyStyle: 'padding-bottom: 1px;',
                    hideMode: 'offsets'
                },
                items: [
                    new Ext.form.Label(),
                    new Ext.form.FieldSet({
                        html: 'This module can be used to perform a gene set enrichment analysis across time (or across a prespecified contrast) within a specified cohort. ',
                        style: 'margin-top: 5px;',
                        title: 'Description'
                    }),
                    new Ext.form.FieldSet({
                        html: 'The gene set enrichment analysis is performed using the CAMERA method of the <a href="http://www.bioconductor.org/packages/release/bioc/html/limma.html" target="_blank">Limma</a> R package.',
                        style: 'margin-top: 5px;',
                        title: 'Details'
                    }),
                    new Ext.form.FieldSet({
                        html: LABKEY.ext.ISCore.contributors,
                        style: 'margin-bottom: 2px; margin-top: 5px;',
                        title: 'Contributors'
                    })
                ],
                layout: 'fit',
                tabTip: 'About',
                title: 'About'
            }),
            new Ext.Panel({
                defaults: {
                    autoHeight: true,
                    bodyStyle: 'padding-bottom: 1px;',
                    hideMode: 'offsets'
                },
                items: [
                    new Ext.form.Label(),
                    new Ext.form.FieldSet({
                        html: '<b>Cohort:</b> The cohorts with subjects of interest<br><br>\
                               <b>Modules:</b> The modules used for grouping genes, currently the following modules are available:<br><ul>\
                                  <li><a href="http://www.interactivefigures.com/meni/meni-paper/btm-landing.gsp" target="_blank">Blood transcription</a>: Set of transcription modules in blood.</li>\
                                  <li><a href="http://www.broadinstitute.org/gsea/msigdb/collections.jsp" target="_blank">MSigDB c7</a>: Gene sets that represent cell states and perturbations within the immune system.</li>\
                                  <li><a href="http://www.biir.net/public_wikis/module_annotation/G2_Trial_8_Modules" target="_blank">G2 (Trial 8) Modules</a>: Repertoire of co-clustering genes.</li>\
                               </ul>',
                        style: 'margin-bottom: 2px; margin-top: 5px;',
                        title: 'Parameters'
                    })
                ],
                layout: 'fit',
                tabTip: 'Help',
                title: 'Help'
            })
        ];

        if ( false ){ tabItems.push(
            new Ext.Panel({
                defaults: {
                    autoHeight: true,
                    bodyStyle: 'padding-bottom: 1px;',
                    hideMode: 'offsets'
                },
                items: [
                    taImportExport,
                    {
                        border: false,
                        items: [
                            new Ext.Button({
                                handler: function(){
                                    var hash = taImportExport.getValue();
                                    var ind = hash.indexOf( '#&' );
                                    if ( ind >= 0 ){
                                        hash = hash.substring( ind );

                                        decodeParams( hash );
                                    }
                                },
                                text: 'Import from text',
                                width: 200
                            }),
                            new Ext.Button({
                                handler: function(){
                                    var address = window.location.href;
                                    var hash    = address.indexOf( '#' );
                                    if ( hash >= 0 ){ address = address.substring( 0, hash ); }
                                    taImportExport.setValue( address + encodeParams( [ cbCohort, cbModules ] ) );
                                },
                                text: 'Export',
                                width: 200
                            }),
                            new Ext.Button({
                                handler: function(){
                                    taImportExport.setValue( '' );
                                },
                                text: 'Clear',
                                width: 200
                            })
                        ],
                        layout: 'hbox'
                    }
                ],
                layout: 'fit',
                tabTip: 'Import / Export',
                title: 'Import / Export'
            })
        ); }

        var pnlTabs = new Ext.TabPanel({
            activeTab: 0,
            autoHeight: true,
            defaults: {
                autoHeight: true,
                bodyStyle: 'padding: 4px;',
                border: false,
                forceLayout: true,
                hideMode: 'offsets',
                style: 'padding-bottom: 4px; padding-right: 4px; padding-left: 4px;'
            },
            deferredRender: false,
            forceLayout: true,
            items: tabItems,
            layoutOnTabChange: true,
            listeners: {
                afterrender: {
                    fn: function(){
                        maskReport = new Ext.LoadMask(
                            this.getEl(),
                            {
                                msg: LABKEY.ext.ISCore.generatingMessage,
                                msgCls: 'mask-loading'
                            }
                        );
                    },
                    single: true
                },
                tabchange: function(tabPanel, tab){
                    if ( tab.title == 'Create' ){
                    }
                }
            },
            minTabWidth: 100,
            resizeTabs: true
        });


        /////////////////////////////////////
        //             Functions           //
        /////////////////////////////////////

        var getParamString = function( el ){
            return el.getValue();
        };

        var encodeParams = function( arrayToProcess ){
            var obj = {};
            Ext.each( arrayToProcess, function(e){
                obj[e.getId()] = getParamString(e);
            });
            return Ext.urlEncode( obj, '#' );
        };

        var decodeParams = function( hash ){
            var toProcess, arrayToProcess, e;
            if ( hash && hash.charAt( 0 ) == '#' && hash.charAt( 1 ) == '&' ){
                toProcess = Ext.urlDecode( hash.substring( 2 ) );
                $.each( toProcess, function( k, v ){
                    e = Ext.getCmp( k );
                    if ( e ){
                        if ( e.findRecord( e.valueField, v ) ){
                            e.setValue( v );
                        } else{
                            e.clearValue();
                            e.markInvalid( '"' + v + '" in the supplied URL is not a valid value, select from the available choices' );
                        }
                    }
                });

                checkBtnRunStatus();
            }
        };

        var setReportRunning = function( bool ){
            if ( bool ){
                maskReport.show();
            } else {
                maskReport.hide();
            }
            btnRun.setDisabled( bool );
            btnReset.setDisabled( bool );
            cbCohort.setDisabled( bool );
            cbModules.setDisabled( bool );
        };


        // jQuery-related

        $('#'.wpdi())
            .parents('tr')
            .prev()
            .find('.labkey-wp-title-text')
            .wrap(
                '<a href=\'' +
                LABKEY.ActionURL.buildURL(
                    'reports',
                    'runReport',
                    null,
                    {
                        reportId: 'module:GeneSetEnrichmentAnalysis/reports/schemas/GeneSetEnrichmentAnalysis.Rmd',
                        tabId: 'Source'
                    }
                ) +
                '\' target=\'_blank\' title=\'Click to open the knitr source code in a new window\'></a>'
            );

        this.border         = false;
        this.boxMinWidth    = 370;
        this.cls            = 'ISCore';
        this.frame          = false;
        this.items          = pnlTabs;
        this.layout         = 'fit';
        this.renderTo       = ''.wpdi();
        this.webPartDivId   = ''.wpdi();
        this.width          = document.getElementById(''.wpdi()).offsetWidth;

        LABKEY.ext.GeneSetEnrichmentAnalysis.superclass.constructor.apply(this, arguments);

    }, // end constructor

    listeners: {
        afterrender: GSEATour
    },

    resize: function(){
    }
}); // end GeneSetEnrichmentAnalysis Panel class

