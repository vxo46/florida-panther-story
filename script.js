const mapWidth = document.querySelector(".sticky").clientWidth;
const mapHeight = document.querySelector(".sticky").clientHeight;

const mapSvg = d3.select("#map")
  .attr("width", mapWidth)
  .attr("height", mapHeight);

const projection = d3.geoMercator();
const path = d3.geoPath().projection(projection);

d3.json("florida.geo.json").then(data => {

  projection.fitSize([mapWidth, mapHeight], data);

  // Base Florida
  mapSvg.append("path")
    .datum(data)
    .attr("d", path)
    .attr("fill", "#eeeeee")
    .attr("stroke", "#999");

  // Historic Habitat (whole state glow)
  const historic = mapSvg.append("path")
    .datum(data)
    .attr("d", path)
    .attr("fill", "#ffcc80")
    .attr("opacity", 0);

  // Core Habitat (South Florida area)
  const core = mapSvg.append("ellipse")
    .attr("cx", mapWidth * 0.65)
    .attr("cy", mapHeight * 0.7)
    .attr("rx", mapWidth * 0.18)
    .attr("ry", mapHeight * 0.15)
    .attr("fill", "#ef6c00")
    .attr("opacity", 0);

  // Urban Expansion
  const urban = mapSvg.append("rect")
    .attr("x", mapWidth * 0.55)
    .attr("y", mapHeight * 0.6)
    .attr("width", mapWidth * 0.3)
    .attr("height", mapHeight * 0.25)
    .attr("fill", "#444")
    .attr("opacity", 0);

  // Heat Glow
  const heat = mapSvg.append("circle")
    .attr("cx", mapWidth * 0.65)
    .attr("cy", mapHeight * 0.72)
    .attr("r", 0)
    .attr("fill", "red")
    .attr("opacity", 0.4);

  const scroller = scrollama();

  scroller
    .setup({
      step: ".step",
      offset: 0.6
    })
    .onStepEnter(response => {

      d3.selectAll(".step").classed("active", false);
      d3.select(response.element).classed("active", true);

      if (response.index === 0) {
        historic.transition().duration(800).attr("opacity", 0.6);
        core.transition().duration(600).attr("opacity", 0);
        urban.transition().duration(600).attr("opacity", 0);
        heat.transition().duration(600).attr("r", 0);
      }

      if (response.index === 1) {
        historic.transition().duration(800).attr("opacity", 0.2);
        core.transition().duration(800).attr("opacity", 0.8);
      }

      if (response.index === 2) {
        urban.transition().duration(800).attr("opacity", 0.6);
      }

      if (response.index === 3) {
        heat.transition().duration(800).attr("r", 90);
      }

    });
});
