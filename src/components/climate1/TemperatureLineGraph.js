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
  const [data, setData] = useState(props)
  // const [climateData, setClimateData] = useState(props.climateData)
  const svgRef = useRef()

  useEffect(() => {
    setData(props)
    console.log(props)

    // setSelectedCountry(props.selectedCountry)
    const svg = select(svgRef.current) //wrapper, so that the svg is available for d3.

    const xScale = scaleLinear()
      .domain(extent(props.climateData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, 1500]) //visual representation of domain

    const yScale = scaleLinear().domain([-1.5, 3]).range([400, 0])

    const xAxis = axisBottom(xScale)
      .ticks(14)
      .tickFormat(index => index + 1)

    svg.select(".x-axis").style("transform", "translateY(400px)").call(xAxis)

    const yAxis = axisRight(yScale)
    svg.select(".y-axis").call(yAxis)

    const selectedCountryLine = line()
      .x(climateData => xScale(climateData.year))
      .y(climateData => yScale(climateData.value))
      .curve(curveCardinal)

    svg
      .selectAll(".line")
      .data([props.climateData])
      .join("path")
      .attr("class", "line")
      .attr("d", climateData => selectedCountryLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "blue")
  }, [props])

  return (
    <React.Fragment>
      <svg className="temperature-graph" ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </React.Fragment>
  )
}

export default TemperatureLineGraph
