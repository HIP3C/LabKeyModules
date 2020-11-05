import React from "react";
import {DropdownButton, MenuItem, Tab, TabPane, TabContainer} from 'react-bootstrap';
import {
    ScatterPlotDataRange,
    ScatterPlotDatum
} from './PlotComponents/similarStudyScatterPlot'
import {PlotGrid} from './SimilarStudies/plotHelpers'
import {DROPDOWN_OPTIONS} from './SimilarStudies/constants'
import {createSsPlotPropsList} from './SimilarStudies/utils'
import {generateChildId, noop} from "./utils";
        

interface props {
    transformedSsData: ScatterPlotDatum[];
    ssDataRange: ScatterPlotDataRange;
    labkeyBaseUrl: string;
}

// ---- Main ------
export const SimilarStudies = React.memo<props>( ( {transformedSsData, ssDataRange, labkeyBaseUrl}: props) => {
    
    const [plotsToShow, setPlotsToShow] = React.useState(DROPDOWN_OPTIONS[0].value)

    function onSelectChangePlot(eventKey){
        setPlotsToShow(eventKey)
    }

    const makeMenuItem = React.useCallback((selection) => {
        return(
            <MenuItem 
                eventKey={selection.value} 
                key={selection.value}
                onSelect={onSelectChangePlot}>
                    {selection.label}
            </MenuItem>
        )
    }, [])

    const getDropDown = React.useCallback(() => {
        return(
            <div>
                <DropdownButton title='Select Plot Set' id='order-select-dropdown'>
                    {makeMenuItem(DROPDOWN_OPTIONS[0])}
                    {makeMenuItem(DROPDOWN_OPTIONS[1])}
                    {makeMenuItem(DROPDOWN_OPTIONS[2])}
                </DropdownButton>
            </div>
        )
    }, [])

    const makeTabPane = React.useCallback((selection, ssPlotPropsList) => {
        return(
            <TabPane eventKey={selection.value}>
                <PlotGrid plotPropsList={ssPlotPropsList[selection.value]} />
            </TabPane>
        )
    }, [transformedSsData, plotsToShow])

    const getTabContent = React.useCallback(() => {
        
        if(transformedSsData.length > 0){
            const ssPlotPropsList = createSsPlotPropsList(transformedSsData, ssDataRange, labkeyBaseUrl)
            return(
                <Tab.Content>
                    {makeTabPane(DROPDOWN_OPTIONS[0], ssPlotPropsList)}
                    {makeTabPane(DROPDOWN_OPTIONS[1], ssPlotPropsList)}
                    {makeTabPane(DROPDOWN_OPTIONS[2], ssPlotPropsList)}
                </Tab.Content>
            )
        }else{
            return(
                <div>
                    <i aria-hidden="true" className="fa fa-spinner fa-pulse" style={{marginRight:'5px'}}/>
                    Loading plots ...
                </div>
            )
        }
        
    }, [transformedSsData, plotsToShow])

    return(
        <TabContainer activeKey={plotsToShow} generateChildId={generateChildId} onSelect={noop}>
            <div id="similar-studies-content">
                <h2>Similar Studies based on Assay Data or Study Design</h2>
                <p>The plots below show the results of a UMAP dimension reduction analysis of studies based on their meta-data, including assay data available, study design characteristics, and condition studied. Binary factor distance is measured using the Jaccard method, while continuous variables use Euclidean distance.</p>
                <p><b>For More Information:</b></p>
                <ul>
                    <li>Hover over a point for a link to the study overview page</li>
                    <li>Toggle between plots with LABELS for Assay Data Available, Study Design, or Condition Studied using the dropdown menu</li>
                </ul>
                <br></br>
                {getDropDown()}
                {getTabContent()}
            </div>
        </TabContainer>
    )
})