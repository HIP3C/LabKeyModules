// NOTE: 
// While experimenting with immutable and typings, I found that I couldn't
// return an immutable object in a typed promise. So I return a regular
// js object, then have an additional function which translates it into the 
// proper immutable object. I'm open to other suggestions. -HM

import { CubeMdx } from "../../typings/Cube";
import * as LABKEY from '@labkey/api';
import { SelectedFilters, CubeData, ICubeData, Filter, CubeDatum } from "../../typings/CubeData";
import * as Cube from '../../typings/Cube'
import { HeatmapDatum, FilterCategories } from '../../typings/CubeData'
import { createCubeFilters } from './SelectedFilters'
import * as StudyCardTypes from '../../typings/StudyCard'
import { StudyParticipantCount } from '../../typings/StudyCard'
import * as Immutable from 'immutable'


const loadedStudiesArray = ["[Study].[SDY1092]", "[Study].[SDY1119]", "[Study].[SDY1291]", "[Study].[SDY903]", "[Study].[SDY28]", "[Study].[SDY514]", "[Study].[SDY387]", "[Study].[SDY34]", "[Study].[SDY1370]", "[Study].[SDY1373]", "[Study].[SDY789]", "[Study].[SDY1260]", "[Study].[SDY1264]", "[Study].[SDY1276]", "[Study].[SDY1328]", "[Study].[SDY296]", "[Study].[SDY301]", "[Study].[SDY63]", "[Study].[SDY74]", "[Study].[SDY312]", "[Study].[SDY314]", "[Study].[SDY315]", "[Study].[SDY478]", "[Study].[SDY113]", "[Study].[SDY305]", "[Study].[SDY472]", "[Study].[SDY395]", "[Study].[SDY406]", "[Study].[SDY460]", "[Study].[SDY773]", "[Study].[SDY421]", "[Study].[SDY461]", "[Study].[SDY675]", "[Study].[SDY400]", "[Study].[SDY404]", "[Study].[SDY614]", "[Study].[SDY112]", "[Study].[SDY888]", "[Study].[SDY1109]", "[Study].[SDY67]", "[Study].[SDY61]", "[Study].[SDY508]", "[Study].[SDY517]", "[Study].[SDY520]", "[Study].[SDY640]", "[Study].[SDY144]", "[Study].[SDY162]", "[Study].[SDY167]", "[Study].[SDY18]", "[Study].[SDY180]", "[Study].[SDY207]", "[Study].[SDY820]", "[Study].[SDY887]", "[Study].[SDY269]", "[Study].[SDY1289]", "[Study].[SDY1293]", "[Study].[SDY1324]", "[Study].[SDY984]", "[Study].[SDY522]", "[Study].[SDY753]", "[Study].[SDY56]", "[Study].[SDY278]", "[Study].[SDY1294]", "[Study].[SDY1325]", "[Study].[SDY1364]", "[Study].[SDY1368]", "[Study].[SDY80]", "[Study].[SDY270]", "[Study].[SDY515]", "[Study].[SDY422]", "[Study].[SDY506]", "[Study].[SDY523]", "[Study].[SDY756]", "[Study].[SDY299]", "[Study].[SDY300]", "[Study].[SDY364]", "[Study].[SDY368]", "[Study].[SDY369]", "[Study].[SDY372]", "[Study].[SDY376]", "[Study].[SDY645]", "[Study].[SDY416]", "[Study].[SDY597]", "[Study].[SDY667]", "[Study].[SDY87]", "[Study].[SDY89]", "[Study].[SDY690]", "[Study].[SDY212]", "[Study].[SDY215]", "[Study].[SDY519]", "[Study].[SDY224]", "[Study].[SDY232]", "[Study].[SDY241]", "[Study].[SDY1041]", "[Study].[SDY1097]"]

// ----- Promises ----- 
// Select Rows --------
// Get filter categories
export const getFilterCategories = (LABKEY) => {
    return new Promise<SelectRowsResponse>((resolve, reject) => {
        LABKEY.Query.selectRows({
            schemaName: 'immport',
            queryName: 'dataFinder_dropdownCategories',
            containerFilter: 'CurrentAndSubfolders',
            success: (data: SelectRowsResponse) => { resolve(data) },
            failure: () => {
                reject();
            }
        })
    })
}

export const getStudyInfo = (LABKEY) => {
    return new Promise<SelectRowsResponse>((resolve, reject) => {
        LABKEY.Query.selectRows({
            schemaName: 'immport',
            queryName: 'dataFinder_studyCard',
            containerFilter: "CurrentAndSubfolders",
            success: (data: SelectRowsResponse) => { resolve(data) }
        })
    })
}

