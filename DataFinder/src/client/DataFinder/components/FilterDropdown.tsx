import * as React from 'react';
import { Filter, FilterCategory, SelectedFilter, FilterCategories, AssayData, SelectedFilters } from '../../typings/CubeData'
import { List} from 'immutable'
import { Flag } from './FilterIndicator'
import { HeatmapSelectorDropdown } from './HeatmapSelector';

// Types 
export interface FilterDropdownProps {
    dimension: string;
    level: string;
    members: FilterCategory[];
    filterClick: (dim: string, filter: Filter) => () => void;
    selected: List<string>;
    label?: string;
}

interface FilterSelectorProps {
    dim: string ;
    level: string;
    label: string;
    levelSelectedFilters: SelectedFilter;
    levelFilterCategories: FilterCategory[];
    filterClick: (dim: string, filter: Filter) => () => void;
    includeIndicators?: boolean;
    includeAndOr?: boolean;
    andOrClick?: (value: string) => void;
}

interface ContentDropdownProps {
    id: string
    label: string;
    content?: JSX.Element;
    customMenuClass?: string;
    disabled?: boolean
}

interface AndOrDropdownProps {
    status?: string;
    onClick: (value: string) => void;
}

interface StudyFiltersProps {
    studySelectedFilters: Map<string, SelectedFilter>;
    filterCategories: FilterCategories;
    filterClick: (dim: string, filter: Filter) => () => void;
}

interface SubjectFiltersProps {
    subjectSelectedFilters: Map<string, SelectedFilter>;
    filterCategories: FilterCategories;
    filterClick: (dim: string, filter: Filter) => () => void;
}

interface AssayFiltersProps {
    assaySelectedFilters: any;
    filterCategories: FilterCategories;
    filterClick: (dim: string, filter: Filter) => () => void;
    clickAndOr: (dim: string, level: string) => (value: string) => void;
    assayPlotData: AssayData;
}

interface DataFinderFilterProps {
    selectedFilters: SelectedFilters;
    filterCategories: FilterCategories;
    filterClick: (dim: string, filter: Filter) => () => void;
    clickAndOr: (dim: string, level: string) => (value: string) => void;
    assayPlotData: AssayData;
}

export const FilterDropdownContent: React.FC<FilterDropdownProps> = 
({ 
        dimension, 
        level, 
        members, 
        filterClick, 
        selected
    }) => {

    const labels = members.map(m => m.label)
    return(
            <div id={level} className="form-group">
                {labels.map((e) => {
                    let checked: boolean;
                    if (selected == undefined) {
                        checked = false
                    } else if (selected.includes(e)) {
                        checked = true;
                    } else {
                        checked = false;
                    }

                    return (
                        <div className="checkbox" key={e}>
                            <label >
                                <input
                                    onClick={filterClick(dimension, { level: level, member: e })}
                                    type="checkbox"
                                    name={level}
                                    value={e}
                                    checked={checked}
                                    readOnly />
                                <span>{e}</span>
                            </label>
                        </div>
                    )
                })}
            </div>
    )
}


export const ContentDropdown: React.FC<ContentDropdownProps> = ({ id, label, content, customMenuClass, disabled, children }) => {
    return (
        <>
            <div className={"dropdown"}>
                <div id={"df-content-dropdown-" + id} className={"btn-group filterselector" + disabled && " disabled"} role="group" >
                    <button 
                        id={"content-dropdown-button-" + id} 
                        className="btn btn-default dropdown-toggle filter-dropdown-button" 
                        type="button" 
                        onClick={() => {
                            const cl = document.getElementById("df-content-dropdown-" + id).classList
                            const willOpen = !cl.contains("open")
                            for (let el of document.getElementsByClassName('filterselector open')) {
                                el.classList.remove("open")
                            };
                            if (willOpen) {
                                cl.add("open")
                            }
                        }}
                        >
                        <span>{label}</span>
                        <span style={{float:"right"}}><i className="fa fa-caret-down"></i></span>
                    </button>
                    <div className={"dropdown-menu " + (customMenuClass || "")}>
                        {content}
                    </div>
                    {children}
                </div>
            </div>
        </>
    )
}

