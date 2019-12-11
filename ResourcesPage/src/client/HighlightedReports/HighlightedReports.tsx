// Imports
import * as React from 'react';
import './HighlightedReports.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const ResourcesPage: React.FC = () => {
    // state using hooks
    // Keep state that must change simple (not nested)
    const [divToShow, setDivToShow] = React.useState<string>("About");

    // --------- ABOUT -----------------
    const About: React.FC = () => { 
        return(
            <div id="About">
                <p><strong>ImmuneSpace provides multiple ways to interact with, visualize and analyze data</strong>. A set of standardized modules &ndash; available under the&nbsp;<em>Modules</em>&nbsp;tab within each study &ndash; can be used to explore datasets and perform specific analyses. Some studies might also have additional analyses/reports available under the&nbsp;<em>Reports</em>&nbsp;tab. Most of these reports perform and summarize standardized analyses, but some perform analyses that are tailored to specific studies. A few examples of such modules/analyses are listed below:</p>
                <ul>
                    <li>Identification of gene expression signature of antibody responses using the&nbsp;<a href="/ImmuneResponsePredictor/Studies/SDY269/begin.view">Immune Response Predictor module</a>.</li>
                    <li>Module-based analysis of gene expression changes over time using the&nbsp;<a href="/GeneSetEnrichmentAnalysis/Studies/SDY269/begin.view">Gene Set Enrichment Analysis module</a>.</li>
                    <li>A <a href="../Studies/SDY207/begin.view?pageId=Visualization">custom report</a> to perform automated gating of CyTOF data using&nbsp;<a href="http://opencyto.org/" target="_blank">OpenCyto</a>&nbsp;and 3-D visualization using <a href="https://cran.r-project.org/web/packages/plotly/index.html" target="_blank">plotly</a>.</li>
                </ul>
                <p>All of the analyses make use of the R statistical language, leverage&nbsp;<a href="http://rforge.net/Rserve/" target="_blank">Rserve</a> to improve performance and&nbsp;<a href="http://yihui.name/knitr/" target="_blank">knitr</a>&nbsp;to enable full reproducibility. If you want to learn more about the <strong>computational tools</strong>&nbsp;developed as part of HIPC (and associated efforts), please visit the <a href="/project/home/begin.view?pageId=Tools">Tools</a> page.</p>
                <p><strong>Getting started:</strong>&nbsp;You first task will be to identify a study you would like to explore, and this can easily be done using the built-in <a href="/project/Studies/begin.view?">Data Finder</a>. You can then use the built-in study tools and modules to learn more about the selected study, explore, visualize and export specific data sets, and perform standardized analyses. For more detailed instructions please visit the <a href="/project/home/begin.view?pageId=Tutorials">Tutorials</a> page. If you have any questions or need any help, please visit the&nbsp;<a href="/project/home/support/begin.view">support page</a>.</p>
                <p>You can also easily interact with ImmuneSpace and download data via <a href="https://www.r-project.org/" target="_blank">R</a> using the&nbsp;<a href="https://bioconductor.org/packages/release/bioc/html/ImmuneSpaceR.html" target="_blank">ImmuneSpaceR</a>&nbsp;package, again, please visit the&nbsp;<a href="/project/home/begin.view?pageId=Tools">Tools</a>&nbsp;page for more details.</p>
            </div>
        )
    }

    // --------- TOOLS -----------------
    const Tools: React.FC = () => { 
        return(
            <div id="Tools">
                <ul>
                    <li><a href="http://icahn.mssm.edu/immuneregulation" target="_blank">ImmuneRegulation</a> is a user-friendly web interface that allows you to interactively explore the regulation of your genes and/or gene sets of interest by querying their regulation in the eQTL, Transcription Factor, and GQAS datasets in real time. ImmuneRegulation was developed by the&nbsp;<a href="http://research.mssm.edu/gumuslab/" target="_blank">Gumus</a> lab at the Mount Sinai School of Medicine.</li>
                    <li>The <a href="http://software.broadinstitute.org/gsea/msigdb/collection_details.jsp#C7" target="_blank">immune signature collection</a> part of MSigDB created by the <a href="http://haining.dfci.harvard.edu/" target="_blank">Haining lab</a>.</li>
                    <li>The <a href="https://gxb.benaroyaresearch.org/dm3/landing.gsp" target="_blank">interactive gene expression browser</a>&nbsp;(GXB) developed by the <a href="http://www.sidra.org/damien-chaussabel/" target="_blank">Chaussabel lab</a>. GXB is described in <a href="http://www.translational-medicine.com/content/13/1/196" target="_blank">this paper</a>.</li>
                    <li><a href="http://www.immuneprofiling.org/innate/landing.gsp">Meta Comparison Analysis Tool (MetaCAT)</a>&nbsp;developed by the&nbsp;<a href="http://www.sidra.org/damien-chaussabel/" target="_blank">Chaussabel lab</a>.</li>
                    <li><a href="http://insilico.utulsa.edu/index.php/reliefseq/" target="_blank">ReliefSeq</a> is a machine learning feature selection method for GWAS, RNA-Seq and other high-dimensional data sets that is able to identify genetic variables that influence continuous or dichotomous outcomes through interactions with other genetic variables. ReliefSeq was developed by the&nbsp;<a href="http://insilico.utulsa.edu/" target="_blank">McKinney</a> and&nbsp;<a href="http://www.mayo.edu/research/faculty/oberg-ann-l-ph-d/bio-00027708" target="_blank">Oberg</a> labs. ReliefSeq is described in <a href="http://journals.plos.org/plosone/article?id=10.1371/journal.pone.0081527" target="_blank">this paper</a>&nbsp;</li>
                </ul>
            </div>
        )
    }

    // --------- REPORTS -----------------
    // Define Components in list - one for each report (img, title, text)
    const Reports: React.FC = () => {
        // Define baseUrl 
        var baseUrl = window.location.origin;

        // Define path to image resources
        var imgPath = '/ResourcesPage/images/'

        var data = [
            {
                study: 'SDY144',
                link: '/reports/Studies/SDY144/runReport.view?reportId=module%3ASDY144%2Freports%2Fschemas%2Fstudy%2Fdemographics%2FHAI_VN_vs_plasma_cells.Rmd',
                img: 'SDY144_report_thumbnail.png',
                title: 'Correlation of HAI/VN and plasma cell counts',
                text: 'Reproduction of Figure 2 of Cao RG et al, "Differences in antibody responses between trivalent inactivated influenza vaccine and live attenuated influenza vaccine correlate with the kinetics and magnitude of interferon signaling in children." J Infect Dis 210(2), 2014 Jul 15.'
            },
            {
                study: 'SDY180',
                link: '/reports/Studies/SDY180/runReport.view?reportId=module%3ASDY180%2Freports%2Fschemas%2Fstudy%2Fdemographics%2Fplasmablast_abundance.Rmd',
                img: 'SDY180_report_thumbnail.png',
                title: 'Measuring plasmablast abundance by multi-parameter flow cytometry',
                text: 'This report investigates the abundance of plasmablast (and other B cell subsets) over time after vaccination with Pneumovax, Fluzone, or no vaccination (saline control group). The results are similar to those reported in Figure 6 B of Obermoser et al. (2013).'
            },
            {
                study: 'SDY207',
                link: '/project/Studies/SDY207/begin.view?pageId=Reports',
                img: 'SDY207_report_thumbnail.png',
                title: 'Multiple custom reports related to CyTOF and Flow Cytometry Data',
                text: 'These reports take advantage of a rich cytometry dataset to do things like compare power analyses using manual and automated gating.'
            },
            {
                study: 'SDY269',
                link: '/reports/Studies/SDY269/runReport.view?reportId=module%3ASDY269%2Freports%2Fschemas%2Fhai_flow_elispot.Rmd',
                img: 'SDY269_report_thumbnail.png',
                title: 'Correlating HAI with flow cytometry and ELISPOT results',
                text: 'This report investigates the association between the number influenza-specific cells measured by ELISPOT measured at day 7 with the number of plasmablast measured by flow cytometry at day 7 and the HAI response measured at day 28 (log-fold day28/day0). It reproduces Figure 1 (d-e) of Nakaya et al. (2011)'
            },
            {
                study: 'ImmuneSignatures 1',
                link: 'project/HIPC/IS1/begin.view?pageId=Report',
                img: 'IS1_report_thumbnail.png',
                title: 'Influenza Vaccine Meta-Analysis to define genetic predictors of vaccine response',
                text: 'Reproduction of figures from HIPC-CHI Signatures Project Team, "Multicohort analysis reveals baseline transcriptional predictors of influenza vaccination responses." Science Immunology 25 Aug 2017: Vol. 2, Issue 14.'
            },
            {
                study: 'Lyoplate',
                link: 'project/HIPC/Lyoplate/begin.view?pageId=Analyses',
                img: 'Lyoplate_report_thumbnail.png',
                title: 'Standardizing Flow Cytometry Immunophenotyping from Reagents to Analyses:  Results of the Human ImmunoPhenotyping Consortium',
                text: 'Standardization of flow cytometry assays requires careful attention to reagents, sample handling, instrument setup, and data analysis, and is essential for successful cross-study and cross-center performance and analysis of large data sets. Analyses from HIP-C attempt to determine whether automated methods were a suitable approach to streamline and further standardize analysis'
            }
        ]
        
        // React requires each list element have a unique key for DOM.
        // However this key is NOT shown in the inspector.
        const reportsList = data.map(function(report){
            var fullUrl = baseUrl + report.link
            return(
                <tr key={report.study}>
                    <td className="hr-imgCol">
                        <img className="hr-staticImg" src={imgPath + report.img}/>
                    </td>
                    <td className="hr-infoCol">
                        <h2>{report.study}</h2>
                        <a href={fullUrl}>{report.title}</a>
                        <p>{report.text}</p>
                    </td>
                </tr>
            )
        })

        return(
            <div id="Reports">
                <table>
                    <tbody>
                        {reportsList}
                    </tbody>
                </table>
            </div>
            
        )
    }

    // --------- DataStandards -------------
    const DataStandards: React.FC = () => { 
        return(
            <div id="DataStandards">
                <div id="#cytometry">Cytometry</div>
                <div id="#gene-expression">Gene Expression</div>
                <div id="#immune-response">Immune Response</div>
            </div>
        )
    }

    // --------- StudyStats -----------------
    const StudyStats: React.FC = () => { 
        return(
            <div id="StudyStats">
                <div id="#most-accessed">Most Accessed</div>
                <div id="#most-cited">Most Cited</div>
                <div id="#similar-studies">Similar Studies</div>
            </div>
        )
    }

    // --------- NAVBAR -----------------
    // Use bootstrap in Navbar
    const Navbar: React.FC = () => { 
        
        const divInfo = [
            {
                id: "about",
                tag: "About",
                text: "About"
            },
            {
                id: "tools",
                tag: "Tools",
                text: "Tools",
            },
            {
                id: "reports",
                tag: "Reports",
                text: "Reports"
            },
            {
                id: "data-standards",
                tag: "DataStandards",
                text: "Data Standards",
                subMenu: [
                    {
                        tag: "cytometry",
                        text: "Cytometry"
                    },
                    {
                        tag: "gene-expression",
                        text: "Gene Expression"
                    },
                    {
                        tag: "immune-response",
                        text: "Immune Response"
                    }
                ]
            },
            {
                id: "study-stats",
                tag: "StudyStats",
                text: "Study Statistics",
                subMenu: [
                    {
                        tag: "most-accessed",
                        text: "Most Accessed"
                    },
                    {
                        tag: "most-cited",
                        text: "Most Cited"
                    },
                    {
                        tag: "similar-studies",
                        text: "Similar Studies"
                    }
                ]
            }
        ]

        const navBarElements = divInfo.map(function(el){
            const itemId = "navbar-link-" + el.id;
            const href = "#" + el.tag;
    
            if(["DataStandards", "StudyStats"].indexOf(el.tag) !== -1){
                const className = "nav-item dropdown" + (divToShow == el.tag ? " active" : "");
                const dropDownId = el.tag + "Dropdown"

                const subMenuHtml = el.subMenu.map(function(subel){
                    const tag = "#" + subel.tag
                    return(
                        <a className="dropdown-item" href={tag} onClick={() => setDivToShow(el.tag)}>{subel.text}</a>
                    )
                })

                return(
                    <li id={itemId} className={className}>
                        <a className="nav-link dropdown-toggle" href={href} id={dropDownId} role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            {el.text}
                        </a>
                        <div className="dropdown-menu" aria-labelledby={dropDownId}>
                            {subMenuHtml}
                        </div>
                    </li>
                )
            }else{
                const className = "nav-item" + (divToShow == el.tag ? " active" : "");
                return(
                    <li id = {itemId} className = {className}>
                        <a className = "nav-link" href = {href} onClick={() => setDivToShow(el.tag)}>
                            {el.text}
                        </a>
                    </li>
                )
            }
        })

        return(
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav">
                    {navBarElements}
                </ul>
            </nav>
        )
    }

    // return
    return(
        <div>
            <Navbar/>
            { divToShow == "About" ? <About/> : null}
            { divToShow == "Tools" ? <Tools/> : null}
            { divToShow == "Reports" ? <Reports/> : null}
            { divToShow == "DataStandards" ? <DataStandards/> : null}
            { divToShow == "StudyStats" ? <StudyStats/> : null}
        </div>
    )
}





// --------- EXPORT ------------
// There should be a single export: a component called "App"
export const App: React.FC = () => {

    // Must return a React Fragment
    return <ResourcesPage/>
}
