// Name: Pleun Bisseling
// Studentnumber: 10591249

window.onload = function(){

  // set dimensions
  var margin = {top: 20, right: 40, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  // format date
  var formatDate = d3.time.format("%Y%m%d");

  // set ranges
  var x = d3.time.scale()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  var color = d3.scale.ordinal()
    .range(["#308e22", "#1b5fe8","#fc0202"]);

  var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.temperature); });

  //add axes
  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.time.format("%b"));

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
      d.Datum = formatDate.parse(d.Datum);
      d.Gem = +d.Gem / 10;
      d.Min = +d.Min / 10;
      d.Max = +d.Max / 10;  
    });

    // create lists for gem/max/min containing date and temp
    var all_05 = d3.keys(data[0]).filter(function (key) { return key !== "Datum";}).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {date: d.Datum, temperature: d[id]};
        })
      };
    });

    // set domain
    x.domain(d3.extent(data, function (d) {return d.Datum;}));

    y.domain([d3.min(data, function(d) { return d.Min; }),
    d3.max(data, function(d) { return d.Max; })]);

    color.domain(all_05.map(function(c) { return c.id; }));

    // call x axis and add text
    svg.append("g")
      .attr("class", "x axis")
      .attr("id", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Month");

    // call y axis and add text
    svg.append("g")
      .attr("class", "y axis")
      .attr("id", "yAxis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Temperature (Celsius)");

    // add data attribute
    var temps_05 = svg.selectAll(".temps_05")
      .data(all_05)
      .enter().append("g")
      .attr("class", "temps_05");

    // add lines
    temps_05.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.id); });

    // add text at the end of lines
    temps_05.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "12px Helvetica")
      .style("fill", function(d) { return color(d.id); })
      .text(function(d) { return d.id; });

    // interactive crosshair
    // based on: https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
    var mouseG = svg.append("g")
      .attr("class", "mouse-over-effects");

    // create black vertical line
    mouseG.append("path")
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
  
    // select your datalines
    var lines = document.getElementsByClassName("line");

    // attach data
    var mousePerLine = mouseG.selectAll(".mouse-per-line")
      .data(all_05)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    // add circles for intersections with lines
    mousePerLine.append("circle")
      .attr("r", 5)
      .style("stroke", function(d) {
        return color(d.id);
      })
      .style("fill", "none")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    // add text
    mousePerLine.append("text")
      .attr("dy", -5)
      .attr("x", 5);

    // append a rect to catch mouse movements
    mouseG.append("svg:rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      // hide line, circles and text
      .on("mouseout", function() {
          d3.select(".mouse-line")
              .style("opacity", "0");
          d3.selectAll(".mouse-per-line circle")
              .style("opacity", "0");
          d3.selectAll(".mouse-per-line text")
              .style("opacity", "0");
      })
      // show line, circles and text
      .on("mouseover", function() {
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      // mouse moving over canvas
      .on("mousemove", function() {
      var mouse = d3.mouse(this);
      d3.select(".mouse-line")
        .attr("d", function() {
          var d = "M" + mouse[0] + "," + height;
              d += " " + mouse[0] + "," + 0;
              return d;
        });

      // determine position
      d3.selectAll(".mouse-per-line")
        .attr("transform", function(d, i) {
        // get the start and ending location
          var beginning = 0,
              end = lines[i].getTotalLength(),
              target = null;

        // find target position
        while (true) {
            target = Math.floor((beginning + end) / 2);
            pos = lines[i].getPointAtLength(target);
            if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                break;
            }
            if (pos.x > mouse[0]) end = target;
            else if (pos.x < mouse[0]) beginning = target;
            else break;
        }
        // add text at right position with one decimal
        d3.select(this).select("text")
            .text(y.invert(pos.y).toFixed(1));

        // translate crosshair location
        return "translate(" + mouse[0] + "," + pos.y + ")";
        });
      });
  });

  // add button to update data
  d3.select("button")
    .on("click", update_to_15);

  function update_to_15() {

  // remove 2005 data
  svg.selectAll(".temps_05")
  .remove()

  // remove 2005 axes
  svg.selectAll("#xAxis").remove();

  svg.selectAll("#yAxis").remove();

  // load data
  d3.json("knmi15.json", function(error, data) {
    if (error) throw error;

    data.forEach(function(d) {
      d.Datum = formatDate.parse(d.Datum);
      d.Gem = +d.Gem / 10;
      d.Min = +d.Min / 10;
      d.Max = +d.Max / 10;  
    });

    // create lists for gem/max/min containing date and temp
    var all_15 = d3.keys(data[0]).filter(function (key) { return key !== "Datum";}).map(function(id) {
      return {
        id: id,
        values: data.map(function(d) {
          return {date: d.Datum, temperature: d[id]};
        })
      };
    });    

    // set domain
    x.domain(d3.extent(data, function (d) {return d.Datum;}));

    y.domain([d3.min(data, function(d) { return d.Min; }),
    d3.max(data, function(d) { return d.Max; })]);

    color.domain(all_15.map(function(c) { return c.id; }));

    // call x axis and add text
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Month");

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
      .text("Temperature (Celsius)");    

    // add data attribute
    var temps_15 = svg.selectAll(".temps_15")
      .data(all_15)
      .enter().append("g")
      .attr("class", "temps");

    // add lines
    temps_15.append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.id); });

    // add text at the end of lines
    temps_15.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "12px Helvetica")
      .style("fill", function(d) { return color(d.id); })
      .text(function(d) { return d.id; });
  });

  d3.select("button").remove();

  };

};