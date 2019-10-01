// vim: sw=4:ts=4:nu:nospell:
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

LABKEY.ext.GeneExpressionExplorer = Ext.extend( Ext.Panel, {

    constructor : function(config) {

        /////////////////////////////////////
        //            Variables            //
        /////////////////////////////////////

        var
            me                  = this,
            qwpResponse         = undefined,
            maskPlot            = undefined,
            reportSessionId     = undefined,
            cohortsCache        = undefined,
            flagTimePontSelect  = undefined
            fieldWidth          = 400,
            labelWidth          = 150
            ;

        var handleTimepointSelection = function(){
            chNormalize.setDisabledBasedOnFlag( cbTimePoint.getSelectedField( 'timepoint' ) <= 0 );

            cbCohorts.reset();
            cbGenes.reset();
            cbGenes.setDisabled( true );

            if ( cbTimePoint.getValue() == '' ){
                cbCohorts.setDisabled( true );
                cbCohorts.reset();

                checkBtnsStatus();
            } else {
                strCohort.setUserFilters([
                    LABKEY.Filter.create(
                        'timepoint',
                        cbTimePoint.getSelectedField( 'timepoint' ),
                        LABKEY.Filter.Types.EQUAL
                    ),
                    LABKEY.Filter.create(
                        'timepointUnit',
                        cbTimePoint.getSelectedField( 'timepointUnit' ),
                        LABKEY.Filter.Types.EQUAL
                    )
                ]);
                strCohort.load();
            }
        };

        var loadResponse = function(){
            var
                response    = cbResponse.getValue(),
                // Must use arm_accession instead of arm_accession/name
                // because may have ';' or other problematic characters
                // in name
                cohorts     = cbCohorts.getCheckedValue( 'arm_accession' )
            ;

            cntPlot.update( '<div style=\'height: 10px\'></div>' );

            if ( response !== '' && cbTimePoint.getValue() !== '' && cohorts !== '' ){
                if ( 
                      !qwpResponse ||
                    ( qwpResponse && ( qwpResponse.queryName != response || cohortsCache != cohorts ) )
                ){
                    cohortsCache = cohorts;

                    LABKEY.DataRegions = {};
                    qwpResponse = new LABKEY.QueryWebPart({
                        buttonBar: {
                            items:[ 'export' ],
                            position: 'top',
                            showUpdateColumn: false
                        },
                        filters: [
                            LABKEY.Filter.create(
                                'arm_accession',
                                cohorts,
                                LABKEY.Filter.Types.IN
                            )
                        ],
                        frame: 'none',
                        queryName: response,
                        schemaName: 'study',
                        viewName: 'GEE'
                    });

                    me.qwpResponse = qwpResponse;

                    cntEmptyPnlData.setVisible( false );
                    cntResponse.setVisible( true );

                    qwpResponse.on( 'render', checkBtnsStatus );
                    qwpResponse.render( cntResponse.getEl() );
                }
            } else {
                qwpResponse = undefined;

                me.qwpResponse = qwpResponse;

                cntEmptyPnlData.setVisible( true );
                cntResponse.setVisible( false );

                checkBtnsStatus();
            }
        };

        var checkBtnsStatus = function(){
            cfGenes.doLayout();

            if (    cbResponse.isValid( true ) &&
                    cfTimePoint.isValid( true ) &&
                    cfCohorts.isValid( true ) &&
                    cfGenes.isValid( true ) &&
                    spnrTextSize.isValid( true ) &&
                    qwpResponse &&
                    qwpResponse.getDataRegion().totalRows
            ){
                btnPlot.setDisabled( false );
            } else {
                btnPlot.setDisabled( true );
            }

            if (    cbResponse.getValue()   == cbResponse.originalValue &&
                    cbTimePoint.getValue()  == cbTimePoint.originalValue &&
                    cbCohorts.getValue()    == cbCohorts.originalValue &&
                    chNormalize.getValue()  == chNormalize.originalValue &&
                    spnrTextSize.getValue() == spnrTextSize.originalValue &&
                    cbShape.getValue()      == cbShape.originalValue &&
                    cbColor.getValue()      == cbColor.originalValue &&
                    cbSize.getValue()       == cbSize.originalValue &&
                    cbAlpha.getValue()      == cbAlpha.originalValue &&
                    rgFacet.getValue().getGroupValue() == rgFacet.initialConfig.value &&
                    fsAdditionalOptions.collapsed
            ){
                btnReset.setDisabled( true );
            } else {
                btnReset.setDisabled( false );
            }
        };

        var manageCbGenesState = function(){
            loadResponse();

            var tempSQL = '',
                tempArray = cbCohorts.getCheckedArray( 'featureSetId' ),
                len = tempArray.length
            ;
            if ( len >= 1 ){
                cbGenes.setDisabled( false );
                tempSQL +=  strngSqlStartGenes +
                            strngSqlWhereGenes +
                            tempArray[0];
                if ( len > 1 ) {
                    for ( var i = 1; i < len; i ++ ){
                        tempSQL +=  strngSqlIntersectGenes +
                                    strngSqlStartGenes +
                                    strngSqlWhereGenes +
                                    tempArray[i];
                    }
                }
            } else {
                cbGenes.clearValue();
                cbGenes.clearInvalid();
                cbGenes.setDisabled( true );
            }
            strGene.setSql( tempSQL );
            cbGenes.lastQuery = null;
            cbGenes.reset();

            checkBtnsStatus();
        };

        // Help text
        var response_help  = 'The variable to plot against the expression of selected genes. For HAI, the timepoint of peak immunogenicity is selected.';
        var timepoint_help = 'The gene-expression time point to plot.';
        var cohort_help    = 'The cohorts with participants of interest. Some cohorts might only be available at specific timepoints.';
        var normalize_help = 'Should the data be normalized to baseline (i.e. subtract the day 0 response after log transformation), or simply plot the unnormalized data.';
        var genes_help     = 'The genes to plot.';
        var interactive_help = 'If checked, an interactive plot will be displayed (created by plotly).';
        var textsize_help  = 'The size of all text elements on the plot (Including axis, legend and labels).';
        var facet_help     = 'The plot will facet by cohorts on the y axis and genes on the x axis. In "grid" mode, the scales are consistent for a gene and for a cohort. In "wrap" mode, the scales are free.<br> Use wrap if you observe empty spaces in the plots. "wrap" is also more appropriate when plotting many genes and a single cohort.';
        var shape_help     = 'The shape of the data points.';
        var color_help     = 'The color of the data points. (Age is selected by default)';
        var size_help      = 'The size of the data points.';
        var alpha_help     = 'The transparency of the data points.';


        ///////////////////////////////////
        //            Stores             //
        ///////////////////////////////////

        var strCohort = new LABKEY.ext.Store({
            autoLoad: false,
            containerFilter: 'CurrentAndSubfolders',
            listeners: {
                load: function(){

                    // remap FeatureAnnotationSetIds if necessary to be latest anno
                    LABKEY.Query.selectRows({
                        schemaName: 'microarray',
                        queryName: 'fasMap',
                        success: function(results){
                            var currIds = Ext.pluck( results.rows, 'currId');
                            var origIds = Ext.pluck( results.rows, 'origId');

                            cbCohorts.store.data.items.forEach( function(item){
                                if( !currIds.includes( item.data.featureSetId) ){
                                    item.data.featureSetId = currIds[ origIds.indexOf( item.data.featureSetId )];
                                } 
                            })

                            cbCohorts.setDisabled( cbCohorts.store.getCount() === 0 );
                            checkBtnsStatus();
                            cbTimePoint.triggerBlur();
                            cbCohorts.focus( 100 );
                            cbCohorts.expand();
                        }
                    })
                },
                loadexception: LABKEY.ext.ISCore.onFailure
            },
            queryName: 'GEE_studyCohortsInfo',
            schemaName: 'study'
        });

        var strTimePoint = new LABKEY.ext.Store({
            autoLoad: true,
            listeners: { 
                loadexception: LABKEY.ext.ISCore.onFailure
            },
            queryName: 'GEE_timepoints',
            schemaName: 'study'
        });

        var strngSqlStartGenes      =   'SELECT' +
                                        ' DISTINCT GeneSymbol AS gene_symbol' +
                                        ' FROM featureannotation',
            strngSqlWhereGenes      =   ' WHERE featureannotationsetid = ',
            strngSqlIntersectGenes  =   ' INTERSECT '
        ; 

        var strGene = new LABKEY.ext.Store({
            hasMultiSort: true,
            listeners: {
                loadexception: LABKEY.ext.ISCore.onFailure
            },
            multiSortInfo: {
                sorters: [{ field: 'gene_symbol', direction: 'ASC' }]
            },
            remoteSort: false,
            schemaName: 'Microarray',
            sql: strngSqlStartGenes
        });

        var strDemographics = new Ext.data.ArrayStore({
            data: [
                [ 'Age', 'Age' ],
                [ 'Gender', 'Gender' ],
                [ 'Race', 'Race' ]
            ],
            fields: [ 'name', 'name' ]
        });

        var strShape = new Ext.data.ArrayStore({
            data: [
                [ 'Gender', 'Gender' ],
                [ 'Race', 'Race' ]
            ],
            fields: [ 'name', 'name' ]
        });


        /////////////////////////////////////
        //     ComboBoxes / TextFields     //
        /////////////////////////////////////

        var cbResponse = new Ext.ux.form.ExtendedComboBox({
            allowBlank: false,
            displayField: 'name',
            fieldLabel: 'Response',
            lazyInit: false,
            listeners: {
                change: checkBtnsStatus,
                cleared: checkBtnsStatus,
                select: checkBtnsStatus
            },
            store: new Ext.data.ArrayStore({
                data: [ [ 'HAI', 'HAI' ] ],
                fields: [ 'name', 'name' ]
            }),
            value: 'HAI',
            valueField: 'name',
            width: fieldWidth,
            cls: 'ui-test-response'
        });

        var cbTimePoint = new Ext.ux.form.ExtendedComboBox({
            allowBlank: false,
            disabled: true,
            displayField: 'displayTimepoint',
            fieldLabel: 'Time point',
            lazyInit: false,
            listeners: {
                change: function(){
                    if ( ! flagTimePointSelect ){
                        handleTimepointSelection();
                    }
                },
                cleared: handleTimepointSelection,
                focus: function(){
                    flagTimePointSelect = false;
                },
                select: function(){
                    flagTimePointSelect = true;

                    handleTimepointSelection();
                }
            },
            store: strTimePoint,
            valueField: 'displayTimepoint',
            width: fieldWidth,
            cls: 'ui-test-timepoint'
        });

        strTimePoint.on(
            'load',
            function(){
                if ( this.getCount() > 0 ){
                    cbTimePoint.setDisabled( false );

                    var value, unit, cohort
                        field = new Ext.data.Field({ name: 'displayTimepoint' });
                    this.recordType.prototype.fields.replace( field );
                    this.each( function( r ){
                        if ( r.data[ field.name ] == undefined ){
                            value                   = r.data[ 'timepoint' ];
                            unit                    = r.data[ 'timepointUnit' ];
                            cohort                  = r.data[ 'cohortCount' ];
                            r.data[ field.name ]    = Ext.util.Format.plural( value, unit.slice( 0, unit.length - 1 ) ) +
                                                        ' (' + Ext.util.Format.plural( cohort, 'cohort' ) + ')';
                        }
                    });

                    cbTimePoint.bindStore( this );
                }
            }
        );

        var cbCohorts = new Ext.ux.form.ExtendedLovCombo({
            allowBlank: false,
            displayField: 'display',
            fieldLabel: 'Cohorts',
            lazyInit: false,
            disabled: true,
            listeners: {
                blur:       function(){
                    cbGenes.focus( 100 );
                    cbGenes.onTriggerClick();
                },
                change:     manageCbGenesState,
                cleared:    manageCbGenesState,
                select:     manageCbGenesState
            },
            separator: ',', // ';' IS IMPORTANT FOR LABKEY FILTERING, MUST ADJUST DOWNSTREAM LOGIC
            store: strCohort,
            valueField: 'display',
            width: fieldWidth,
            cls: 'ui-test-cohorts'
        });

        var cbGenes = new Ext.ux.form.SuperBoxSelect({
            allowBlank: false,
            backspaceDeletesLastItem: false,
            disabled: true,
            displayField: 'gene_symbol',
            extraItemCls : 'x-panel-header',
            fieldLabel: 'Genes',
            getParams: function( q ){
                this.store.setUserFilters([
                    LABKEY.Filter.create(
                        this.valueField,
                        q,
                        LABKEY.Filter.Types.CONTAINS
                    )
                ]);

                return Ext.ux.form.SuperBoxSelect.prototype.getParams.call( this, q );
            },
            itemFocusCls: 'x-window-tc',
            itemHoverCls: 'underlined-text',
            lastQuery: null,
            lazyInit: false,
            listeners: {
                additem:    checkBtnsStatus,
                clear:      checkBtnsStatus,
                removeItem: checkBtnsStatus
            },
            markComboMatchCls: 'underlined-text',
            mode: 'remote',
            pageSize: 10,
            store: strGene,
            supressClearValueRemoveEvents: true,
            triggerAction: this.queryParam,
            valueField: 'gene_symbol',
            width: fieldWidth,
            cls: 'ui-test-genes'
        });

        var cbColor = new Ext.ux.form.ExtendedComboBox({
            displayField: 'name',
            fieldLabel: 'Color',
            lazyInit: false,
            store: strDemographics,
            value: 'Age',
            valueField: 'name',
            width: fieldWidth,
            cls: 'ui-test-color'
        });

        var cbShape = new Ext.ux.form.ExtendedComboBox({
            displayField: 'name',
            fieldLabel: 'Shape',
            lazyInit: false,
            store: strShape,
            valueField: 'name',
            width: fieldWidth,
            cls: 'ui-test-shape'
        });

        var cbSize = new Ext.ux.form.ExtendedComboBox({
            displayField: 'name',
            fieldLabel: 'Size',
            lazyInit: false,
            store: strDemographics,
            valueField: 'name',
            width: fieldWidth,
            cls: 'ui-test-size'
        });

        var cbAlpha = new Ext.ux.form.ExtendedComboBox({
            displayField: 'name',
            fieldLabel: 'Alpha',
            lazyInit: false,
            store: strDemographics,
            valueField: 'name',
            width: fieldWidth,
            cls: 'ui-test-alpha'
        });


        ///////////////////////////////////////
        // Buttons, Radio Groups, Checkboxes //
        ///////////////////////////////////////
        var chInteractive = new Ext.form.Checkbox({
            fieldLabel: 'Interactive visualization',
            width: fieldWidth,
            cls: 'ui-test-interactive'
        });

        var chNormalize = new Ext.form.Checkbox({
            setDisabledBasedOnFlag: function( flag ){
                if ( flag ){
                    this.setDisabled( true );
                    this.setValue( false );
                } else{
                    this.setDisabled( false );
                }
            },
            fieldLabel: 'Normalize to baseline',
            width: fieldWidth,
            cls: 'ui-test-normalize'
        });

        var btnPlot = new Ext.Button({
            disabled: true,
            handler: function(){
                var
                    width = Math.min( cntPlot.getWidth(), 800 ),
                    filters = []
                ;

                Ext.each( qwpResponse.getDataRegion().getUserFilterArray(), function( f ){
                    filters.push({ fieldKey: f.getColumnName(), op: f.getFilterType().getURLSuffix(), value: f.getValue() });
                });

                cnfPlot.inputParams = {
                    //Input parameters
                    response:           cbResponse.getValue(),
                    cohorts:            Ext.encode( cbCohorts.getCheckedArray( 'cohort_type' ) ),
                    ema:                Ext.encode( cbCohorts.getCheckedArray( 'expression_matrix_accession' ) ),
                    timePoint:          cbTimePoint.getSelectedField( 'timepoint' ),
                    timePointUnit:      cbTimePoint.getSelectedField( 'timepointUnit' ),
                    normalize:          chNormalize.getValue(),
                    genes:              Ext.encode( cbGenes.getValuesAsArray() ),
                    interactive:        chInteractive.getValue(),
                    //Data grid
                    filters:            Ext.encode( filters ),
                    textSize:           spnrTextSize.getValue(),
                    //Additional parameters
                    facet:              rgFacet.getValue().getGroupValue(),
                    shape:              cbShape.getValue(),
                    color:              cbColor.getValue(),
                    size:               cbSize.getValue(),
                    alpha:              cbAlpha.getValue(),

                    imageWidth:         width,
                    imageHeight:        width
                };

                setPlotRunning( true );
                cnfPlot.reportSessionId = reportSessionId;
                LABKEY.Report.execute( cnfPlot );
            },
            text: 'Plot',
            cls: 'ui-test-plot'
        });

        var btnReset = new Ext.Button({
            disabled: true,
            handler: function(){
                Ext.each(
                    [
                        cbResponse,
                        cbTimePoint,
                        cbCohorts,
                        chNormalize,
                        cbGenes,
                        chInteractive,
                        spnrTextSize,
                        rgFacet,
                        cbShape,
                        cbColor,
                        cbSize,
                        cbAlpha
                    ],
                    function( e ){ e.reset(); }
                );

                cbCohorts.setDisabled( true );
                cbGenes.setDisabled( true );
                loadResponse();

                fsAdditionalOptions.collapse();
            },
            text: 'Reset',
            cls: 'ui-test-reset'
        });

        var spnrTextSize = new Ext.ux.form.SpinnerField({
            allowBlank: false,
            allowDecimals: false,
            fieldLabel: 'Text size',
            listeners: {
                afterrender: {
                    fn: function(){
                        this.on( 'valid', checkBtnsStatus );
                    },
                    single: true
                },
                invalid: checkBtnsStatus
            },
            maxValue: 30,
            minValue: 0,
            value: 18,
            width: fieldWidth,
            cls: 'ui-test-textsize'
        });

        var rgFacet = new Ext.Panel({
            border: false,
            clearInvalid: Ext.emptyFn,
            defaults: {
                border: false,
                flex: 1,
                layout: 'fit'
            },
            eachItem: function( fn, scope ){
                if ( this.items && this.items.each ){
                    this.items.each( function(e){
                        if ( e.items && e.items.each && e.items.length == 1 ){
                            e.items.each( fn, scope || this );
                        }
                    });
                }
            },
            fieldLabel: 'Facet',
            getValue: Ext.form.RadioGroup.prototype.getValue,
            items: [
                { items:
                    new Ext.form.Radio({
                        boxLabel: 'grid',
                        checked: true,
                        inputValue: 'Grid',
                        name: 'facet',
                        value: 'Grid',
                        cls: 'ui-test-facet-grid'
                    })
                },
                { items:
                    new Ext.form.Radio({
                        boxLabel: 'wrap',
                        inputValue: 'Wrap',
                        name: 'facet',
                        value: 'Wrap',
                        cls: 'ui-test-facet-wrap'
                    })
                }
            ],
            layout: 'hbox',
            onDisable: Ext.form.RadioGroup.prototype.onDisable,
            onEnable: Ext.form.RadioGroup.prototype.onEnable,
            reset: Ext.form.RadioGroup.prototype.reset,
            value: 'Grid',
            width: fieldWidth,
            cls: 'ui-test-facet'
        });
        var rg = new Ext.form.RadioGroup({
            fieldLabel: 'Facet',
            items: [
                {
                    boxLabel: 'grid',
                    checked: true,
                    inputValue: 'Grid',
                    name: 'facet',
                    value: 'Grid'
                },{
                    boxLabel: 'wrap',
                    inputValue: 'Wrap',
                    name: 'facet',
                    value: 'Wrap'
                }
            ],
            value: 'Grid'
        });


        /////////////////////////////////////
        //      Back-end Configuration     //
        /////////////////////////////////////

        var resizableImage;

        var cnfPlot = {
            failure: function( errorInfo, options, responseObj ){
                setPlotRunning( false );

                LABKEY.ext.ISCore.onFailure( errorInfo, options, responseObj );
            },
            reportId: 'module:GeneExpressionExplorer/GeneExpressionExplorer.Rmd',
            success: function( result ){
                setPlotRunning( false );

                var errors = result.errors;
                var outputParams = result.outputParams;

                if (errors && errors.length > 0){
                    if ( errors[0].indexOf('The report session is invalid') < 0 ){

                        LABKEY.ext.ISCore.onFailure({
                            exception: errors.join('\n')
                        });
                    } else {
                        LABKEY.Report.createSession({
                            clientContext : 'GeneExpressionExplorer' + LABKEY.ActionURL.getContainer(),
                            failure: LABKEY.ext.ISCore.onFailure,
                            success: function(data){
                                reportSessionId = data.reportSessionId;

                                setPlotRunning( true );
                                cnfPlot.reportSessionId = reportSessionId;
                                LABKEY.Report.execute( cnfPlot );
                            }
                        });
                    }
                } else {
                    var p = outputParams[0];

                    if ( p && p.type == 'image' ){
                        var imgId = 'img' + config.webPartDivId;
                        cntPlot.update( '<img id=\'' + imgId + '\' src=\'' + p.value + '\' >' );

                        var width = Math.min( cntPlot.getWidth(), 800 );

                        resizableImage = new Ext.Resizable( imgId, {
                            handles: ' ',
                            height: width,
                            preserveRatio: true,
                            width: width,
                            wrap: true
                        });

                        me.resizableImage = resizableImage;

                        // FancyBox plug in usage
                        $('#' + imgId).wrap('<a class=\'fancybox\' data-fancybox-type=\'image\' href=\'' + p.value + '\' />');

                        Ext.QuickTips.register({
                            target: imgId,
                            text: 'Click on the generated plot to see it in full screen'
                        });
                    }

                    if (p && p.type == 'html'){
                        $('#'+cntPlot.id).html(p.value);
                        window.HTMLWidgets.staticRender();
                    }
                }
            }
        };


        /////////////////////////////////////
        //  Panels, Containers, Components //
        /////////////////////////////////////

        var cntPlot = new Ext.Container({
            border: false,
            html: '<div style=\'height: 10px\'></div>'
        });

        var tlbrButtons = new Ext.Toolbar({
            border: true,
            defaults: {
                width: 45
            },
            enableOverflow: true,
            items: [
                btnPlot,
                btnReset
            ]
        });

        var
            cfTimePoint = LABKEY.ext.ISCore.factoryTooltipWrapper( cbTimePoint, 'Time point', timepoint_help ),
            cfCohorts = LABKEY.ext.ISCore.factoryTooltipWrapper( cbCohorts, 'Cohorts', cohort_help ),
            cfGenes = LABKEY.ext.ISCore.factoryTooltipWrapper( cbGenes, 'Genes', genes_help )
        ;

        var fsAdditionalOptions = new Ext.form.FieldSet({
            autoScroll: true,
            collapsed: true,
            collapsible: true,
            items: [
                LABKEY.ext.ISCore.factoryTooltipWrapper( chInteractive, 'Interactive visualization', interactive_help ),
                LABKEY.ext.ISCore.factoryTooltipWrapper( spnrTextSize, 'Text size', textsize_help ),
                LABKEY.ext.ISCore.factoryTooltipWrapper( rgFacet, 'Facet', facet_help ),
                LABKEY.ext.ISCore.factoryTooltipWrapper( cbColor, 'Color', color_help ),
                LABKEY.ext.ISCore.factoryTooltipWrapper( cbShape, 'Shape', shape_help ),
                LABKEY.ext.ISCore.factoryTooltipWrapper( cbSize, 'Size', size_help ),
                LABKEY.ext.ISCore.factoryTooltipWrapper( cbAlpha, 'Alpha', alpha_help )
            ],
            labelWidth: labelWidth,
            listeners: {
                afterrender: {
                    fn: function(){
                        this.on( 'collapse', checkBtnsStatus );
                    },
                    single: true
                },
                expand: checkBtnsStatus
            },
            title: 'Additional options',
            titleCollapse: true,
            cls: 'ui-test-additional-options'
        });

        var pnlInputView = new Ext.form.FormPanel({
            autoScroll: true,
            defaults: {
                autoHeight: true,
                forceLayout: true,
                hideMode: 'offsets'
            },
            deferredRender: false,
            items: [
                new Ext.Container({
                    autoEl: {
                        href: '#',
                        tag: 'a'
                    },
                    cls: 'labkey-text-link',
                    html: 'quick help',
                    listeners: {
                        afterrender: {
                            fn: function(){
                                this.getEl().on( 'click', function(){ LABKEY.help.Tour.show('immport-gee-tour'); } );
                            },
                            single: true
                        }
                    }
                }),
                {
                    bodyStyle: 'padding-top: 10px;',
                    border: false,
                    defaults: {
                        border: false
                    },
                    items: [
                        { html: 'For information and help on how to use the Gene Expression Explorer module, click the' },
                        new Ext.Container({
                            autoEl: {
                                href: '#',
                                tag: 'a'
                            },
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
                            autoEl: {
                                href: '#',
                                tag: 'a'
                            },
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
                        LABKEY.ext.ISCore.factoryTooltipWrapper( cbResponse, 'Response', response_help ),
                        new Ext.Spacer({ height: 10, html: '&nbsp' }),
                        cfTimePoint,
                        cfCohorts,
                        LABKEY.ext.ISCore.factoryTooltipWrapper( chNormalize, 'Normalize to baseline', normalize_help ),
                        cfGenes
                    ],
                    labelWidth: labelWidth,
                    title: 'Parameters',
                    cls: 'ui-test-parameters'
                }),
                fsAdditionalOptions,
                {
                    border: true,
                    items: [
                        tlbrButtons,
                        cntPlot
                    ]
                }
            ],
            tabTip: 'Input / View',
            title: 'Input / View'
        });

        var cntEmptyPnlData = new Ext.Container({
            defaults: {
                border: false
            },
            items: [
                { html: 'Go to the' },
                new Ext.Container({
                    autoEl: {
                        href: '#',
                        tag: 'a'
                    },
                    html: '&nbsp;\'Input / View\'&nbsp;',
                    listeners: {
                        afterrender: {
                            fn: function(){
                                this.getEl().on( 'click', function(){ pnlTabs.setActiveTab( 0 ); } );
                            },
                            single: true
                        }
                    }
                }),
                { html: 'tab to select a response to display below. You will then be able to filter this data here before plotting.' }
            ],
            layout: 'hbox'
        });

        var cntResponse = new Ext.Container({
            defaults: {
                border: false
            },
            items: [],
            layout: 'fit'
        });

        var pnlData = new Ext.Panel({
            autoScroll: true,
            bodyStyle: 'padding: 1px;',
            defaults: {
                autoHeight: true,
                border: false,
                hideMode: 'offsets'
            },
            items: [ cntEmptyPnlData, cntResponse ],
            layout: 'fit',
            tabTip: 'Data',
            title: 'Data'
        });

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
            items: [
                pnlInputView,
                pnlData,
                {
                    defaults: {
                        autoHeight: true,
                        bodyStyle: 'padding-bottom: 1px;',
                        hideMode: 'offsets'
                    },
                    items: [
                        new Ext.form.Label(),
                        new Ext.form.FieldSet({
                            html: 'This module can be used to quickly plot the expression level of one or more genes against a selected immunological response variable (currently limited to HAI) in one or more cohorts.</br>Demographics variables such as gender and age can be added to the plot using aesthetic variables such as color, shape etc.',
                            style: 'margin-top: 5px;',
                            title: 'Description'
                        }),
                        new Ext.form.FieldSet({
                            html: 'Visualization is achieved using the <a href="http://cran.r-project.org/web/packages/ggplot2/index.html" target="_blank">ggplot2</a> and <a href="https://cran.r-project.org/web/packages/plotly/index.html" target="_blank">plotly</a> R packages.',
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
                },
                {
                    defaults: {
                        autoHeight: true,
                        bodyStyle: 'padding-bottom: 1px;',
                        hideMode: 'offsets'
                    },
                    items: [
                        new Ext.form.Label({
                            text: 'The following parameters are required to generate the plot. Note that the valid inputs are dynamically generated and always depends on the data. Some cohorts might not have gene-expression data and some might not be available at all timepoints.'
                        }),
                        new Ext.form.FieldSet({
                            html:   '<b>Response:</b> '  + response_help + '<br><br>' + 
                                    '<b>Time point:</b> ' + timepoint_help + '<br><br>' +
                                    '<b>Cohorts:</b> ' + cohort_help + '<br><br>' +
                                    '<b>Normalize to baseline:</b> ' + normalize_help + '<br><br>' +
                                    '<b>Genes:</b> ' + genes_help,
                              style: 'margin-top: 5px;',
                            title: 'Parameters'
                        }),
                        new Ext.form.Label({
                            text: 'Parameters in the "Additional options" section can be used to customize the plot and modify it based on the demographic data. Available choices are Age, Gender, and Race.'
                        }),
                        new Ext.form.FieldSet({
                            html:   '<b>Interactive visualization:</b> ' + interactive_help + '<br><br>' +
                                    '<b>Text size:</b> ' + textsize_help + '<br><br>' +
                                    '<b>Facet:</b> ' + facet_help + '<br><br>' +
                                    '<b>Shape:</b> ' + shape_help + '<br><br>' +
                                    '<b>Color:</b> ' + color_help + '<br><br>' +
                                    '<b>Size:</b> ' + size_help + '<br><br>' +
                                    '<b>Alpha:</b> ' + alpha_help,
                            style: 'margin-bottom: 2px; margin-top: 5px;',
                            title: 'Additional options'
                        })
                    ],
                    layout: 'fit',
                    tabTip: 'Help',
                    title: 'Help'
                }
            ],
            layoutOnTabChange: true,
            listeners: {
                afterrender: {
                    fn: function(){
                        maskPlot = new Ext.LoadMask(
                            this.getEl(),
                            {
                                msg: LABKEY.ext.ISCore.generatingMessage,
                                msgCls: 'mask-loading'
                            }
                        );
                    },   
                    single: true 
                },
                tabchange: function( tabPanel, activeTab ){
                    if ( activeTab.title == 'Data' ){}
                }
            },
            minTabWidth: 100,
            resizeTabs: true,
            cls: 'uitest-tabs'
        });

        /////////////////////////////////////
        //             Functions           //
        /////////////////////////////////////

        var setPlotRunning = function( bool ){
            if ( bool ){
                maskPlot.show();
            } else {
                maskPlot.hide();
            }

            Ext.each(
                [
                    cbResponse,
                    cbTimePoint,
                    cbCohorts,
                    cbGenes,
                    chInteractive,
                    spnrTextSize,
                    rgFacet,
                    cbColor,
                    cbShape,
                    cbSize,
                    cbAlpha,
                    btnPlot,
                    btnReset
                ],
                function( e ){ e.setDisabled( bool ); }
            )

            if ( bool ){
                chNormalize.setDisabled( bool );
            } else{
                chNormalize.setDisabledBasedOnFlag( cbTimePoint.getSelectedField( 'timepoint' ) <= 0 );
            }
        };


        $('#' + config.webPartDivId)
            .parents('.panel-body')
            .prev()
            .find('.labkey-wp-title-text')
            .wrap(
                '<a href=\'' +
                LABKEY.ActionURL.buildURL(
                    'reports',
                    'runReport',
                    null,
                    {
                        reportId: 'module:GeneExpressionExplorer/reports/schemas/GeneExpressionExplorer.Rmd',
                        tabId: 'Source'
                    }
                ) +
                '\' target=\'_blank\' title=\'Click to open the R source code in a new window\'></a>'
            );

        // jQuery-related

        jQuery('.fancybox').fancybox({
            closeBtn: false,
            helpers: {
                buttons: {
                    tpl:
                        '<div id=\'fancybox-buttons\'>' +
                            '<ul>' +
                                '<li>' +
                                    '<a class=\'btnToggle\' title=\'Toggle size\' href=\'javascript:;\'></a>' +
                                '</li>' +
                                '<li>' +
                                    '<a class=\'btnClose\' title=\'Close\' href=\'javascript:jQuery.fancybox.close();\'></a>' +
                                '</li>' +
                            '</ul>' +
                        '</div>'
                }
            },
            type: 'image'
        });


        this.border         = false;
        this.boxMinWidth    = 370;
        this.cls            = 'ISCore';
        this.frame          = false;
        this.items          = pnlTabs;
        this.layout         = 'fit';
        this.renderTo       = config.webPartDivId;
        this.webPartDivId   = config.webPartDivId;
        this.width          = document.getElementById(config.webPartDivId).offsetWidth;

        this.cntPlot = cntPlot;

        LABKEY.ext.GeneExpressionExplorer.superclass.constructor.apply(this, arguments);

    }, // end constructor

    listeners: {
        afterrender: GEETour
    },   

    resize : function(){
        if ( this.qwpResponse ){
            this.qwpResponse.render();
        }

        if ( this.resizableImage ){
            var width = Math.min( this.cntPlot.getWidth(), 800 );
            this.resizableImage.resizeTo( width, width * this.resizableImage.height / this.resizableImage.width );
        }
    }}); // end GeneExpressionExplorer Panel class

