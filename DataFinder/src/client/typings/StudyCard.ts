export interface Filter {
    level: string;
    membersQuery: {
        level: string;
        members: string[];
    }
}
export interface HeatmapData {
    assay: string;
    timepoint: string;
    sampleType: string;
    count: number;
}
export interface StaticStudyInfo {
    assays?: string[];
    brief_title?: string;
    condition_studied?: string;
    heatmapData?: HeatmapData[];
    pi_names?: string[];
    program_title?: string;
    restricted?: boolean;
    sample_type?: string[];
    shared_study?: string;
    study_accession?: string;
    totalParticipantCount?: number;
}
export interface StudyDict {
    [index: string]: StaticStudyInfo;
}
export interface SelectedStudies {
    [index: string]: {
        selectedParticipantCount?: number;
    }
}
export interface CurrentStudyInfo extends StaticStudyInfo {
    selectedParticipantCount: number;
}