// Cube ---------------
// Study info ---- 
export const getStudyCounts = (mdx: CubeMdx, filters: SelectedFilters) => {
    return new Promise<Cube.CellSet>((resolve, reject) => {
        mdx.query({
            configId: "DataFinder:/DataFinderCube",
            schemaName: 'immport',
            success: function (cs: Cube.CellSet) {
                resolve(cs);
            },
            name: 'DataFinderCube',
            onRows: { level: "[Study].[Name]", members: "members" },
            onCols: {
                operator: "UNION",
                arguments: [
                    { level: "[Subject].[(All)]", members: "members" },
                    { level: "[Data.Assay].[Timepoint]", members: "members" }
                ]
            },
            countDistinctLevel: "[Subject].[Subject]",
            showEmpty: false

        })
    })
}

// Update StudyParticipantCounts from Cube response
export const getStudyParticipantCounts = (mdx: CubeMdx, filters: SelectedFilters) => {

    return new Promise<Cube.CellSet>((resolve, reject) => {
        mdx.query({
            configId: "DataFinder:/DataFinderCube",
            schemaName: 'immport',
            success: function (cs: Cube.CellSet) {
                resolve(cs)
            },
            name: 'DataFinderCube',
            onRows: {
                operator: "UNION",
                arguments: [
                    { level: "[Study].[Name]", members: "members" },
                    { level: "[Subject].[Subject]", members: "members" }
                ]
            },
            countFilter: [{
                level: "[Subject].[Subject]",
                membersQuery: { level: "[Study].[Name]", members: loadedStudiesArray }
            }, ...createCubeFilters(filters)],
            countDistinctLevel: "[Subject].[Subject]",
            showEmpty: false
        })
    })
}

export const getCubeData = (mdx: CubeMdx, filters: SelectedFilters, countLevel: string) => {

    return new Promise<Cube.CellSet>((resolve, reject) => {
        // debugger
        mdx.query({
            configId: "DataFinder:/DataFinderCube",
            schemaName: 'immport',
            success: function (cs: Cube.CellSet, mdx, config) {
                resolve(cs)
            },
            name: 'DataFinderCube',
            onRows: {
                operator: "UNION",
                arguments: [
                    { level: "[Subject.Race].[Race]" },
                    { level: "[Subject.Age].[Age]" },
                    { level: "[Subject.Gender].[Gender]" },
                    { level: "[Subject.ExposureMaterial].[ExposureMaterial]" },
                    { level: "[Subject.ExposureProcess].[ExposureProcess]" },
                    { level: "[Subject.Species].[Species]" },
                    { level: "[Study.Condition].[Condition]" },
                    { level: "[Study.ResearchFocus].[ResearchFocus]" },
                    { level: "[Data.Assay].[Assay]" },
                    { level: "[Data.Assay].[Timepoint]" },
                    { level: "[Data.Assay].[SampleType]" },
                    { level: "[Data.Timepoint].[Timepoint]" },
                    { level: "[Data.SampleType].[SampleType]" },
                    { level: "[Data.SampleType].[Assay]" }
                ]
            },
            countFilter: [{
                level: "[Subject].[Subject]",
                membersQuery: { level: "[Study].[Name]", members: loadedStudiesArray }
            }, ...createCubeFilters(filters)],
            countDistinctLevel: countLevel,
            showEmpty: true

        })

    })
}


export const getTotalCounts = (mdx: CubeMdx, filters: SelectedFilters, countLevel: string) => {
    const onRowsLevel = countLevel == "[Study].[Name]" ? "[Study].[(All)]" : "[Subject].[(All)]"
    return new Promise<Cube.CellSet>((resolve, reject) => {
        mdx.query({
            configId: "DataFinder:/DataFinderCube",
            schemaName: 'immport',
            success: function (cs: Cube.CellSet, mdx, config) {
                resolve(cs)
            },
            name: 'DataFinderCube',
            onRows: {
                level: onRowsLevel, members: "members"
            },
            countFilter: [{
                level: "[Study].[Name]",
                membersQuery: { level: "[Study].[Name]", members: loadedStudiesArray }
            }, ...createCubeFilters(filters)],
            countDistinctLevel: countLevel,
            showEmpty: true
        })
    })
}

/// -----------------------------------------------------------
// 

export const createTotalCounts = ([subjectResponse, studyResponse]) => {
    return ({ study: studyResponse.cells[0][0].value || 0, participant: subjectResponse.cells[0][0].value || 0 })
}

export const createParticipantIds = (participantIdsCs: Cube.CellSet) => {
    return (participantIdsCs.axes[1].positions.map(position => position[0].name))
}

export const createStudyDict = ([studyInfoCs, studyCountCs]: [SelectRowsResponse, Cube.CellSet]) => {
    // combine results and return them

    const studyDict: StudyCardTypes.StudyDict = {};
    studyInfoCs.rows.map((e, i) => {
        const studyInfo = {}
        const studyName = e.study_accession;
        // studyDict[studyName] = studyInfo;
        studyDict[studyName] = { ...e }
    })
    studyCountCs.axes[1].positions.map((e, i) => {
        const studyName = e[0].name;
        const totalParticipantCount = studyCountCs.cells[i][0].value;
        if (studyDict.hasOwnProperty(studyName)) {
            studyDict[studyName] = { totalParticipantCount, ...studyDict[studyName] }
            const heatmapData = studyCountCs.axes[0].positions.map((f, j) => {
                const positionInfo = dataAssayNameToInfo(f[0].uniqueName, true)
                const positionCount = studyCountCs.cells[i][j].value;
                const heatmapDatum: CubeDatum = {
                    level: "Assay.Timepoint",
                    member: positionInfo.assay + "." + positionInfo.timepoint,
                    participantCount: positionCount
                };
                return heatmapDatum
            })
            heatmapData.shift()
            studyDict[studyName].heatmapData = heatmapData;
        }
    })
    // debugger
    return (studyDict)
}


