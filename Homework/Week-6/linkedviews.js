// Name: Pleun Bisseling
// Studentnumber: 10591249

window.onload = function(){

  queue()
    .defer(d3.json, 'euc.json')
    .defer(d3.json, 'euc_ineq_out.json')
    .await(initialize);

  function initialize(error, euc, euc_ineq_out){

    if (error) throw error;
    scatterplot(euc);
    makemap();

    euc_ineq_out.forEach(function(d){
      if (error) throw error;
      d.IoO = +d.IoO;

    })
    console.log(euc_ineq_out);
  }

}

function scatterplot(euc) {
// set dimensions
var margin = {top: 30, right: 60, bottom: 20, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    radius = 4;

// set ranges
var x = d3.scale.linear()
    .range([width, 0]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#12cc4c", "#fd7c3b", "#fecc5c", "#1087a8"]);

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

euc.forEach(function (d) {
    d.Wellbeing = +d.Wellbeing;
    d.GDP_capita = +d.GDP_capita;
  })

console.log(euc);

// set domain for data 
var x_pos = x.domain([d3.max(euc, function(d) { return d.GDP_capita; }), 0]).nice();
var y_pos = y.domain(d3.extent(euc, function(d) { return d.Wellbeing; })).nice();

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
  .text("GDP/capita in $");

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
  .text("Average Wellbeing")

// add data as dots
svg.selectAll(".dot")
  .data(euc)
.enter().append("circle")
  .attr("class", "dot")
  .attr("r", 4)
  .attr("cx", function(d) { return x(d.GDP_capita); })
  .attr("cy", function(d) { return y(d.Wellbeing); })
  .style("fill", function(d) { return color(d.Region); })
  .on("mouseover", handleMouseOver)
  .on("mouseout", handleMouseOut);

function handleMouseOver(d) {
    
    d3.select(this).attr({
      // change dotsize
      r: radius * 2
    });
    
  svg.append("text").attr({
    // determine position of text
    id: "t",
        x: function() { return x_pos(d.GDP_capita) - 55; },
        y: function() { return y_pos(d.Wellbeing) - 15; }
    })
    .text(function() {
      // return values as text
      return [d.Country + ": $" + d.GDP_capita + ", " + d.Wellbeing];
    });
  };

function handleMouseOut(d) {
    // change dotsize back to normal
  d3.select(this).attr({
    r: radius
    });

    d3.select("#t").remove();
  };

};


function makemap(){
var map = new Datamap({
        scope: 'world',
        element: document.getElementById('container'),
       
        // zoom in on Europe
        setProjection: function(element) {
          var projection = d3.geo.equirectangular()
          .center([18, 55])
          .scale(850)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
          var path = d3.geo.path()
          .projection(projection);

          return {path: path, projection: projection};
        },

        fills: {
          defaultFill: '#a8a49f',
        },
        
      })            
};
