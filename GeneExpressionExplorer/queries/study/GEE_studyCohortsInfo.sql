SELECT DISTINCT
    cohort,
    cell_type,
    cohort || '_' || cell_type AS cohort_type,
    cohort || ' ' || cell_type || ' (' || Containers.Name || ')' AS display,
    study_time_collected AS timepoint,
    LCASE( study_time_collected_unit ) AS timepointUnit,
    expression_matrix_accession,
    Run,
    featureset.RowId AS featureSetId
FROM
    HM_InputSamplesQuery
JOIN
    core.Containers ON HM_InputSamplesQuery.container = Containers.EntityId
WHERE
    participantid IN ( SELECT participantid FROM study.hai )

