/* =========================
   MAP + MORTALITY INTENSITY
========================= */

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

  // Mortality glow circle (South Florida)
  const heat = mapSvg.append("circle")
    .attr("cx", mapWidth * 0.65)
    .attr("cy", mapHeight * 0.72)
    .attr("r", 0)
    .attr("fill", "#d84315")
    .attr("opacity", 0.5);

  d3.csv("mortality.csv").then(mortality => {

    mortality.forEach(d => {
      d.year = +d.year;
      d.deaths = +d.deaths;
    });

    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(mortality, d => d.deaths)])
      .range([0, 120]);

    const scroller = scrollama();

    scroller
      .setup({
        step: ".step",
        offset: 0.6
      })
      .onStepEnter(response => {

        d3.selectAll(".step").classed("active", false);
        d3.select(response.element).classed("active", true);

        const dataPoint = mortality[response.index];

        heat.transition()
          .duration(800)
          .attr("r", radiusScale(dataPoint.deaths));
      });
  });
});


/* =========================
   POPULATION GRAPH
========================= */

d3.csv("population.csv").then(data => {

  data.forEach(d => {
    d.year = +d.year;
    d.population = +d.population;
  });

  const width = document.querySelector(".chart-sticky").clientWidth;
  const height = document.querySelector(".chart-sticky").clientHeight;

  const svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

  const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([70, width - 40]);

  const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.population) + 20])
      .range([height - 60, 40]);

  svg.append("g")
    .attr("transform", `translate(0, ${height - 60})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  svg.append("g")
    .attr("transform", "translate(70,0)")
    .call(d3.axisLeft(y));

  const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.population));

  const pathLine = svg.append("path")
    .datum([])
    .attr("fill", "none")
    .attr("stroke", "#e65100")
    .attr("stroke-width", 4);

  const chartScroller = scrollama();

  chartScroller
    .setup({
      step: ".chart-step",
      offset: 0.6
    })
    .onStepEnter(response => {

      d3.selectAll(".chart-step").classed("active", false);
      d3.select(response.element).classed("active", true);

      let visibleData;

      if (response.index === 0) {
        visibleData = data.slice(0,1);
      } else if (response.index === 1) {
        visibleData = data.slice(0,2);
      } else if (response.index === 2) {
        visibleData = data.slice(0,4);
      } else {
        visibleData = data;
      }

      pathLine
        .datum(visibleData)
        .transition()
        .duration(800)
        .attr("d", line);
    });
});
