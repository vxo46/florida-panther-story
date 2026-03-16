// ==========================
// GRAPH FUNCTION (Reusable)
// ==========================

function createAnimatedChart(svgId, csvFile, valueKey, color, stepClass) {

  d3.csv(csvFile).then(data => {

    data.forEach(d => {
      d.year = +d.year;
      d[valueKey] = +d[valueKey];
    });

    const container = document.querySelector(svgId).parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgId)
      .attr("width", width)
      .attr("height", height);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([60, width - 40]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[valueKey]) * 1.1])
      .range([height - 60, 40]);

    svg.append("g")
      .attr("transform", `translate(0, ${height - 60})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
      .attr("transform", "translate(60,0)")
      .call(d3.axisLeft(y));

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d[valueKey]));

    const path = svg.append("path")
      .datum([])
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 4);

    const scroller = scrollama();

    scroller
      .setup({
        step: stepClass,
        offset: 0.6
      })
      .onStepEnter(response => {

        d3.selectAll(stepClass).classed("active", false);
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

        path
          .datum(visibleData)
          .transition()
          .duration(800)
          .attr("d", line);
      });

  });
}


// ==========================
// MORTALITY GRAPH
// ==========================

createAnimatedChart(
  "#mortalityChart",
  "mortality.csv",
  "deaths",
  "#c62828",
  ".mortality-step"
);


// ==========================
// POPULATION GRAPH
// ==========================

createAnimatedChart(
  "#populationChart",
  "population.csv",
  "population",
  "#ef6c00",
  ".population-step"
);
