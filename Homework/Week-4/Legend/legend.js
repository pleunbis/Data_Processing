// Name: Pleun Bisseling
// Studentnumber: 10591249

window.onload = function(){

var rect_legend = {width: 20, height: 20, padding: 5}

var color = d3.scale.ordinal()
    .domain(["Western Europe", "Eastern Europe", "Southern Europe", "Northern Europe"])
    .range(["#12cc4c", "#fd7c3b", "#fecc5c", "#1087a8"]);

var legend = d3.select("body").append("svg")
    .append("g")
    .selectAll("g")
    .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        var x = 5;
        var y = i * (rect_legend.width + rect_legend.height);
        return "translate(" + x + "," + y + ")";
    });

legend.append("rect")
    .attr("width", rect_legend.width)
    .attr("height", rect_legend.height)
    .style("fill", color)

legend.append("text")
    .attr("x", rect_legend.width + rect_legend.padding)
    .attr("y", rect_legend.height - rect_legend.padding)
    .text(function(d) { return d; });

}