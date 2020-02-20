import * as d3 from 'd3'
import { CubeDatum } from '../../../typings/CubeData';
import { entries } from 'd3';

// ================================================================== //
/* 
This is a barplot component which takes the following arguments in 
the props: 
  * data
  * name (id for the div to stick it in)
  * width
  * height

*/
// Types
interface DrawBarplotProps {
    data: CubeDatum[];
    name: string;
    width: number;
    height: number;
    labels: string[];
    countMetric: string;
    barColor: string;
}


export function drawBarplot(props: DrawBarplotProps) {

    const data = props.data;
    // remove unused data 
    const unusedDataIndices = [];
    data.forEach((d, i) => {
        if (props.labels.indexOf(d.member) == -1) {
            unusedDataIndices.push(i)
        }
    })
    unusedDataIndices.reverse().forEach((d) => {
        data.splice(d, 1)
    })
    const name = props.name;

    const dataRange = [0, 10];
    const countMetric = props.countMetric
    data.forEach((v) => (v[countMetric] > dataRange[1]) && (dataRange[1] = v[countMetric]))

    const totalHeight = Math.max(195, 15 * props.labels.length + 20)

    const labels = props.labels.map(l => {
        let short = l
        if (l.length > 18) short = l.slice(0, 14) + "..."
        return ({ label: l, shortlabel: short })
    })
    const svg = d3
        .select("#barplot-container-" + name).select("svg")
        .attr("height", totalHeight)
        .attr("width", 220)
        .attr("id", "barplot-container-" + name)

    const xAxisSvg = d3.select("#xaxis-" + name).select("svg")
        .attr("width", props.width)
        .attr("height", 40)


    // Create margins
    const margin = { top: 0, right: 15, bottom: 0, left: 100 },
        width = props.width - margin.left - margin.right,
        height = totalHeight - margin.top - margin.bottom;

    // Set scales using options

    const xaxisScale = d3
        .scaleLinear()
        .domain(dataRange).nice()
        .range([0, width]);

    const yaxisScale = d3
        .scaleBand()
        .domain(labels.map(l => l.label))
        .range([height, 0]);

    // Create body and axes
    // svg.append("g")
    //     .call(d3.axisLeft(yaxisScale));

    // svg.append("g")
    //     .call(d3.axisBottom(xaxisScale));

    let barplot: d3.Selection<SVGElement, any, HTMLElement, any>;
    let xaxisGrid, xaxisLabels, yaxisLabels, labelContainers, yaxisLongLabels
    if (!svg.selectAll("g").empty()) {
        svg.select("#xaxis-labels-" + name).remove()
        xaxisGrid = svg.select("#xaxis-grid-" + name)
        xaxisLabels = xAxisSvg.selectAll(".x.axis")
        barplot = svg.select("#barplot" + name)
        // yaxisLongLabels = svg.selectAll("#yaxis-labels-" + name)
    } else {
        barplot = svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("id", "barplot" + name)
            .attr("style", "overflow:auto")

        yaxisLabels = svg.append("g")
            .attr("id", "yaxis-labels-short-" + name)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        yaxisLabels.selectAll("text")
            .data(labels)
            .enter()
            .append("text")
            .attr("x", -5)
            .attr("y", (d) => {
                return yaxisScale((d.label)) + yaxisScale.bandwidth() / 1.5;
            })
            .attr("text-anchor", "end")
            .attr("font-size", ".8em")
            .text(d => d.shortlabel)





        xaxisGrid = svg.insert("g", ":first-child")
            .attr("id", "xaxis-grid-" + name)
            .attr(
                "transform",
                `translate(${margin.left}, ${(height + 5 + margin.top)})`
            )

        xaxisLabels = xAxisSvg.append("g")
            .attr("class", "x axis")
            .attr(
                "transform",
                `translate(${margin.left}, 0)`
            )

        xAxisSvg.append("g")
            .attr(
                "transform",
                `translate(${margin.left}, 0)`
            )
            .append("text")
            .attr("x", (width) / 2)
            .attr("y", 30)
            .text(props.countMetric == "studyCount" ? "Studies" : "Participants")
            .attr("text-anchor", "middle")
            .attr("font-size", "0.8em")


    }
    yaxisLongLabels = svg.append("g")
        .attr("id", "yaxis-labels-" + name)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
    labelContainers = yaxisLongLabels
        .selectAll("g")
        .data(data)
        .enter()
        .append("g")
    labelContainers
        .selectAll(".big-rect-cover")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "big-rect-cover")
        .attr("x", - margin.left)
        .attr("y", d => yaxisScale(d.member))
        .attr("width", props.width)
        .attr("height", yaxisScale.bandwidth())
        .attr("fill", "transparent")
        .attr("stroke", "transparent")
    labelContainers
        .selectAll(".little-rect-cover")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("class", "little-rect-cover")
        .attr("x", d => d == null ? undefined : -margin.left)
        .attr("y", d => yaxisScale(d.member))
        .attr("width", 100)
        .attr("height", yaxisScale.bandwidth())
        .attr("fill", "transparent")
        .attr("stroke", "transparent")
    labelContainers.selectAll(".label-text")
        .data(d => [d])
        .enter()
        .append("text")
        .attr("class", "label-text")
        .attr("x", d => d.member.length < 18 ? -5 : - margin.left)
        .attr("y", d => yaxisScale((d.member)) + yaxisScale.bandwidth() / 1.5)
        .attr("text-anchor", d => d.member.length < 18 ? "end" : "start")
        .attr("font-size", ".8em")
        .attr("fill", "transparent")
    labelContainers.selectAll(".label-text").selectAll("tspan")
        .data(d => {
            let l = d.member
            if (l.length > 40) {
                let splitIndex = l.indexOf(" ")
                while (splitIndex < 40) {
                    const next = l.indexOf(" ", splitIndex + 1)
                    if (next > -1 && next < 40) { splitIndex = next } else { break }
                }
                l = [l.slice(0, splitIndex), l.slice(splitIndex + 1)]
                if (l[1].length > 40) l[1] = l[1].slice(0, 36) + "..."
                return(l)
            } else { return([l]) }
        })
        .enter()
        .append("tspan")
        .attr("x", (d, i) => d.length < 18 && i === 0 ? -5 : - margin.left)
        .attr("dy", (d, i, data) => i>0?"10":data.length>1?"-5":"0")
        .text(d => d)
    yaxisLongLabels.selectAll("g")
        .on("mouseover", function (d) {
            d3.select(this)
                .selectAll(".label-text")
                .transition()
                .duration(100)
                .attr("fill", "black")
                .attr("font-weight", "bold")
            d3.select(this)
                .selectAll(".label-number")
                .transition()
                .duration(100)
                .attr("fill", "black")
                .attr("font-weight", "bold")
            d3.select(this)
                .selectAll(".little-rect-cover")
                .transition()
                .duration(100)
                .attr("fill", "white")
        })
        .on("mouseout", function (d) {
            d3.select(this)
                .selectAll(".label-text")
                .transition()
                .duration(100)
                .attr("fill", "transparent")
                .attr("font-weight", "normal")
            d3.select(this)
                .selectAll(".label-number")
                .transition()
                .duration(100)
                .attr("fill", "transparent")
                .attr("font-weight", "normal")
            d3.select(this)
                .selectAll(".little-rect-cover")
                .transition()
                .duration(100)
                .attr("fill", "transparent")
        })

    labelContainers.selectAll(".label-number").remove()
        .data(d => [d])
        .enter()
        .append("text")
        .attr("class", "label-number")
        .attr("x", props.width - margin.left - 30)
        .attr("y", d => yaxisScale((d.member)) + yaxisScale.bandwidth() / 1.5)
        .attr("text-anchor", "end")
        .text(d => d[countMetric] == null ? 0 : d[countMetric])
        .attr("font-size", ".8em")
        .attr("fill", "transparent")


    xaxisGrid.transition()
        .duration(500)
        .call(d3.axisBottom(xaxisScale).ticks(3).tickSize(-(height + 5)).tickFormat(() => ""))
        .selectAll("line").attr("stroke", "#ddd")
    xaxisLabels.transition()
        .duration(500)
        .call(d3.axisBottom(xaxisScale).ticks(3).tickSize(0))
    // svg.append("g")
    //     .attr("id", "xaxis-labels-" + name)
    //     .attr(
    //         "transform",
    //         `translate(${margin.left}, ${(height + margin.top)})`
    //     )
    //     .call(d3.axisBottom(xaxisScale).tickValues([Math.round((dataRange[1] + 5) / 10) * 10]).tickSize(-height))
    //     .selectAll("line").attr("stroke", "#bcbcbc").attr("stroke-width", "3")

    d3.selectAll(".domain").remove()




    // add data
    const boxes = barplot.selectAll("rect").data(data);
    boxes
        .enter()
        .append("rect")
        .attr("class", "rect")
        .attr("x", xaxisScale(0))
        .attr("width", function (d: CubeDatum) {
            return xaxisScale(d[countMetric]);
        })
        .attr("y", function (d: CubeDatum) {
            return yaxisScale(d.member);
        })
        .attr("height", yaxisScale.bandwidth() - 1)
        .style("fill", props.barColor)
    boxes
        .transition()
        .duration(500)
        .attr("x", xaxisScale(0))
        .attr("width", function (d: CubeDatum) {
            return xaxisScale(d[countMetric]);
        })
        .attr("y", function (d: CubeDatum) {
            return yaxisScale(d.member);
        })
        .attr("height", yaxisScale.bandwidth() - 1)

    boxes.exit().remove();
}

