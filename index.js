const width = d3.select("svg").attr("width")
const height = d3.select("svg").attr("height")
const colorDomain = ["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598",
    "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]
const monthDomain = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const req = new XMLHttpRequest();
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
const svg = d3.select("svg")
const margin = { top: 100, right: 150, bottom: 100, left: 150, }
const innerWidth = width - margin.left - margin.right
const innerHeight = height - margin.top - margin.bottom
const tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

req.open("GET", url, true);
req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
        const data = (JSON.parse(req.responseText));
        const monthlyVariance = data.monthlyVariance
        const year = data.monthlyVariance.year
        const month = data.monthlyVariance.month
        const variance = data.monthlyVariance.variance
        console.log(d3.schemePiYG[11])
        const yScale = d3.scaleLinear()
            .domain([d3.min(monthlyVariance, x => x.month - 0.5), d3.max(monthlyVariance, x => x.month + 0.5)])
            .range([innerHeight, 0])

        const xScale = d3.scaleLinear()
            .domain(d3.extent(monthlyVariance, x => x.year))
            .range([0, innerWidth])
        const colorScale = d3.scaleLinear()
            .domain(d3.extent(monthlyVariance, x => x.variance))
            .range([0, 1])
        const rectsG = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top - 23})`);
        const rects = rectsG.selectAll('rect')
            .data(data.monthlyVariance)
            .enter()
            .append('rect')
        rects
            .attr('width', innerWidth / 3153 * 12)
            .attr('height', innerHeight / 12)
            .attr("y", d => yScale(d.month))
            .attr("x", d => xScale(d.year))
            .attr('fill', d => d3.interpolateTurbo(colorScale(d.variance)))
        const axisG = svg.append("g")
            .attr('transform', `translate(${margin.left},${margin.top})`);
        const xAxis = d3.axisBottom(xScale)
        const yAxisScale = d3.scaleBand()
            .domain(monthDomain)
            .range([innerHeight, 0])
        const yAxis = d3.axisLeft(yAxisScale)

        const xAxisG = axisG.append('g').call(xAxis)
            .attr('transform', `translate(0,${innerHeight})`)
        const yAxisG = axisG.append('g').call(yAxis)
            .attr('transform', `translate(0,0)`);


        rects.on('mouseover', (event, d) => {
            tooltip.transition()
                .duration(0)
                .style('opacity', 0.8)
            tooltip.style("left", event.pageX + 30 + "px")
                .style("top", event.pageY + 30 + "px")
            tooltip.html(`${d.year} <br>
                ${monthDomain[d.month - 1]} <br>
            Temperature: ${d3.format(".3")(d.variance + data.baseTemperature)} ℃
                `)
        })
            .on('mouseout', (event, d) => {
                tooltip.transition().duration(0)
                    .style('opacity', 0)
            })
    }
}
req.send()