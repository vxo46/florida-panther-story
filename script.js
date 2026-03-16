// ==============================
// REUSABLE ANIMATED LINE CHART
// ==============================

function createChart(config) {

  d3.csv(config.csv).then(data => {

    data.forEach(d => {
      d.year = +d.year;
      d.value = +d[config.valueKey];
    });

    const container = document.querySelector(config.svg).parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(config.svg)
      .attr("width", width)
      .attr("height", height);

    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d.year))
      .range([70, width - 40]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) * 1.1])
      .range([height - 60, 40]);

    svg.append("g")
      .attr("transform", `translate(0, ${height - 60})`)
      .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
      .attr("transform", "translate(70,0)")
      .call(d3.axisLeft(y));

    const line = d3.line()
      .x(d => x(d.year))
      .y(d => y(d.value));

    const path = svg.append("path")
      .datum([])
      .attr("fill", "none")
      .attr("stroke", config.color)
      .attr("stroke-width", 4);

    const scroller = scrollama();

    scroller
      .setup({
        step: config.stepClass,
        offset: 0.6
      })
      .onStepEnter(response => {

        d3.selectAll(config.stepClass).classed("active", false);
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

// ==============================
// MORTALITY CHART
// ==============================

createChart({
  svg: "#mortalityChart",
  csv: "mortality.csv",
  valueKey: "deaths",
  color: "#c62828",
  stepClass: ".mortality-step"
});

// ==============================
// POPULATION CHART
// ==============================

createChart({
  svg: "#populationChart",
  csv: "population.csv",
  valueKey: "population",
  color: "#ef6c00",
  stepClass: ".population-step"
});
