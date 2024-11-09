import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export class Graph {
    width = 640;
    height = 400;
    marginTop = 20;
    marginRight = 20;
    marginBottom = 30;
    marginLeft = 40;
    x;
    y;
    svg;
    creationTime;
    destination;
    fontSize = "20px";
    textMargin = 0.2;
    shiftUp = 1;
    color = "black";


    constructor(processes, creationTime, destination) {
        this.processes = processes;
        this.creationTime = creationTime;
        this.destination = destination;
    }

    draw() {
        this.initGraph();
        this.drawCriticalProcesses();
        this.drawNonCriticalProcesses();
    }

    initGraph() {
        this.x = d3.scaleUtc()
            .domain(this.getProjectTimeline())
            .range([this.marginLeft, this.width - this.marginRight]);

        this.y = d3.scaleLinear()
            .domain([0, this.processes.length + this.shiftUp])
            .range([this.height - this.marginBottom, this.marginTop]);

        this.svg = d3.create("svg")
            .attr("width", this.width)
            .attr("height", this.height);

        this.svg.append("g")
            .attr("transform", `translate(0,${this.height - this.marginBottom})`)
            .call(d3.axisBottom(this.x)
                .tickFormat(d3.timeFormat("%d"))
                .ticks(d3.timeDay.every(1)))
            .call(g => g.selectAll(".domain, .tick line")
                .attr("stroke", this.color))
            .call(g => g.selectAll(".tick text")
                .attr("fill", this.color));

        this.svg.append("g")
            .attr("transform", `translate(${this.marginLeft},0)`)
            .call(d3.axisLeft(this.y).tickFormat(""))
            .call(g => g.selectAll(".domain, .tick line")
                .attr("stroke", this.color));
    }

    getProjectTimeline() {
        // const start = new Date(creationTime);
        const start = this.getDateWithShift(creationTime, -1);
        const finish = this.getDateWithShift(creationTime, this.getProjectDuration() + 1);
        return [start, finish];
    }

    getProjectDuration() {
        return this.criticalProcesses.reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0);
    }

    get criticalProcesses() {
        return this.processes.filter((process) => process.critical);
    }

    get nonCriticalProcesses() {
        return this.processes.filter((process) => !process.critical);
    }

    getDateWithShift(initialTime, shiftInDays) {
        const date = new Date(initialTime);
        date.setDate(date.getDate() + shiftInDays);
        return date;
    }

    drawCriticalProcesses() {
        this.criticalProcesses.forEach((process, index) => {
            this.drawProcess(process, index - this.shiftUp);
        });

        this.destination.append(this.svg.node());
    }

    drawNonCriticalProcesses() {
        this.nonCriticalProcesses.forEach((process, index) => {
            this.drawProcess(process, this.amountOfCriticalProcesses + index - this.shiftUp );
        });

        this.destination.append(this.svg.node());
    }

    drawProcess(process, index) {
        const startDate = this.getDateWithShift(creationTime, process.startTime);
        const finishDate = this.getDateWithShift(creationTime, process.finishTime);
        const y = this.amountOfProcesses - index - 1;
        const strokeDasharray = this.getStrokeDasharray(process);

        this.drawCircle(startDate, y);
        this.drawLine(startDate, finishDate, y, strokeDasharray);
        this.displayText((this.x(startDate) + this.x(finishDate)) / 2, this.y(y + this.textMargin), `${process.description} - ${process.duration}`);
        this.drawCircle(finishDate, y);
    }

    getStrokeDasharray(process) {
        if(process.critical)
            return 0;
        return 15;
    }

    drawLine(xStart, xEnd, y, strokeDasharray) {
        this.svg.append("line")
            .attr("x1", this.x(xStart))
            .attr("x2", this.x(xEnd))
            .attr("y1", this.y(y))
            .attr("y2", this.y(y))
            .attr("stroke", this.color)
            .attr("stroke-width", 4)
            .attr("stroke-dasharray", strokeDasharray);
    }

    get amountOfProcesses() {
        return this.processes.length;
    }

    get amountOfCriticalProcesses() {
        return this.criticalProcesses.length;
    }

    drawCircle(x, y) {
        this.svg.append("circle")
            .attr("cx", this.x(x))
            .attr("cy", this.y(y))
            .attr("r", 5)
            .attr("fill", this.color);
    }

    displayText(x, y, text) {
        this.svg.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("fill", this.color)
            .style("font-size", this.fontSize)
            .style("font-weight", "bold")
            .text(text);
    }
}
