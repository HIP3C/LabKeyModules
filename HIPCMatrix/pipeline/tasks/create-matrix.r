library(data.table)
library(Rlabkey)
library(affy)
# NOTE: also requires bioc packages: "hthgu133pluspmcdf" and "AnnotationDbi"

# read the job info
jobInfo <- read.table("${pipeline, taskInfo}",
                      col.names=c("name", "value", "type"),
                      header=FALSE, check.names=FALSE,
                      stringsAsFactors=FALSE, sep="\t", quote="",
                      fill=TRUE, na.strings="")

# selected input file paths
inputFiles <- jobInfo$value[jobInfo$name == "input.CEL"]

# get sample information based on the input files
baseUrl <- jobInfo$value[jobInfo$name == "baseUrl"]
contextPath <- jobInfo$value[jobInfo$name == "contextPath"]
containerPath <- jobInfo$value[jobInfo$name == "containerPath"]
filter <- makeFilter(c("file_info_name", "IN", paste(basename(inputFiles), collapse=";")))
pdata <- labkey.selectRows(baseUrl=paste(baseUrl, contextPath, sep=""),
                           folderPath=containerPath,
                           schemaName="study",
                           queryName="gene_expression_files",
                           colSelect=c("file_info_name", "biosample_accession"),
                           colFilter=filter,
                           colNameOpt="rname")

# Reading
affybatch <- ReadAffy(filenames = inputFiles)

# Normalisation
eset <- rma(affybatch)
ematrix <- exprs(eset)

# Rename columns
colnames(ematrix) <- pdata[match(colnames(ematrix), pdata$file_info_name), "biosample_accession"]
ematrix <- cbind(rownames(ematrix), ematrix)

# BUGBUG: Figure out how to write a column header for the ID_REF column
write.table(ematrix, file = "${output.tsv}", sep = "\t", quote=FALSE, row.names=FALSE)

