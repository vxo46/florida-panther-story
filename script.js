/* ======================
   MAP SETUP
====================== */

const mapWidth = document.querySelector(".sticky").clientWidth;
const mapHeight = window.innerHeight;

const svg = d3.select("#map")
  .attr("width", mapWidth)
  .attr("height", mapHeight);

const projection = d3.geoMercator();
const path = d3.geoPath().projection(projection);

/* ======================
   LOAD FLORIDA
====================== */

d3.json("florida.geo.json").then(function(data) {

  projection.fitSize([mapWidth, mapHeight], data);

  const base = svg.append("path")
    .datum(data)
    .attr("d", path)
    .attr("fill", "#333")
    .attr("stroke", "#aaa");

  const overlay = svg.append("path")
    .datum(data)
    .attr("d", path)
    .attr("fill", "#ffcc80")
    .attr("opacity", 0.8);

  const colors = ["#ffcc80","#ff8a65","#e65100","#bf360c"];

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

const chartWidth = 800;
const chartHeight = 400;

const chartSvg = d3.select("#chart")
  .attr("width", chartWidth)
  .attr("height", chartHeight);

const population = [
  {year:1970, pop:30},
  {year:1980, pop:30},
  {year:1990, pop:40},
  {year:2000, pop:80},
  {year:2010, pop:120},
  {year:2020, pop:200}
];

const x = d3.scaleLinear()
  .domain([1970, 2020])
  .range([60, chartWidth-40]);

const y = d3.scaleLinear()
  .domain([0, 220])
  .range([chartHeight-60, 40]);

const line = d3.line()
  .x(d => x(d.year))
  .y(d => y(d.pop));

chartSvg.append("path")
  .datum(population)
  .attr("fill","none")
  .attr("stroke","#ff8a65")
  .attr("stroke-width",3)
  .attr("d", line);

chartSvg.append("g")
  .attr("transform","translate(0,"+(chartHeight-60)+")")
  .call(d3.axisBottom(x).tickFormat(d3.format("d")));

chartSvg.append("g")
  .attr("transform","translate(60,0)")
  .call(d3.axisLeft(y));
