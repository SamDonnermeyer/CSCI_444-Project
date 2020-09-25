// Create Heat Map of Raster Data from Coffee Reviews 
// Data: https://github.com/jldbc/coffee-quality-database/tree/master/data


//////////////////////////////////////////////////
///////////////////// RASTER /////////////////////
//////////////////////////////////////////////////

// set the dimensions and margins of the graph
var margin = {top: 50, right: 50, bottom: 50, left: 150},
  width = 800 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  //.attr("align","center")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var myColor = d3.scaleSequential()
  .interpolator(d3.interpolateBlues)
  .domain([7, 8.2])

//Read the data
d3.csv("https://raw.githubusercontent.com/SamDonnermeyer/CSCI_444/master/Raster/coffee_reviews.csv", function(data) {
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var myGroups = d3.map(data, function(d){return d.group;}).keys()
  var myVars = d3.map(data, function(d){return d.variable;}).keys()

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, width ])
    .domain(myGroups)
    .padding(0.05);
  
  svg.append("g")
    .style("font-size", 14)
    .attr("transform", "translate(0," + (height - 25) + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([ (height - 25), 0 ])
    .domain(myVars)
    .padding(0.05);
  
  svg.append("g")
    .style("font-size", 14)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  
  // Build color scale
  var myColor = d3.scaleSequential()
    .interpolator(d3.interpolateBlues)
    .domain([7, 8.2])

var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    //.attr("align", "center")
    .style("background-color", "white")
    .style("padding", "5px")

 ///////////////////////////////////
 // Three function that change the tooltip when user hover / move / leave a cell
 var mouseover = function(d) {
  tooltip
    .style("opacity", 1)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
}

var mousemove = function(d) {
  tooltip
    .html("Average Score: " + d.value)
    .style("left", (d3.mouse(this)[0]) + 470 +"px") //+ 350) +
    .style("top", (d3.mouse(this)[1]) + 350 + "px") // + 350
}

var mouseleave = function(d) {
  tooltip
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.95)
}

///////////////////////////////////

  // add the squares
  svg.selectAll()
    .data(data, function(d) {return d.group+':'+d.variable;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.group) })
      .attr("y", function(d) { return y(d.variable) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.95)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
})

// Add title to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -30)
        .attr("text-anchor", "left")
        .style("font-size", "25px")
        .text("Average Coffee Quality by Elevation");

// Add subtitle to graph
svg.append("text")
        .attr("x", 0)
        .attr("y", -8)
        .attr("text-anchor", "left")
        .style("font-size", "15px")
        .style("fill", "#626268")
        .style("max-width", 800)
        .text("The coffee surveyed is ranked 1-10 by the Coffee Quality Institute's trained reviewers.");

// text label for the x axis
svg.append("text")
  .attr("transform", "translate(" + (width/2) + " ," + (height + 40 - 25) + ")") //margin.top + 
  .style("text-anchor", "middle")
  .text("Elevation in Meters");

// text label for the y axis
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2) + 10)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Quality Measures");      

  /////////////////////////
// Build Legend for Heatmap
var legendRectSize = 18;
var legendSpacing = 4;

var legend = svg.selectAll('#legend')
  .data(myColor.domain())
  .enter()
  .append('g')
  //.attr('class', 'legend')
  .attr('transform', function(d, i) {
    var height = legendRectSize + legendSpacing;
    var offset =  height * myColor.domain().length / 2;
    var horz = -2 * legendRectSize + 600;
    var vert = i * height - offset + 470;
    return 'translate(' + horz + ',' + vert + ')';
  });


legend.append('rect')
  .attr('width', legendRectSize)
  .attr('height', legendRectSize)
  .style('fill', myColor)
  .style('stroke', "black");

legend.append('text')
  .attr('x', legendRectSize + legendSpacing)
  .attr('y', legendRectSize - legendSpacing)
  .text(function(d) { return d; });

//////////////////////////////////////////////////
///////////////// Choropleth /////////////////////
//////////////////////////////////////////////////

// Define Margins
var margin2 = {top: 80, right: 20, bottom: 50, left: 20},
  width2 =  800 - margin2.left - margin2.right,
  height2 = 500 - margin2.top - margin2.bottom;

// Create SVG object from the viz div
var svg2 = d3.select("#choropleth_viz")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .attr("transform",
        "translate(" + margin2.left + "," + (margin2.top - 80) + ")");

// Map and projection
var path = d3.geoPath();
var projection = d3.geoNaturalEarth()
    .scale(width2 / 1.4 / Math.PI)
    .translate([400, 290])
var path = d3.geoPath()
    .projection(projection);

// Data and color scale
var data = d3.map();
var colorScale = d3.scaleSequential()
    .interpolator(d3.interpolateBlues)
    .domain([7, 8.2]);

// Legend
var g = svg2.append("g")
    .attr("class", "legendThreshold")
    .attr("transform", "translate(20,280)");

  
var legend2 = d3.legendColor()
		//.labelFormat(d3.format(".0%"))
    .shapePadding(4)
    .scale(colorScale)
		.title("Average Score");
  
svg2.select(".legendThreshold")
    .call(legend2);

// Add title to graph
svg2.append("text")
        .attr("x", 0)
        .attr("y", 22)
        .attr("text-anchor", "left")
        .style("font-size", "25px")
        .text("Average Coffee Quality by Country");

// Add subtitle to graph
svg2.append("text")
        .attr("x", 0)
        .attr("y", 44)
        .attr("text-anchor", "left")
        .style("font-size", "15px")
        .style("fill", "#626268")
        .style("max-width", 800)
        .text("The coffee surveyed is ranked 1-10 by the Coffee Quality Institute's trained reviewers.");




// Load external data and boot
d3.queue()
    .defer(d3.json, "http://enjalot.github.io/wwsd/data/world/world-110m.geojson")
    .defer(d3.csv, "https://raw.githubusercontent.com/SamDonnermeyer/CSCI_444/master/Raster/coffee_geo.csv", function(d) {
  data.set(d["code"], +d.score); })
    .await(ready);

function ready(error, topo) {
  ///////////////////////////////////
  // Tooltip DIV
  var tooltip1 = d3.select("#choropleth_viz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    //.attr("align", "center")
    .style("background-color", "white")
    .style("padding", "5px")
 // Three function that change the tooltip when user hover / move / leave a cell
 var mouseOver = function(d) {
  tooltip1
    .style("opacity", 1)
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1)
}

var mouseMove = function(d) {
  tooltip1
    .html("Average Score: " + d.score)
    .style("left", (d3.mouse(this)[0]) + 200 +"px") 
    .style("top", (d3.mouse(this)[1]) + 200 + "px")
}

var mouseLeave = function(d) {
  tooltip1
    .style("opacity", 0)
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.95)
}
  if (error) throw error;
    // Draw the map
    svg2.append("g")
        .attr("class", "countries")
        .selectAll("path")
        .data(topo.features)
        .enter().append("path")
            .attr("fill", function (d){
                // Pull data for this country
                return colorScale(data.get(d.id) || 0);
            })
            .attr("d", path)
            .style("stroke", "transparent")
            .attr("class", function(d){ return "Country" } )
            .style("opacity", .8)
            .on("mouseover", mouseOver )
            .on("mouseleave", mouseLeave )
            .on("mousemove", mouseMove)
          }

