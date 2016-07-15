
var margin = { top:20, right:10, botton:100, left:40},
	width = 700 - margin.right - margin-left,
	height = 500 - margin.top - margin.boottom;


var svg = d3.select('body')
	append('svg')
	.attr({
		"width" : width + margin.right + margin.left,
		"height" : height + margin.top + margin.bottom;
	})

		.append('g')
			.attr("transform", "translate(" + margin.left +','+ margin.right + ')');

//define x y scales
var xScale = d3.scale.ordinal()
	.rangeRoundBands([0,width], 0.2, 0.2);

var yScale = d3.scale.linear()
	.range([height,0]);

//define axis
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left");


//import json data
d3.json("data1.json",function(error,data){
	if(error) console.log("Error: data not loaded");

	data.forEach(function(d){
		d.Year = +d.Year;
		d.life expectancy at birth, male (Value) = +d.life expectancy at birth, male (Value);
		d.life expectancy at birth, female (Value) = +d.life expectancy at birth, female (Value);
		console.log(d.Year);

	});

	data.sort(function(a,b){
		return b.Year = a.Year;
	});

	//specify domain of x and y scales
	xScale.domain(data.map(function(d){return d.Year}) );
	yScale.domain([0, d3.max(data, function(d) {return d.lifeExpectancy; }) ]);

	//draw the bars
	svg.selectAll('rect')
		.data(data)
		.enter()
		.append('rect')
		.attr("height",0)
		.attr("y",height)
		.transition().duration(3000)
		.delay(function(d,i) { return i*200; })
		.attr({
			"x": function(d) { return xScale(d.Year); },
			"y": function(d) { return yScale(d.feme); },
			"width": xScale.rangeBand(),
			"height": function(d) { return height - yScale(d.feme); },
		});
		.style("fill",function(d,i){ return 'rgb(20,20,'+((i*30)+100)+')'});

		//label the bars
		svg.selectAll('text')
			.data(data)
			.enter()
			.append('text')
			.text(function(d){return d.feme})
			.attr("x", function(d) { return xScale(d.Year) + xScale.rangeBand()/2; })
			.attr("y", function(d) { return yScale(d.feme) + 12; })
			.style("fill","white")
			.style("text-anchor","middle");

	// draw xAxis
	svg.append("g")
	 .attr("class","x axis")
	 .attr("transform","translate(,0"+height+")")
	 .call(xAxis)
	 .selectAll('text')
	 .attr("transform","rotate(-60)")
	 .attr("dx","-.8em")
	 .attr("dy",".25em")
	 .style("text-anchor","end")
	 .style("font-size","12px");

	 // draw yAxis
	 svg.append("g")
	 	.attr("class","y axis")
	 	.call(yAxis)
	 	.style("font-size","12px");

});