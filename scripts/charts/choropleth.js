function init() {
    var w = 1500;
    var h = 700;

    var projection = d3.geoMercator().scale(160).center([0, 41]).translate([w / 2, h / 2]);

    var path = d3.geoPath().projection(projection);

    var colorRange = ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'];

    var color = d3.scaleQuantize()
        .range(colorRange);
    var svg = d3.select("body").append("svg").attr("width", w).attr("height", h).attr("fill", "lightgrey");
    var mapGroup = svg.append("g").attr("class", "map").attr("transform", "translate(0, 25)");


    d3.csv("./data/LifeExpectancy.csv").then(function (data) {
        color.domain([d3.min(data, function (d) { return +d.Y2022 }), d3.max(data, function (d) { return +d.Y2022; })]);
        d3.json("./data/world.geojson").then(function (json) {
            for (var i = 0; i < data.length; i++) {
                var dataCountry = data[i].Country;

                for (var j = 0; j < json.features.length; j++) {
                    var jsonCountry = json.features[j].properties.name;

                    if (dataCountry == jsonCountry) {
                        json.features[j].properties.Y2022 = parseFloat(data[i].Y2022);
                        json.features[j].properties.Y2021 = parseFloat(data[i].Y2021);
                        json.features[j].properties.Y2020 = parseFloat(data[i].Y2020);
                        json.features[j].properties.Y2019 = parseFloat(data[i].Y2019);
                        json.features[j].properties.Y2018 = parseFloat(data[i].Y2018);
                        json.features[j].properties.Y2017 = parseFloat(data[i].Y2017);
                        json.features[j].properties.Y2016 = parseFloat(data[i].Y2016);
                        json.features[j].properties.Y2015 = parseFloat(data[i].Y2015);
                        json.features[j].properties.Y2014 = parseFloat(data[i].Y2014);
                        json.features[j].properties.Y2013 = parseFloat(data[i].Y2013);
                        json.features[j].properties.Y2012 = parseFloat(data[i].Y2012);
                        json.features[j].properties.Y2011 = parseFloat(data[i].Y2011);
                        json.features[j].properties.Y2010 = parseFloat(data[i].Y2010);
                        break;
                    }
                }
            }
            // Define SVG elements to show on hover
            var tooltip = svg.append("g")
                .attr("class", "tooltip")
                .style("display", "none");

            tooltip.append("rect")
                .attr("width", 400)
                .attr("height", 160)
                .attr("fill", "white")
                .style("opacity", 0.7)
                .style("stroke", "black") // Set border color
                .style("stroke-width", 1) // Set border width

            mapGroup.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .style("fill", function (d) {
                    return color(d.properties.Y2022);
                })
                .on("mouseover", function (event, d) {
                    drawAreaChart(tooltip, d.properties, event);
                    // Calculate the position of the tooltip relative to the mouse cursor
                    var tooltipX = event.pageX > 1000 ? event.pageX - 250 : event.pageX; // Offset the tooltip to the right
                    var tooltipY = event.pageY > 900 ? event.pageY - 550 : event.pageY - 350; // Offset the tooltip above the cursor

                    tooltip.style("transform", "translate(" + tooltipX + "px, " + tooltipY + "px)")
                        .style("display", "block");
                })
                .on("mouseout", function (d) {
                    clearChart(tooltip);
                    tooltip.style("display", "none");
                });

        })

    })

    svg.append("text")
        .attr("x", w / 2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-family", "Arial")
        .text("Life Expectancy in 2022").attr("fill", "black");

}

window.onload = init;