export const AndOrDropdown: React.FC<AndOrDropdownProps> = ({ status, onClick }) => {
    if (status == undefined) status = "OR"
    const statusText = {
        AND: "All of",
        OR: "Any of"
    }

    const buttonData = [
        {
            label: statusText.AND,
            action: () => onClick("AND"),
            disabled: false
        },
        {
            label: statusText.OR,
            action: () => onClick("OR"),
            disabled: false
        }
    ]
    const title = statusText[status]
    return (
        <div className="dropdown" style={{ float: "left", display: "inline-block"}}>
            <div className="btn df-dropdown-button df-andor-dropdown" role="group" >
                <button className="btn btn-default dropdown-toggle" 
                        type="button" 
                        id={"button-" + title} 
                        data-toggle="dropdown" 
                        aria-haspopup="true" 
                        aria-expanded="true"
                        style={{display: 'inline-block'}}
                >
                    <span>{title}</span>
                    <span style={{paddingLeft: "5px"}}><i className="fa fa-caret-down"></i></span>
                </button>
                <ul className="dropdown-menu" aria-labelledby={"button-" + title} style={{left: "15px"}}>
                    {buttonData.map((button) => {
                        return (
                            <li className={button.disabled ? "disabled" : ""}>
                                <a key={button.label} onClick={button.action} href="#">
                                    {button.label}
                                </a>
                            </li>
                        )
                    })}
                </ul>

            </div>
        </div>
    )
}



const FilterSelectorFC: React.FC<FilterSelectorProps> = ({
    dim, 
    level, 
    label,
    filterClick, 
    levelSelectedFilters,
    levelFilterCategories,

    includeIndicators, 
    includeAndOr, 
    andOrClick,
}) => {
    if (includeIndicators === undefined) includeIndicators = true;
    if (includeAndOr === undefined) includeAndOr = false;
    

    return(
        <>
            {includeAndOr &&
                <AndOrDropdown status={levelSelectedFilters?.get("operator") ?? "OR"}
                    onClick={andOrClick} />
            }
            
            <ContentDropdown
                id={level}
                label={label}
                customMenuClass="df-dropdown filter-dropdown"
                content={
                    <FilterDropdownContent
                        dimension={dim}
                        level={level}
                        members={levelFilterCategories}
                        filterClick={filterClick}
                        selected={levelSelectedFilters?.get("members")}
                    />}>
                {includeIndicators &&
                    levelSelectedFilters &&
                    <div className="filter-indicator-list">
                        {levelSelectedFilters?.get("members").map((member) => {
                            return (
                                <Flag dim={dim}
                                    onDelete={filterClick(dim, { level: level, member: member })} >
                                    {member}
                                </Flag>
                            )
                        })}
                    </div>
                }
            </ContentDropdown>
        </>
    )
    
}
export const FilterSelector = React.memo(FilterSelectorFC)

export const StudyFilters: React.FC<StudyFiltersProps> = ({studySelectedFilters, filterCategories, filterClick}) => {
    
    return <>
        <FilterSelector 
            dim="Study" 
            level="ExposureMaterial" 
            label="Exposure Material" 
            levelSelectedFilters={studySelectedFilters.get("ExposureMaterial")}
            levelFilterCategories={filterCategories.ExposureMaterial}
            filterClick={filterClick}/>
        <FilterSelector 
            dim="Study" 
            level="Condition" 
            label="Condition" 
            levelSelectedFilters={studySelectedFilters.get("Condition")}
            levelFilterCategories={filterCategories.Condition}
            filterClick={filterClick}/>
        <FilterSelector
            dim="Study"
            level="ResearchFocus"
            label="Research Focus"
            levelSelectedFilters={studySelectedFilters.get("ResearchFocus")}
            levelFilterCategories={filterCategories.ResearchFocus}
            filterClick={filterClick}/>
        <FilterSelector 
            dim="Study" 
            level="ExposureProcess" 
            label="Exposure Process" 
            levelSelectedFilters={studySelectedFilters.get("ExposureProcess")}
            levelFilterCategories={filterCategories.ExposureProcess}
            filterClick={filterClick}/>
        <FilterSelector 
            dim="Study" 
            level="Species" 
            label="Species" 
            levelSelectedFilters={studySelectedFilters.get("Species")}
            levelFilterCategories={filterCategories.Species}
            filterClick={filterClick}/>
        <FilterSelector 
            dim="Study" 
            level="Study" 
            label="Study" 
            levelSelectedFilters={studySelectedFilters.get("Study")}
            levelFilterCategories={filterCategories.Study}
            filterClick={filterClick}/>
    </>
}

