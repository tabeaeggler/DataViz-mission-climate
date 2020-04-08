import React, { useState, useEffect, useRef } from "react"
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  scaleLinear,
  axisRight,
  extent,
} from "d3"

const TemperatureLineGraph = props => {
  // const [selectedCountry, setSelectedCountry] = useState()
  const [climateData, setClimateData] = useState(props.climateData)
  const svgRef = useRef()

  useEffect(() => {
    setClimateData(props.climateData)
    console.log(climateData)

    // setSelectedCountry(props.selectedCountry)
    const svg = select(svgRef.current) //wrapper, so that the svg is available for d3.

    const xScale = scaleLinear()
      .domain(extent(climateData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, 1500]) //visual representation of domain

    const yScale = scaleLinear().domain([-1, 4]).range([400, 0])

    const xAxis = axisBottom(xScale)
      .ticks(14)
      .tickFormat(index => index + 1)

    svg.select(".x-axis").style("transform", "translateY(400px)").call(xAxis)

    const yAxis = axisRight(yScale)
    svg.select(".y-axis").call(yAxis)

    const myLine = line()
      .x(d => d.year)
      .y(d => d.value)
      .curve(curveCardinal)

    svg
      .selectAll(".line")
      .data(climateData)
      .join("path")
      .attr("class", "line")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("width", "1500")
  }, [props.climateData])

  return (
    <React.Fragment>
      <svg className="temperature-graph" ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
        <h1>Hallo</h1>
      </svg>
    </React.Fragment>
  )
}

export default TemperatureLineGraph
