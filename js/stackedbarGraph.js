
$(document).ready(function(){
var margin = {top: 60, right: 20, bottom: 0, left: 110},
    width = 900 - margin.left - margin.right,
    height = 650- margin.top - margin.bottom;

    var xScale = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var yScale = d3.scale.linear()
        .rangeRound([height, 100]);

    var color = d3.scale.ordinal()
        .range(["#B99E3B", "#DF725B"]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left")
        .tickFormat(d3.format(".2s"));

    //tooltip
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
    return "<strong>Life expectancy at birth:</strong> <span style='color:red'>" + (d.y1-d.y0) + "</span>";
    })

    var svg = d3.select("#tab3")
            .classed("svg-container", true)
            .append("svg")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("viewBox", "0 0 1000 800")
            .classed("svg-content-responsive", true)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    svg.call(tip);

    d3.json("../json/data1.json", function(error, data) {

        color.domain(d3.keys(data[0]).filter(function(key) {
            return key !== "Year";
        }));

        data.forEach(function(d) {
            var y0 = 0;
            d.ages = color.domain().map(function(name) {
                return {
                    name: name,
                    y0: y0,
                    y1: y0 += +d[name]
                };
            });
            d.total = d.ages[d.ages.length - 1].y1;
           
        });
        data.sort(function(a, b) {
            return a.total - b.total;
        });

        xScale.domain(data.map(function(d) {
            return d["Year"];
        }));
        yScale.domain([0, d3.max(data, function(d) {
            return d.total;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-70)"
            });

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -170)
            .attr("y", 6)
            .attr("dy", "-3.71em")
            .style("text-anchor", "end")
            .text("Life Expectency At Birth");

        var state = svg.selectAll(".state")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "x axis")
            .attr("transform", function(d) {
                return "translate(0" + xScale(d["Year"]) + ",-1)";
            });

        state.selectAll("rect")
            .data(function(d) {
                return d.ages;
            })
            .enter().append("rect")
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) {
                return yScale(d.y1);
            })
            .attr("height", function(d) {
                return yScale(d.y0) - yScale(d.y1);
            })
            .style("fill", function(d) {
                return color(d.name);
            })
            .on('mouseover',tip.show)
            .on('mouseout',tip.hide);

        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
                return d;
            });

    });

});
