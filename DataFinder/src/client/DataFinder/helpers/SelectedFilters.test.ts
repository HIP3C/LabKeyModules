import * as React from 'react'
import * as sf from './SelectedFilters'
import { SelectedFilters, SelectedFilter } from '../../typings/CubeData';
import { List, Map } from 'immutable'

describe('Manipulate Selected Filters', () => {

    test("ToggleFilters", () => {
        const oldFilters = new SelectedFilters()
        const newFilters1 = new SelectedFilters({ Data: { Timepoint: {Timepoint: new SelectedFilter({ members: List(["1"]), operator: "OR" }) } } })
        const newFilters2 = new SelectedFilters({ Data: { Timepoint: {Timepoint: new SelectedFilter({ members: List(["1", "2"]), operator: "OR" }) } } })
        const newFilters3 = new SelectedFilters({ Data: { Assay: { Timepoint: new SelectedFilter({ members: List(["HAI.0"]), operator: "OR" }) } } })
        const newFilters4 = new SelectedFilters({ Subject: { Age: new SelectedFilter({ members: List(["0-10"]), operator: "OR" }) } })
        const newFilters5 = new SelectedFilters({
            Subject: { Age: new SelectedFilter({ members: List(["0-10"]), operator: "OR" }) },
            Data: { Timepoint: {Timepoint:  new SelectedFilter({ members: List(["1"]), operator: "OR" }) } }
        })
        const newFilters6 = new SelectedFilters({ Study: { Study: new SelectedFilter({ members: List(["SDY269"]), operator:  "OR"})}})

        expect(JSON.stringify(sf.toggleFilter("Data", "Timepoint.Timepoint", "1", oldFilters))).toEqual(JSON.stringify(newFilters1))
        expect(JSON.stringify(sf.toggleFilter("Data", "Timepoint.Timepoint", "2", newFilters1))).toEqual(JSON.stringify(newFilters2))
        expect(JSON.stringify(sf.toggleFilter("Data", "Timepoint.Timepoint", "1", newFilters1))).toEqual(JSON.stringify(oldFilters))

        expect(JSON.stringify(sf.toggleFilter("Data", "Assay.Timepoint", "HAI.0", oldFilters))).toEqual(JSON.stringify(newFilters3))

        expect(JSON.stringify(sf.toggleFilter("Subject", "Age", "0-10", oldFilters))).toEqual(JSON.stringify(newFilters4))
        expect(JSON.stringify(sf.toggleFilter("Subject", "Age", "0-10", newFilters1))).toEqual(JSON.stringify(newFilters5))
        expect(JSON.stringify(sf.toggleFilter("Subject", "Age", "0-10", newFilters5))).toEqual(JSON.stringify(newFilters1))

        expect(JSON.stringify(sf.toggleFilter("Study", "Study", "SDY269", oldFilters))).toEqual(JSON.stringify(newFilters6))
        expect(JSON.stringify(sf.toggleFilter("Study", "Study", "SDY269", newFilters6))).toEqual(JSON.stringify(oldFilters))

    })

    test("ToggleAndOr", () => {
        const filtersAnd = new SelectedFilters({ Data: { Timepoint: { Timepoint: new SelectedFilter({ members: List(["1", "2"]), operator: "AND" }) } } })
        const filtersOr = new SelectedFilters({ Data: { Timepoint: { Timepoint: new SelectedFilter({ members: List(["1", "2"]), operator: "OR" }) } } })
        expect(JSON.stringify(sf.toggleAndOr("Data", "Timepoint.Timepoint", filtersAnd))).toEqual(JSON.stringify(filtersOr))
        expect(JSON.stringify(sf.toggleAndOr("Data", "Timepoint.Timepoint", filtersOr))).toEqual(JSON.stringify(filtersAnd))

    })

    test("SetAndOr", () => {
        const filtersAnd = new SelectedFilters({ Data: { Timepoint: { Timepoint: new SelectedFilter({ members: List(["1", "2"]), operator: "AND" }) } } })
        const filtersOr = new SelectedFilters({ Data: { Timepoint: { Timepoint: new SelectedFilter({ members: List(["1", "2"]), operator: "OR" }) } } })
        expect(JSON.stringify(sf.setAndOr("Data", "Timepoint.Timepoint", "AND", filtersAnd))).toEqual(JSON.stringify(filtersAnd))
        expect(JSON.stringify(sf.setAndOr("Data", "Timepoint.Timepoint", "OR", filtersAnd))).toEqual(JSON.stringify(filtersOr))
        expect(JSON.stringify(sf.setAndOr("Data", "Timepoint.Timepoint", "AND", filtersOr))).toEqual(JSON.stringify(filtersAnd))

    })

    test("CreateCubeFilters", () => {
        const input1 = new SelectedFilters({ Data: { Timepoint: {Timepoint: new SelectedFilter({ members: List(["1", "2"]), operator: "AND" }) } } })
        const output1 = [
            {
                level: "[Subject].[Subject]",
                membersQuery: {
                    level: "[Data.Timepoint].[Timepoint]",
                    members: "[Data.Timepoint].[1]"
                }
            },
            {
                level: "[Subject].[Subject]",
                membersQuery: {
                    level: "[Data.Timepoint].[Timepoint]",
                    members: "[Data.Timepoint].[2]"
                }
            }

        ]
        const input2 = new SelectedFilters({ Data: { Assay: { Timepoint: new SelectedFilter({ members: List(["HAI.0"]), operator: "OR" }) } } })
        const output2 = [
            {
                level: "[Subject].[Subject]",
                membersQuery: {
                    level: "[Data.Assay].[Timepoint]",
                    members: ["[Data.Assay].[HAI].[0]"]
                }
            }
        ]
        const input3 = new SelectedFilters({
            Data: { Assay: { Timepoint: new SelectedFilter({ members: List(["HAI.0", "HAI.1"]), operator: "OR" }) } },
            Subject: { Age: new SelectedFilter({ members: List(["0-10"]), operator: "OR" }) }
        })
        const output3 = [
            {
                level: "[Subject].[Subject]",
                membersQuery: {
                    level: "[Subject.Age].[Age]",
                    members: ["[Subject.Age].[0-10]"]
                }
            }, {
                level: "[Subject].[Subject]",
                membersQuery: {
                    level: "[Data.Assay].[Timepoint]",
                    members: ["[Data.Assay].[HAI].[0]", "[Data.Assay].[HAI].[1]"]
                }
            }
        ]
        const input4 = new SelectedFilters({
            Study: { Study: new SelectedFilter({ members: List(["SDY269"]), operator: "OR"}) }
        })
        const output4 = [
            {
                level: "[Subject].[Subject]",
                membersQuery: {
                    level: "[Study].[Name]",
                    members: ["[Study].[SDY269]"]
                }
            }
        ]
        const input5 = new SelectedFilters({
            Data: {
                Assay: {
                    Assay: new SelectedFilter({ members: List(["ELISA"]), operator: "OR" }),
                    Timepoint: new SelectedFilter({ members: [ "HAI.0", "Gene Expression.0" ], operator: "AND"})
                },
            }
        })
        const output5 = [
            {
                level: "[Subject].[Subject]",
                membersQuery: {
                    level: "[Data.Assay].[Assay]",
                    members: ["[Data.Assay].[ELISA]"]
                }
            },
            {
                level: "[Subject].[Subject]",
                membersQuery: {
                    level: "[Data.Assay].[Timepoint]",
                    members: "[Data.Assay].[HAI].[0]"
                }
            },
            {
                level: "[Subject].[Subject]",
                membersQuery: {
                    level: "[Data.Assay].[Timepoint]",
                    members: "[Data.Assay].[Gene Expression].[0]"
                }
            }
        ]

        expect(JSON.stringify(sf.createCubeFilters(input1))).toEqual(JSON.stringify(output1))
        expect(JSON.stringify(sf.createCubeFilters(input2))).toEqual(JSON.stringify(output2))
        expect(JSON.stringify(sf.createCubeFilters(input3))).toEqual(JSON.stringify(output3))
        expect(JSON.stringify(sf.createCubeFilters(input4))).toEqual(JSON.stringify(output4))
        expect(JSON.stringify(sf.createCubeFilters(input5))).toEqual(JSON.stringify(output5))
    })

});