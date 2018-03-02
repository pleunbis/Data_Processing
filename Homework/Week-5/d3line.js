window.onload = function(){

// set dimensions
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set ranges
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

// add axes
var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom");

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")

// add attributes to chart
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load dataset
d3.json("knmi05.json", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.Datum = +d.Datum;
    d.Gem = +d.Gem;
    d.Min = +d.Min;
    d.Max = +d.Max;
    console.log(d);
 });

x.domain([d3.extent(data, function(d) { return d.Datum; })]);
y.domain([d3.min(data, function(d) { return d.Min; }), d3.max(data, function(d) { return d.Wellbeing; })]);

// turn and call x axis
svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
.append("text")
  .attr("class", "label")
  .attr("x", width)
  .attr("y", -6)
  .style("text-anchor", "end")
  .text("Date");

// call y axis and add text
svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
.append("text")
  .attr("class", "label")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Temperature")


});

}

