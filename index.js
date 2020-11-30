const width = 800, height = 1000, padding = 100;

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"

const visionHolder = d3.select("body")
    .append("div")
    .attr("class", "visionHolder")
    .attr("width", width)
    .attr("height", height)

const h1 = visionHolder
    .append("h1")
    .attr("id", "title")
    .text("h1 tag here")
    .append("text")
    .attr("id", "description")
    .text("description here")

const svg = visionHolder
    .append("svg")
    .attr("class", "svg")
    .attr("width", width - padding)
    .attr("height", height - padding)

const tooltip = visionHolder
    .append('div')
    .attr('id', 'tooltip')
    .attr('height', 100)
    .attr('width', 100)
    .style('opacity', 0)

const color = d3.scaleOrdinal(d3.schemePastel1)

fetch(url).then(response => response.json()).then(data => {
    console.log(data)


    const monthlyVariance = data.monthlyVariance

    const xScale = d3.scaleLinear()
        .domain(d3.extent(monthlyVariance, x => x.year))
        .range([padding, width - padding])
    const yScale = d3.scaleLinear()
        .domain([d3.min(monthlyVariance, x => x.variance + data.baseTemperature), d3.max(monthlyVariance, x => x.variance + data.baseTemperature)])
        .range([padding, height - padding])
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)
    svg.append('g')
        .attr("id", "x-axis")
        .attr('transform', 'translate(0,' + (height - padding) + ')')
        .call(xAxis);
    svg.append('g')
        .attr("id", "y-axis")
        .attr('transform', 'translate(' + padding + ',0)')
        .call(yAxis)

    // rect x depends on year, y depends on month, color depends on temperature 
    const rect = svg.selectAll('rect')
        .data(monthlyVariance)
        .enter()
        .append('rect')
        .attr('class', 'cell')
        .attr("width", 10)
        .attr('height', 50)
        .attr('data-temp', d => d.variance)
        .attr('data-year', d => d.year)
        .attr('data-month', d => d.month)
    // .attr("fill",color)


    const legend = visionHolder.append('g')
        .attr('id', 'legend')
    legend.selectAll('rect')
        .data(color)
        .enter()
        .append('rect')
        .attr("width", 30)
        .attr('height', 30)
        .attr('fill', color)

        .on('mousemove', (event, d) => {
            tooltip.style('opacity', 0.8)
                .attr('data-year', d.monthlyVariance.year)
        })
        .on('mouseout', (event, d) => {
            tooltip.style('opacity', 0)
        })

})