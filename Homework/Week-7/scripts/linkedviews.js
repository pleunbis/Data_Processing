// Name: Pleun Bisseling
// Studentnumber: 10591249

window.onload = function(){

  queue()
    .defer(d3.json, 'data/euc_.json')
    .defer(d3.json, 'data/euc_gini14.json')
    .await(initialize);

  // initialize homepage
  function initialize(error, euc_, euc_gini14){
    if (error) throw error;
    scatterplot(euc_);
    makemap(euc_gini14);
  };

  function scatterplot(euc_) {
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
    .orient("left");

  // add attributes to chart
  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  euc_.forEach(function (d) {
    d.Wellbeing = +d.Wellbeing;
    d.GDP_capita = +d.GDP_capita;
  });

  // set domain for data 
  var x_pos = x.domain([d3.max(euc_, function(d) { return d.GDP_capita; }), 0]).nice();
  var y_pos = y.domain(d3.extent(euc_, function(d) { return d.Wellbeing; })).nice();

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
    .data(euc_)
  .enter().append("circle")
    .attr("class", function(d) {return "dot" + d.idc;})
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
    
  svg.append("text")
    .attr({
    // determine position of text
    id: "t",
        x: function() { return x_pos(d.GDP_capita) - 55; },
        y: function() { return y_pos(d.Wellbeing) - 15; }
    })
    .text(function() {
      // return values as text
      return [d.Country + ": $" + d.GDP_capita + "; " + d.Wellbeing];
    });
  };

  function handleMouseOut(d) {
    // change dotsize back to normal
    d3.select(this).attr({
      r: radius
    });

    d3.select("#t").remove();
  };

  // add legend
  var legend = d3.select("svg")
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 30 + ")";
      });

  legend.append("rect")
    .attr("x", width + 60)
    .attr("y", height - 120)
    .attr("width", 20)
    .attr("height", 20)
    .style("fill", color);

  legend.append("text")
    .attr("x", width - 45)
    .attr("y", height - 105)
    .text(function(d) { return d; });

  };

}