export const SubjectFilters: React.FC<SubjectFiltersProps> = ({subjectSelectedFilters, filterCategories, filterClick}) => {
    return <>
    <FilterSelector
        dim="Subject"
        level="Gender"
        label="Gender"
        levelSelectedFilters={subjectSelectedFilters.get("Gender")}
        levelFilterCategories={filterCategories.Gender}
        filterClick={filterClick}/>
    <FilterSelector
        dim="Subject"
        level="Age"
        label="Age"
        levelSelectedFilters={subjectSelectedFilters.get("Age")}
        levelFilterCategories={filterCategories.Age}
        filterClick={filterClick}/>
    <FilterSelector
        dim="Subject"
        level="Race"
        label="Race"
        levelSelectedFilters={subjectSelectedFilters.get("Race")}
        levelFilterCategories={filterCategories.Race}
        filterClick={filterClick}/>

    </>
}

export const AssayFilters: React.FC<AssayFiltersProps> = ({assaySelectedFilters, filterCategories, filterClick, clickAndOr, assayPlotData}) => {
    return <>
    <FilterSelector
        dim="Data"
        level="Assay.Assay"
        label="Assay"
        levelSelectedFilters={assaySelectedFilters.getIn(["Assay", "Assay"])}
        levelFilterCategories={filterCategories.Assay}
        filterClick={filterClick}
        includeAndOr={true}
        andOrClick={clickAndOr("Data", "Assay.Assay")}/>

    <FilterSelector
        dim="Data"
        level="SampleType.SampleType"
        label="Sample Type"
        levelSelectedFilters={assaySelectedFilters.getIn(["SampleType", "SampleType"])}
        levelFilterCategories={filterCategories.SampleType}
        filterClick={filterClick}
        includeAndOr={true}
        andOrClick={clickAndOr("Data", "SampleType.SampleType")}/>
    {filterCategories.SampleTypeAssay && assayPlotData && 
        <HeatmapSelectorDropdown
            data={assayPlotData} 
            filterClick={filterClick} 
            selectedDataFilters={assaySelectedFilters}
            timepointCategories={filterCategories.Timepoint}
            sampleTypeAssayCategories={filterCategories.SampleTypeAssay}
            clickAndOr={clickAndOr}/>
    }
    </>
}

const FilterSet : React.FC = (({children}) => {
    return(
        <div style={{float: "left", padding: "10px"}}>
            {children}
        </div>
    )
})

const DataFinderFiltersFC: React.FC<DataFinderFilterProps> = ({
    selectedFilters,
    filterCategories,
    filterClick,
    clickAndOr,
    assayPlotData
}) => {
    return <>
        <FilterSet>
            <StudyFilters 
                studySelectedFilters={selectedFilters.get("Study")}
                filterCategories={filterCategories}
                filterClick={filterClick}/>
        </FilterSet>
        <FilterSet>
            <SubjectFilters
                subjectSelectedFilters={selectedFilters.get("Subject")}
                filterClick={filterClick}
                filterCategories={filterCategories}/>
        </FilterSet>
        <FilterSet>
            <AssayFilters
                assaySelectedFilters={selectedFilters.get("Data")}
                filterCategories={filterCategories}
                filterClick={filterClick}
                clickAndOr={clickAndOr}
                assayPlotData={assayPlotData}/>
        </FilterSet>
    </>
}
export const DataFinderFilters = React.memo(DataFinderFiltersFC)
