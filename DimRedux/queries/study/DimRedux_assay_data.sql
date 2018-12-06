-- List the datasets available (is also properly filtered by the Data Finder)
SELECT
  dataset_n.pid AS participantId,
  dataset_n.Name,
    dataset_n.Label,
    dataset_n.study_time_collected || ' ' || dataset_n.study_time_collected_unit AS timepoint,
  dataset_n.features
FROM
    (
       SELECT
         study_time_collected,
         study_time_collected_unit,
         participantid AS pid,
         COUNT(population_definition_reported) AS features,
         'fcs_analyzed_result' AS Name,
         'Flow Cytometry' AS Label
       FROM
          fcs_analyzed_result
       GROUP BY
         study_time_collected, study_time_collected_unit, participantid

       UNION
       
       SELECT
         study_time_collected,
         study_time_collected_unit,
         participantid AS pid,
         COUNT(analyte) AS features,
         'mbaa' AS Name,
         'MBAA' AS Label
       FROM
          mbaa
       GROUP BY
         study_time_collected, study_time_collected_unit, participantid

       UNION
       
       SELECT
         study_time_collected,
         study_time_collected_unit,
         participantid AS pid,
         COUNT(analyte) AS features,
         'elisa' AS Name,
         'ELISA' AS Label
       FROM
          elisa
       GROUP BY
         study_time_collected, study_time_collected_unit, participantid

       UNION
       
       SELECT
         study_time_collected,
         study_time_collected_unit,
         participantid AS pid,
         COUNT(analyte) AS features,
         'elispot' AS Name,
         'ELISPOT' AS Label
       FROM
          elispot
       GROUP BY
         study_time_collected, study_time_collected_unit, participantid

       UNION
       
       SELECT
         study_time_collected,
         study_time_collected_unit,
         participantid AS pid,
         COUNT(virus) AS features,
         'hai' AS Name,
         'HAI' AS Label
       FROM
          hai
       GROUP BY
         study_time_collected, study_time_collected_unit, participantid

       UNION
       
       SELECT
         study_time_collected,
         study_time_collected_unit,
         participantid AS pid,
         COUNT(virus) AS features,
         'neut_ab_titer' AS Name,
         'NAb' AS Label
       FROM
         neut_ab_titer
       GROUP BY
         study_time_collected, study_time_collected_unit, participantid

       UNION

       SELECT
         study_time_collected,
         study_time_collected_unit,
         participantid AS pid,
         COUNT(gene_symbol) AS features,
         'pcr' AS Name,
         'PCR' AS Label
       FROM
         pcr
       GROUP BY
         study_time_collected, study_time_collected_unit, participantid
       
       UNION
       
       SELECT
         study_time_collected,
         study_time_collected_unit,
         participantid AS pid,
         MAX(features) AS features,
         'gene_expression_files' AS Name,
         'Gene Expression' AS Label
       FROM
          assay.ExpressionMatrix.Matrix.InputSamplesWithFeatures
       GROUP BY
         study_time_collected, study_time_collected_unit, participantid

    ) AS dataset_n
ORDER BY
    dataset_n.pid ASC, dataset_n.Label ASC, dataset_n.study_time_collected_unit ASC, dataset_n.study_time_collected ASC
