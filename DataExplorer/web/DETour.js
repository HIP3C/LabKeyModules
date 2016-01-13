var DETour = function(){
    LABKEY.help.Tour.register({
        id: 'immport-dataexplorer-tour',
        steps: [{
            title: 'Data Explorer Tour',
            content: 'The following few steps will take you through the UI elements of the Data Explorer module',
            target: $('.labkey-wp-title-text')[0],
            placement: 'top',
            showNextButton: true
        },{
            title: 'Input',
            content: 'This is the main tab, where the parameters are set and the plot will be rendered.',
            target: $('.x-tab-strip-inner')[0],
            placement: 'top',
            showPrevButton: true,
            showNextButton: true
        },{
            title: 'Parameters',
            content: 'Select an assay type to visualize and a plot type. Some plot types are more adapated than others to specific datasets. When in doubt, select "auto" and the module will guess a sensible way of displaying the selected data.<br>Normalize to baseline will subtract day 0 response after log transformation.',
            target: $('.x-fieldset-header-text')[0],
            placement: 'top',
            showPrevButton: true,
            showNextButton: true
        },{
            title: 'Additional Options',
            content: 'Customize the plot using additional options. This also lets you map aesthetics of the plot to demographics (e.g: color based on the age of the participants). Options are dynamically generated depending on the plot type.', 
            target: $('.x-fieldset-header-text')[1],
            placement: 'top',
            showPrevButton: true,
            showNextButton: true
        },{
            title: 'Data Grid',
            content: 'After selecting a dataset, click this tab to see the grid. There, the data can be filtered like in any other data grid and only the selected rows will be shown in the resulting plot.',
            target: $('.x-tab-strip-inner')[1],
            placement: 'top',
            showPrevButton: true,
            showNextButton: true
        },{
            title: 'About',
            content: 'This tab contains a short description of the module, some technical details and information about the author(s).',
            target: $('.x-tab-strip-inner')[2],
            placement: 'top',
            showPrevButton: true,
            showNextButton: true
        },{
            title: 'Help',
            content: 'Finally, for more information and detailed parameter description, click the Help tab.',
            target: $('.x-tab-strip-inner')[3],
            placement: 'top',
            showPrevButton: true
        }]
    });
};

