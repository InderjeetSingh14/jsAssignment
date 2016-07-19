$(document).ready(function(){

var margin = {top: 20, right: 160, bottom: 30, left: 70},
    width = 650 + margin.left + margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
       .range([0, width]);

var y = d3.scale.linear()
       .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Rate); });

var svg = d3.select("#tab2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("../json/data2.json", function(error, data) {
  if (error) throw error;
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));
  data.forEach(function(d) {
    d.date = d.Year;
  });

  var cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {Year: d.Year, Rate: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.Rate; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.Rate; }); })
  ]);

  svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("x", 6)
        .attr("dx", "1.5em")
        .attr("dy", "1em")
        
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "-3.71em")
      .style("text-anchor", "end")
      .text("Rate (per 1,000 people)");

  var city = svg.selectAll(".city")
      .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.Year) + "," + y(d.value.Rate) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });



});

});