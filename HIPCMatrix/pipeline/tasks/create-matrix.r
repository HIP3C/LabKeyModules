library(data.table)
library(Rlabkey)
library(tools)

# NOTE: Affy will implicitly try to load bioc packages "hthgu133pluspmcdf" and "AnnotationDbi"
# but that won't work in an RServe enviornment if they haven't been installed yet.
# So we try to load the library early so they will fail if not installed.
#library(hthgu133pluspmcdf)
#library(AnnotationDbi)

# read the job info
#stop(paste("read: ", "${pipeline, taskInfo}", "| getwd: ", getwd()))
jobInfo <- read.table("${pipeline, taskInfo}",
                      col.names=c("name", "value", "type"),
                      header=FALSE, check.names=FALSE,
                      stringsAsFactors=FALSE, sep="\t", quote="",
                      fill=TRUE, na.strings="")

selectedLsids <- "${selected-lsids}"
selectedSubjects <- "${selected-subjects}"
selectedBiosamples <- "${selected-biosamples}"

# selected input file paths
# Test for valid input files:
inputFiles <- jobInfo$value[ grep("input\\.", jobInfo$name)]
inputFiles <- inputFiles[file.exists(inputFiles)]
ext <- unique(file_ext(inputFiles))

# phenoData
baseUrl <- jobInfo$value[jobInfo$name == "baseUrl"]
contextPath <- jobInfo$value[jobInfo$name == "contextPath"]
url <- if(is.na(contextPath)) baseUrl else paste0(baseUrl, contextPath)
containerPath <- jobInfo$value[jobInfo$name == "containerPath"]
filter <- makeFilter(c("file_info_name", "IN", paste(basename(inputFiles), collapse=";")))
pdata <- labkey.selectRows(baseUrl=url,
                           folderPath=containerPath,
                           schemaName="study",
                           queryName="gene_expression_files",
                           colSelect=c("file_info_name", "subject_accession", "biosample_accession"),
                           colFilter=filter,
                           colNameOpt="rname")

# Normalization
if(length(ext) > 1){
  stop(paste("There is more than one file extension:", paste(ext, collapse=",")))
} else if(ext == "CEL"){
  library(affy)
  affybatch <- ReadAffy(filenames = inputFiles)
  eset <- rma(affybatch)
  norm_exprs <- exprs(eset)

  if(all(file_ext(colnames(norm_exprs)) == "CEL")){ #If filenames used as samplenames
    colnames(norm_exprs) <- pdata[ match(colnames(norm_exprs), pdata$file_info_name), "biosample_accession"]
  }

  #norm_exprs <- cbind(ID_REF = rownames(norm_exprs), norm_exprs)
  
} else if(ext == "txt"){
  library(lumi)
  raw_exprs <- fread(inputFiles)
  feature_id <- raw_exprs[, PROBE_ID]
  raw_exprs <- raw_exprs[, grep("Signal", colnames(raw_exprs), value=TRUE), with=FALSE]
  setnames(raw_exprs, colnames(raw_exprs), gsub(".AVG.*$", "", colnames(raw_exprs)))

  norm_exprs <- as.matrix(raw_exprs)
  eset <- new("ExpressionSet", exprs = norm_exprs)
  eset <- lumiN(eset, method="quantile")
  norm_exprs <- log2(exprs(eset))

  # Get biosample_accession as column names
  if(length(grep("^SUB", colnames(norm_exprs))) == ncol(norm_exprs)){
    colnames(norm_exprs) <- pdata[match(colnames(norm_exprs), pdata$subject_accession), "biosample_accession"]
  } else{ #Assume it's Illumina samplenames
    biosamples_filter <- paste(unique(pdata$biosample_accession), collapse=";")
    
    ds_exp_2_bio <- labkey.selectRows(baseUrl = url, folderPath = containerPath,  schemaName = "immport", queryName = "biosample_2_expsample", colFilter = makeFilter(c("biosample_accession", "IN", biosamples_filter)), colNameOpt = "rname")
    dt_exp_2_bio <- data.table(ds_exp_2_bio)
    expsamples_acc_filter <- paste(dt_exp_2_bio$expsample_accession, collapse=";")
    
    ds_expsamples <- labkey.selectRows(baseUrl = url, folderPath = containerPath, schemaName = "immport", queryName = "expsample", colFilter = makeFilter(c("expsample_accession", "IN", expsamples_acc_filter)), colNameOpt = "rname")
    dt_expsamples <- data.table(ds_expsamples)
    
    #add biosample to expsample descr
    dt_expsamples <- dt_expsamples[, biosample_accession:=dt_exp_2_bio[ match(dt_expsamples$expsample_accession, expsample_accession), biosample_accession]]
    #add expsample descr to phenodata
    expsample_descr <- dt_expsamples[match(pdata$biosample_accession, biosample_accession), description]
    cnames <- paste0(gsub(";.*=", "_", gsub(".*ChipID=", "", expsample_descr)))#, ".AVG_Signal")
    
    pdata$expr_col <-cnames
    norm_exprs <- norm_exprs[, pdata$expr_col]
    colnames(norm_exprs) <- pdata[match(colnames(norm_exprs), pdata$expr_col), "biosample_accession"]

  }

  norm_exprs <- cbind(feature_id, norm_exprs)
} else{
  stop(paste("The file extension", ext, "is not valid"))
}

write.table(norm_exprs, file = file.path(jobInfo$value[jobInfo$name == "pipeRoot"], "analysis/exprs_matrices", "${output.tsv}"), sep = "\t", quote=FALSE, row.names=TRUE)
write.table(norm_exprs, file = "${output.tsv}", sep = "\t", quote=FALSE, row.names=TRUE)

#inputFiles <- jobInfo$value[jobInfo$name == "input.CEL"]
#
## get sample information based on the input files
#baseUrl <- jobInfo$value[jobInfo$name == "baseUrl"]
#contextPath <- jobInfo$value[jobInfo$name == "contextPath"]
#url <- if(is.na(contextPath)) baseUrl else paste0(baseUrl, contextPath)
#containerPath <- jobInfo$value[jobInfo$name == "containerPath"]
#filter <- makeFilter(c("file_info_name", "IN", paste(basename(inputFiles), collapse=";")))
#pdata <- labkey.selectRows(baseUrl=url,
#                           folderPath=containerPath,
#                           schemaName="study",
#                           queryName="gene_expression_files",
#                           colSelect=c("file_info_name", "biosample_accession"),
#                           colFilter=filter,
#                           colNameOpt="rname")
#
## Reading
#affybatch <- ReadAffy(filenames = inputFiles)
#
## Normalisation
#eset <- rma(affybatch)
#ematrix <- exprs(eset)
#
## Rename columns
#colnames(ematrix) <- pdata[match(colnames(ematrix), pdata$file_info_name), "biosample_accession"]
#ematrix <- cbind(rownames(ematrix), ematrix)
#
## BUGBUG: Figure out how to write a column header for the ID_REF column
#write.table(ematrix, file = "${output.tsv}", sep = "\t", quote=FALSE, row.names=FALSE)
