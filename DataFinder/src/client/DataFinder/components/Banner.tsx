import React from 'react'
import { FilterSummary } from './FilterIndicator'
import { SelectedFilters, TotalCounts } from '../../typings/CubeData';

interface BannerProps {
    filters: SelectedFilters,
    groupName: string;
    counts: TotalCounts,
    unsavedFilters: boolean,
    links?: JSX.Element,
    dropdowns?: JSX.Element
    id?: string
}
export const Banner: React.FC<BannerProps> = ({ filters, groupName, counts, unsavedFilters, links, dropdowns, id }) => {
    return (
        <>
            <div id={id || "df-filter-banner"} className="row">
                <div className="col-sm-6">
                    <h3><div className="df-banner-title">{groupName}</div>
                        <div >
                            {links && links}
                        </div></h3>


                    <div id="current-participant-group-info-banner" style={{ clear: "left" }}>
                        {unsavedFilters && <>
                            <div style={{ color: "red", display: "inline-block" }}>Changes have not been saved</div>
                            <div style={{ display: "inline-block" }}>
                            </div>
                        </>}
                        <p>{counts.participant} participants from {counts.study} studies</p>
                    </div>
                </div>

                <div className="col-sm-6">
                    {dropdowns && dropdowns}
                </div>

            </div>
            <FilterSummary filters={filters} />
        </>
    )
}