// Name: Pleun Bisseling
// Studentnumber: 10591249

window.onload = function(){
// load dataset in JSON
d3.json("index.json", function(error, data) {
	if (error) throw (error);
	data.forEach(function(d) {
		console.log(d);
		d.Jaar = +d.Jaar
		d.Indexcijfer = +d.Indexcijfer
	});

// set dimensions
var margin = {top: 20, right: 30, bottom: 30, left: 30},
    width = 850 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// set ranges
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// add axes
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.ticks(10);

// define tooltip
var tip = d3.tip()
	.attr("class", "d3-tip")
	.html(function(d) {
    return "<span>" + d.Indexcijfer + "</span>";})

// add attributes to chart
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

 // set domain for data for both x and y
x.domain(data.map(function(d) { return d.Jaar; }));
y.domain([0, d3.max(data, function(d) { return d.Indexcijfer; })]);

// turn and call x axis
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)

// call y axis and add text
svg.append("g")
	.attr("class", "y axis")
	.call(yAxis)
.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 5)
  .attr("dy", ".75em")
  .style("text-anchor", "end")
  .text("INDEXCIJFER");

// add bars to chart
var bars = svg.selectAll(".bar")
.data(data)
.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function(d) { return x(d.Jaar); })
	.attr("y", function(d) { return y(d.Indexcijfer); })
	.attr("height", function(d) { return height - y(d.Indexcijfer); })
	.attr("width", x.rangeBand())
	.on("mouseover", tip.show)
	.on("mouseout", tip.hide);

});
}
