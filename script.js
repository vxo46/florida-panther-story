/* ======================
   MAP
====================== */

const mapWidth = document.querySelector(".sticky").clientWidth;
const mapHeight = window.innerHeight;

const mapSvg = d3.select("#map")
  .attr("width", mapWidth)
  .attr("height", mapHeight);

const projection = d3.geoMercator();
const path = d3.geoPath().projection(projection);

d3.json("florida.geo.json").then(data => {

  projection.fitSize([mapWidth, mapHeight], data);

  const base = mapSvg.append("path")
    .datum(data)
    .attr("d", path)
    .attr("fill", "#ddd")
    .attr("stroke", "#333");

  const overlay = mapSvg.append("path")
    .datum(data)
    .attr("d", path)
    .attr("fill", "#ffb74d")
    .attr("opacity", 0.7);

  const colors = ["#ffe082","#ffb74d","#ff9800","#ef6c00"];

  const scroller = scrollama();

  scroller
    .setup({
      step: ".step",
      offset: 0.5
    })
    .onStepEnter(response => {
      overlay
        .transition()
        .duration(600)
        .attr("fill", colors[response.index]);
    });
});

/* ======================
   POPULATION CHART
====================== */

d3.csv("population.csv").then(data => {

  data.forEach(d => {
    d.year = +d.year;
    d.population = +d.population;
  });

  const width = 900;
  const height = 500;

  const svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([80, width - 50]);

  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.population) + 20])
      .range([height - 80, 40]);

  svg.append("g")
    .attr("transform", `translate(0, ${height - 80})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  svg.append("g")
    .attr("transform", "translate(80,0)")
    .call(d3.axisLeft(y));

  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.population));

  const path = svg.append("path")
    .datum([])
    .attr("fill", "none")
    .attr("stroke", "#ef6c00")
    .attr("stroke-width", 4);

  const chartScroller = scrollama();

  chartScroller
    .setup({
      step: ".chart-step",
      offset: 0.6
    })
    .onStepEnter(response => {

      let visibleData;

      if (response.index === 0) {
        visibleData = data.filter(d => d.year <= 1973);
      } else if (response.index === 1) {
        visibleData = data.filter(d => d.year <= 1995);
      } else if (response.index === 2) {
        visibleData = data.filter(d => d.year <= 2010);
      } else {
        visibleData = data;
      }

      path
        .datum(visibleData)
        .transition()
        .duration(800)
        .attr("d", line);
    });
});
