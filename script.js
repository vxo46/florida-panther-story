// MAP (simple animated fade layers)

const map = d3.select("#map")
    .append("svg")
    .attr("width", "100%")
    .attr("height", 500);

const layers = [
    {color:"#ffcc80", opacity:0.9},
    {color:"#ff8a65", opacity:0.6},
    {color:"#e65100", opacity:0.4},
    {color:"#bf360c", opacity:0.2}
];

layers.forEach((layer, i) => {
    map.append("rect")
        .attr("x", 50 + i*40)
        .attr("y", 50 + i*40)
        .attr("width", 400 - i*80)
        .attr("height", 300 - i*80)
        .attr("fill", layer.color)
        .attr("opacity", layer.opacity);
});

// POPULATION CHART

const data = [
    {year:1970, pop:30},
    {year:1980, pop:30},
    {year:1990, pop:40},
    {year:2000, pop:80},
    {year:2010, pop:120},
    {year:2020, pop:200}
];

const width = 600;
const height = 400;

const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const x = d3.scaleLinear()
    .domain([1970, 2020])
    .range([50, width - 50]);

const y = d3.scaleLinear()
    .domain([0, 220])
    .range([height - 50, 50]);

const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.pop));

svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#ff8a65")
    .attr("stroke-width", 3)
    .attr("d", line);

svg.append("g")
    .attr("transform", `translate(0,${height-50})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

svg.append("g")
    .attr("transform", `translate(50,0)`)
    .call(d3.axisLeft(y));
