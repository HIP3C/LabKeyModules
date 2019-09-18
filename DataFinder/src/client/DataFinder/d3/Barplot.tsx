import * as d3 from 'd3'
import { BarplotData } from '../../typings/Viz';

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
    data: BarplotData[];
    name: string;
    width: number;
    height: number;
}

export function drawBarplot(props: DrawBarplotProps) {
    const data = props.data;
    const name = props.name;
    const labels = [];
    const dataRange = [0, 0];

    data.map((e, i) => {
        labels.push(e.label);
        if (e.value > dataRange[1]) dataRange[1] = e.value;
    });


    const svg = d3
        .select("#barplot-" + name)
        .attr("height", props.height)
        .attr("width", props.width)
        .attr("id", "barplot-" + name);

    // Create margins
    const margin = { top: 20, right: 0, bottom: 30, left: 50 },
        width = props.width - margin.left - margin.right,
        height = props.height - margin.top - margin.bottom;

    // Set scales using options

    const xaxisScale = d3
        .scaleLinear()
        .domain([0, 3500])
        .range([0, width]);

    const yaxisScale = d3
        .scaleBand()
        .domain(labels)
        .range([height, 0]);

    // Create body and axes
    // svg.append("g")
    //     .call(d3.axisLeft(yaxisScale));

    // svg.append("g")
    //     .call(d3.axisBottom(xaxisScale));
    let barplot: d3.Selection<SVGElement, any, HTMLElement, any>;
    if (svg.selectAll("g").empty()) {
        barplot = svg
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .attr("id", "barplot" + name);
        svg.append("g")
            .attr("id", "xaxis-labels")
            .attr(
                "transform",
                "translate(" + margin.left + ", " + (height + margin.top) + ")"
            )
            .call(d3.axisBottom(xaxisScale));

        svg.append("g")
            .attr("id", "yaxis-labels")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.axisLeft(yaxisScale));
    } else {
        barplot = svg.select("#barplot" + name)
    }



    // add data
    const boxes = barplot.selectAll("rect").data(data);
    boxes
        .enter()
        .append("rect")
        .attr("class", "rect")
        .attr("x", xaxisScale(0))
        .attr("width", function (d: BarplotData) {
            return xaxisScale(d.value);
        })
        .attr("y", function (d: BarplotData) {
            return yaxisScale(d.label);
        })
        .attr("height", yaxisScale.bandwidth() - 5)
        .style("fill", "steelblue")
    boxes
        .transition()
        .duration(300)
        .attr("x", xaxisScale(0))
        .attr("width", function (d: BarplotData) {
            return xaxisScale(d.value);
        })
        .attr("y", function (d: BarplotData) {
            return yaxisScale(d.label);
        })
        .attr("height", yaxisScale.bandwidth() - 5)

    boxes.exit().remove();
}

