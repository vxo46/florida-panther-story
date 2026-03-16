const width = 700;
const height = 500;

const svg = d3.select("#heatmap")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`);

const gridSize = 20;

const years = {
  1975: generateData(10),
  1995: generateData(25),
  2010: generateData(50),
  2020: generateData(80)
};

const color = d3.scaleSequential()
  .interpolator(d3.interpolateReds)
  .domain([0, 100]);

function generateData(intensity) {
  return d3.range(400).map(() => Math.random() * intensity);
}

function draw(year) {
  const data = years[year];

  svg.selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d, i) => (i % 20) * gridSize)
    .attr("y", (d, i) => Math.floor(i / 20) * gridSize)
    .attr("width", gridSize)
    .attr("height", gridSize)
    .transition()
    .duration(800)
    .attr("fill", d => color(d));
}

draw(1975);

// Scrollama
const scroller = scrollama();

scroller
  .setup({
    step: ".step",
    offset: 0.6
  })
  .onStepEnter(response => {
    const year = response.element.dataset.year;
    draw(year);
  });
