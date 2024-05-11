
const w = 300;
const h = 100;
const padding = 40;

var dataset = [];
function drawAreaChart(tooltip, properties, event) {
    for (var i = 2010; i < 2023; i++) {
        var val = properties["Y" + i.toString()]
        dataset.push({
            year: i,
            value: val
        });
    }

    var xScale = d3.scaleTime()
        .domain([
            new Date(2010, 0, 1),
            new Date(2022, 0, 1)
        ]).range([0, w]);


    var yScale = d3.scaleLinear()
        .domain([d3.min(dataset, function (d) { return d.value; }),
        d3.max(dataset, function (d) { return d.value; })])
        .range([h, 0]);

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5);

    var yAxis = d3.axisLeft().scale(yScale)
        .ticks(5);


    var area = d3.area()
        .x(function (d) { return xScale(new Date(d.year, 0, 1)) + padding; })
        .y0(function () { return yScale.range()[0] + padding; })
        .y1(function (d) { return yScale(d.value) + padding; });

    tooltip.append("path")
        .datum(dataset)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "green");

    tooltip.append("g").attr("class", "x-axis").attr("transform", "translate(+" + padding + ", " + (h + padding) + ")").call(xAxis);
    tooltip.append("g").attr("class", "y-axis").attr("transform", "translate(" + (padding) + ", " + padding + ")").call(yAxis);



}

function clearChart(tooltip) {
    dataset = [];
    tooltip.selectAll(".area").remove();
    tooltip.selectAll(".x-axis").remove();
    tooltip.selectAll(".y-axis").remove();
}