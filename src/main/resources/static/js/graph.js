import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const width = 640;
const height = 400;
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 40;

export function drawTimeGraph(processes) {
    const x = d3.scaleUtc()
        .domain(getProjectTimeline(processes))
        .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
        .range([height - marginBottom, marginTop]);

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).tickFormat(""));

    timeGraph.append(svg.node());
}

function getProjectTimeline(processes) {
    const start = new Date(creationTime);
    const finish = new Date(creationTime);
    finish.setDate(finish.getDate() + getProjectDuration(processes));
    return [start, finish];
}

function getProjectDuration(processes) {
    return processes.filter((process) => process.critical).reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0);
}