export const createFilterCategories = (categoriesResponse: SelectRowsResponse) => {
    let categories: FilterCategories = {};

    categoriesResponse.rows.forEach((row) => {

        if (categories[row.variable] === undefined) categories[row.variable] = []
        categories[row.variable].push({ label: row.category, sortorder: row.sortorder })
    })
    Object.keys(categories).forEach((key) => {
        categories[key].sort((a, b) => {
            if (a.sortorder == b.sortorder) { if (a.label.toLowerCase() > b.label.toLowerCase()) return (1); else return (-1) }
            return a.sortorder - b.sortorder
        })
    })
    return (categories)
}

export const createStudyParticipantCounts = (studyParticipantCountCs: Cube.CellSet) => {
    const studyParticipantCountArray: StudyCardTypes.IStudyParticipantCount[] = []
    const pids: string[] = []
    studyParticipantCountCs.cells.forEach((cell) => {
        if (cell[0].positions[1][0].level.uniqueName == "[Study].[Name]") {
            const studyName = cell[0].positions[1][0].name
            const participantCount = cell[0].value
            studyParticipantCountArray.push({
                studyName: studyName,
                participantCount: participantCount
            })
        } else {
            const pid = cell[0].positions[1][0].name
            pids.push(pid)
        }
    })

    const studyParticipantCounts = studyParticipantCountArray.map((spc: StudyCardTypes.IStudyParticipantCount) => {
        return (new StudyCardTypes.StudyParticipantCount(spc))
    })
    const countsList = Immutable.List<StudyParticipantCount>(studyParticipantCounts);

    return ({countsList: countsList, pids: pids})
}

const cs2cd = ([participantCounts, studyCounts]: [Cube.CellSet, Cube.CellSet]) => {
    const results: { dim: string, levelArray: string[], data: CubeDatum }[] = participantCounts.cells.map((cell, cellIndex) => {
        const hierarchy = cell[0].positions[1][0].level.uniqueName.replace(/\[|\]/g, "") // remove "[" and "]"
        const cubeDim = hierarchy.replace(/\..+/, "") // remove everything after and including the first "."
        let level = hierarchy.replace(/\w+\./, "") // remove everything before and including the first "."
        // Move some subject filters to "study design"
        const dim = ["Species.Species", "ExposureMaterial.ExposureMaterial", "ExposureProcess.ExposureProcess"].indexOf(level) > -1 ? "Study" : cubeDim
        let levelArray: string[]
        if (level.match("Assay") || level.match("SampleType")) {
            levelArray = level.split(".")
        } else {
            level = level.split(".")[0]
            levelArray = [level]
        }
        const member = cell[0].positions[1][0].uniqueName.replace(/\[\w+\.\w+\]\./, "").replace(/\[|\]/g, "")
        const participantCount = cell[0].value
        const studyCount = studyCounts.cells[cellIndex][0].value

        return ({
            dim: dim,
            levelArray: levelArray,
            data: {
                level: level,
                member: member,
                participantCount: participantCount,
                studyCount: studyCount
            }
        })
    })
    let cubeData: any = new CubeData()
    results.forEach((result) => {
        const members: Immutable.List<string> = cubeData.getIn([result.dim, ...result.levelArray]).push(result.data)
        cubeData = cubeData.setIn([result.dim, ...result.levelArray], members)
    });
    return cubeData.toJS()
}



export const createCubeData = (counts: [Cube.CellSet, Cube.CellSet]) => {
    const cubeData = cs2cd(counts)
    return new CubeData(cubeData);
}




const dataAssayNameToInfo = (name: string, shortAssayNames: boolean = false) => {
    if (/(All)/.test(name)) { return { assay: undefined, timepoint: undefined, sampleType: undefined } }
    const s = name.slice(13).split(/\./g).map(s => s.replace(/[\[\]]/g, ""))
    const info = { assay: s[0], timepoint: s[1], sampleType: s[2] }
    if (shortAssayNames) {
        const shortAssayNameMap = {
            "PCR": "PCR",
            "Neutralizing Antibody": "NAb",
            "MBAA": "MBAA",
            "HLA Typing": "HLA",
            "HAI": "HAI",
            "Gene Expression": "GE",
            "Flow Cytometry": "Flow",
            "ELISPOT": "ELISPOT",
            "ELISA": "ELISA",
            "CyTOF": "CyTOF",
            "KIR": "KIR"
        }
        info.assay = shortAssayNameMap[info.assay];
    }
    return (
        info
    )
}
