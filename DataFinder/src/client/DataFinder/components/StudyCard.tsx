import * as React from 'react';
import { CurrentStudyInfo } from '../../typings/StudyCard';

// Types
interface StudyPropertyProps {
    key: string;
    label: string;
    value: string;
}

interface StudyPropertiesProps {
    studyProperties: StudyProperty[];
}

interface StudyProgressBarProps {
    totalParticipantCount: number;
    selectedParticipantCount: number;
}

interface StudyProperty {
    label: string;
    value: string;
}

interface StudyCardProps {
    key: string;
    study: CurrentStudyInfo;
}

// Components
const StudyProperty: React.FC<StudyPropertyProps> = (props) => {
    const labelStyle: React.CSSProperties = {
        fontWeight: "bold",
    }
    return (
        <p className="card-text"><span style={labelStyle}>{props.label}: </span>{props.value}</p>
    )
}

const StudyProperties: React.FC<StudyPropertiesProps> = (props) => {

    const studyProperties = props.studyProperties.map((property) => {
        return (
            <StudyProperty key={property.label} label={property.label} value={property.value} />
        )
    })

    return (
        <div>
            {studyProperties}
        </div>
    )

}

const StudyProgressBar: React.FC<StudyProgressBarProps> = (props) => {
    const pbarStyle = {
        width: (props.selectedParticipantCount / props.totalParticipantCount * 100) + "%"
    }
    return (
        <div>
            <div className="progress">
                <div className="progress-bar"
                    role="progressbar"
                    aria-valuenow={props.selectedParticipantCount}
                    aria-valuemin={0}
                    aria-valuemax={props.totalParticipantCount}
                    style={pbarStyle}>
                </div>
            </div>
            <p>
                <em>{props.selectedParticipantCount} of {props.totalParticipantCount} participants selected.</em>
            </p>
        </div>
    )
}

export const StudyCard: React.FC<StudyCardProps> = (props) => {
    const study = props.study;
    const studyProperties: StudyProperty[] = [
        {
            label: "Condition",
            value: study.condition_studied
        },
        {
            label: "Sample Type",
            value: study.sample_type[0]
        },
        {
            label: "Assays",
            value: study.assays[0]
        }
    ]

    return (
        <div className="study-card">
            <div className="study-label">
                <div className="checkbox">
                    <label>
                        <input type="checkbox" name="study" value="SDY28" />
                        <span className="study-id">{study.study_accession}</span>
                    </label>
                </div>
                <span className="study-pi">{study.pi_names}</span>
            </div>
            <hr />
            <a href={"./" + study.study_accession + "/begin.view?"} className="labkey-text-link labkey-study-card-goto">
                Go to study
            </a>
            <div className="study-title">
                {study.brief_title}
            </div>
            <StudyProgressBar totalParticipantCount={study.totalParticipantCount} selectedParticipantCount={study.selectedParticipantCount} />
            <StudyProperties studyProperties={studyProperties} />
            {/* <TinyHeatmap data={props.data}/> */}
        </div>
    )
}
