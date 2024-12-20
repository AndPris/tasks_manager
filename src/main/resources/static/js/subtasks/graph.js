import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {clearChildren} from "utilDOMFunctions.js";
import {getDateWithShift} from "utilFunctions.js";

export class Graph {
    width = 740;
    height = 400;
    marginTop = 20;
    marginRight = 20;
    marginBottom = 30;
    marginLeft = 40;
    x;
    y;
    svg;
    earliestPossibleStartTime;
    destination;
    fontSize = "20px";
    textMargin = 0.2;
    shiftUp = 1;
    defaultColor = "black";
    todayColor = "green";
    finishDateColor = "red";
    defaultStrokeWidth = 1;
    todayStrokeWidth = 2;
    finishDateStrokeWidth = 2;
    defaultFontWeight = "normal";
    todayFontWeight = "bold";
    finishDateFontWeight = "bold";
    today;
    finishDate;
    criticalProcesses;
    nonCriticalProcesses;

    constructor() {
        this.today = new Date();
        this.today.setHours(0, 0, 0, 0);
    }

    draw(processes, earliestPossibleStartTime, finishDate, destination) {
        this.processes = processes;
        this.criticalProcesses = this.processes.filter((process) => process.critical);
        this.nonCriticalProcesses = this.processes.filter((process) => !process.critical);
        this.earliestPossibleStartTime = earliestPossibleStartTime;
        this.earliestPossibleStartTime.setHours(0, 0, 0, 0);
        this.finishDate = finishDate;
        this.finishDate.setHours(0, 0, 0, 0);
        this.destination = destination;

        clearChildren(destination);

        this.initGraph();
        this.drawCriticalProcesses();
        this.drawNonCriticalProcesses();
    }

    initGraph() {
        this.drawAxes();
        this.drawGrid();
    }

    drawAxes() {
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
                .attr("stroke", this.defaultColor))
            .call(g => g.selectAll(".tick text")
                .attr("fill", d => (this.getColor(d)))
                .style("font-weight", d => (this.getFontWeight(d))));

        this.svg.append("g")
            .attr("transform", `translate(${this.marginLeft},0)`)
            .call(d3.axisLeft(this.y).tickFormat(""))
            .call(g => g.selectAll(".domain, .tick line")
                .attr("stroke", this.defaultColor));
    }

    drawGrid() {
        this.svg.selectAll("line.grid")
            .data(this.x.ticks(d3.timeDay.every(1)))
            .enter()
            .append("line")
            .attr("class", "grid")
            .attr("x1", d => this.x(d))
            .attr("x2", d => this.x(d))
            .attr("y1", this.marginTop)
            .attr("y2", this.height - this.marginBottom)
            .attr("stroke", d => this.getColor(d))
            .attr("stroke-width", d => this.getStrokeWidth(d))
            .attr("stroke-dasharray", "4 2")
            .attr("stroke-opacity", 0.5);
    }

    getColor(d) {
        if(d.getTime() === this.today.getTime())
            return this.todayColor;

        if(d.getTime() === this.finishDate.getTime())
            return this.finishDateColor;

        return this.defaultColor;
    }

    getStrokeWidth(d) {
        if(d.getTime() === this.today.getTime())
            return this.todayStrokeWidth;

        if(d.getTime() === this.finishDate.getTime())
            return this.finishDateStrokeWidth;

        return this.defaultStrokeWidth;
    }

    getFontWeight(d) {
        if(d.getTime() === this.today.getTime())
            return this.todayFontWeight;

        if(d.getTime() === this.finishDate.getTime())
            return this.finishDateFontWeight;

        return this.defaultFontWeight;
    }

    getProjectTimeline() {
        const start = new Date(earliestPossibleStartTime);
        const finish = getDateWithShift(earliestPossibleStartTime, this.getProjectDuration());
        return [start, finish];
    }

    getProjectDuration() {
        return this.criticalProcesses.reduce((accumulator, currentValue) => accumulator + currentValue.duration, 0);
    }

    drawCriticalProcesses() {
        this.criticalProcesses.sort((a, b) => {return a.startTime - b.startTime;});
        this.criticalProcesses.forEach((process, index) => {
            this.drawProcess(process, index - this.shiftUp);
        });

        this.destination.append(this.svg.node());
    }

    drawNonCriticalProcesses() {
        this.nonCriticalProcesses.sort((a, b) => {return a.startTime - b.startTime;});
        this.nonCriticalProcesses.forEach((process, index) => {
            index = this.amountOfCriticalProcesses + index - this.shiftUp;
            this.drawProcess(process, index);
            this.drawTimeStocks(process, index);
        });

        this.destination.append(this.svg.node());
    }

    drawProcess(process, index) {
        const startDate = getDateWithShift(earliestPossibleStartTime, process.startTime);
        const finishDate = getDateWithShift(earliestPossibleStartTime, process.finishTime);
        const y = this.getProcessY(index);
        const strokeDasharray = this.getStrokeDasharray(process);

        this.drawCircle(startDate, y, 5, this.defaultColor);
        this.drawLine(startDate, finishDate, y, this.defaultColor, strokeDasharray);
        this.displayText((this.x(startDate) + this.x(finishDate)) / 2, this.y(y + this.textMargin), `${process.description} - ${process.duration}`);
        this.drawCircle(finishDate, y, 5, this.defaultColor);
    }

    getProcessY(index) {
        return this.amountOfProcesses - index - 1;
    }

    getStrokeDasharray(process) {
        if(process.critical)
            return 0;
        return 15;
    }

    drawLine(xStart, xEnd, y, color, strokeDasharray) {
        this.svg.append("line")
            .attr("x1", this.x(xStart))
            .attr("x2", this.x(xEnd))
            .attr("y1", this.y(y))
            .attr("y2", this.y(y))
            .attr("stroke", color)
            .attr("stroke-width", 4)
            .attr("stroke-dasharray", strokeDasharray);
    }

    get amountOfProcesses() {
        return this.processes.length;
    }

    get amountOfCriticalProcesses() {
        return this.criticalProcesses.length;
    }

    drawTimeStocks(process, index) {
        const freeTimeStockBegin = getDateWithShift(earliestPossibleStartTime, process.startTime + process.freeTimeStock);
        const totalTimeStockBegin = getDateWithShift(earliestPossibleStartTime, process.startTime + process.totalTimeStock);
        const processFinish = getDateWithShift(earliestPossibleStartTime, process.finishTime);
        const y = this.getProcessY(index);

        this.drawCircle(totalTimeStockBegin, y, 3, "green");
        this.drawLine(totalTimeStockBegin, processFinish, y, "green", 0);
        this.drawCircle(processFinish, y, 3, "green");

        if(process.freeTimeStock !== process.totalTimeStock) {
            this.drawCircle(freeTimeStockBegin, y, 3, "red");
            this.drawLine(freeTimeStockBegin, totalTimeStockBegin, y, "red", 0);
            this.drawCircle(totalTimeStockBegin, y, 3, "red");
        }
    }

    drawCircle(x, y, radius, color) {
        this.svg.append("circle")
            .attr("cx", this.x(x))
            .attr("cy", this.y(y))
            .attr("r", radius)
            .attr("fill", color);
    }

    displayText(x, y, text) {
        this.svg.append("text")
            .attr("x", x)
            .attr("y", y)
            .attr("text-anchor", "middle")
            .attr("fill", this.defaultColor)
            .style("font-size", this.fontSize)
            .style("font-weight", "bold")
            .text(text);
    }
}
