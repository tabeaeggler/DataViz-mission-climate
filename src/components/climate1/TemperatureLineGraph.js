import React, { useState, useEffect, useRef } from "react"
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  scaleLinear,
  axisRight,
} from "d3"

const TemperatureLineGraph = props => {
  console.log("props", props)
  console.log("props.climateData", props.climateData)
  const [selectedCountry, setSelectedCountry] = useState(props.selectedCountry)
  const [climateData, setClimateData] = useState(props.climateData)
  const svgRef = useRef()

  useEffect(() => {
    console.log("climateData", climateData)
    const svg = select(svgRef.current) //wrapper, so that the svg is available for d3.

    /*
    const xScale = scaleLinear()
      .domain([0, 58]) //1961 - 2019: 58 Jahre
      .range([0, 800]) //visual representation of domain

    const yScale = scaleLinear().domain([-1, 4]).range([250, 0])

    const xAxis = axisBottom(xScale)
      .ticks(10)
      .tickFormat(index => index + 1)
    svg.select(".x-axis").call(xAxis)

    const yAxis = axisRight(yScale)
    svg.select(".y-axis").call(yAxis)

    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal)

    svg
      .selectAll(".line")
      .data(climateData)
      .join("path")
      .attr("class", "line")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "blue")
      */
  }, [climateData])

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
        <h1>Hallo</h1>
      </svg>
    </React.Fragment>
  )
}

export default TemperatureLineGraph
