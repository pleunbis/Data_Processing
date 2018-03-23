// Name: Pleun Bisseling
// Studentnumber: 10591249

window.onload = function(){

  queue()
    .defer(d3.json, 'data/euc_.json')
    .defer(d3.json, 'data/euc_gi_indx.json')
    .await(initialize);

  // initialize homepage
  function initialize(error, euc_, euc_gi_indx){
    if (error) throw error;
    scatterplot(euc_);
    makemap(euc_gi_indx);
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

  function makemap(euc_gi_indx){

  // create array to store data in
  var series = [];

  // load json file
  euc_gi_indx.forEach(function(d){
    // change strings into numbers
    d.GINI = +d.GINI;
    // assign different colors to levels of gini index
    color = function(GINI){
    if (GINI > 25 && GINI < 27) {
      return "#f3bebb"}
    else if (GINI > 27 && GINI < 29) {
      return "#ee9d99"}
    else if (GINI > 29 && GINI < 31) {
      return "#e87d77"}
    else if (GINI > 31 && GINI < 33) {
      return "#e35d56"}
    else if (GINI > 33 && GINI < 35) {
      return "#b54a44"}
    else if (GINI > 35) {
      return "#883733"} 
  };

  // store data into array
  series.push([d.idc, d["Country"], d.GINI, color(d.GINI)]);

  });

  var dataset = {};    
  
  // fill dataset in appropriate format
  series.forEach(function(item){ 
      var idc = item[0],
      cntry = item[1];
      gini = item[2];
      fillColor = item[3];
      dataset[idc] = {GI: gini, fillColor: fillColor, Country: cntry};
  });

  // create map
  var map = new Datamap({
    element: document.getElementById("container"),
    data: dataset,
       
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
  // set color fills
  fills: {
    color1: "#f3bebb",
    color2: "#ee9d99",
    color3: "#e87d77",
    color4: "#e35d56",
    color5: "#b54a44",
    color6: "#883733",
    defaultFill: '#a8a49f',
  },
  done: function(datamap) {
    datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
       
    // scroll down to scatterplot on click
    window.scrollTo(0, 640);

    // highlight clicked country in scatterplot
    var currentCountry = d3.select(this).attr("class").split(" ")[1];
    d3.select(".dot" + currentCountry)
      .attr("r", 30)
    })
  },
  geographyConfig: {
      borderColor: '#ffffff',
      highlightBorderWidth: 4,
      // keep colorfill on hover
      highlightFillColor: function(geo) {
        return geo['fillColor'] || '#605e5c';
      },
      highlightBorderColor: '#c6c6c0',
      // show info tooltip
      popupTemplate: function(geo, data) {
        // tooltip info for non-EU countries
        if (!data) { return ['<div class="hoverinfo">',
        'Not an EU memberstate',
        '</div>'].join('');}
        // tooltip info gini index
        return ['<div class="hoverinfo">',
        '<strong>', geo.properties.name, '</strong>',
        '<br>GINI-index: <strong>', data.GI,'</strong>', '%',
        '</div>'].join('');   
      }
  }
  });  

  // set legend for map
  var l = {
  legendTitle: "GINI Index",
  defaultFillName: "Not in EU",
  labels: {
      color1: "25 - 27 %",
      color2: "27 - 29 %",
      color3: "29 - 31 %",
      color4: "31 - 33 %",
      color5: "33 - 25 %",
      color6: "35 - 37 %",
  }
  }; 
  // create legend
  map.legend(l);

  };
}
