import React, { useState, useEffect, useRef } from "react"
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  scaleLinear,
  axisRight,
  extent,
  csv,
} from "d3"
import globalDataPath from "../../assets/data_climate1/climate_change_global_median_cleaned.csv"

const TemperatureLineGraph = props => {
  const [data, setData] = useState(props)
  const [globalData, setGlobalData] = useState([])
  const svgRef = useRef()

  //Fetch global climate data
  useEffect(() => {
    csv(globalDataPath).then(function (d) {
      setGlobalData(d)
    })
  }, []) //Render only once

  useEffect(() => {
    setData(props)

    const svg = select(svgRef.current) //wrapper, so that the svg is available for d3.

    //Set the ranges
    const xScale = scaleLinear()
      .domain(extent(data.climateData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, 1500]) //visual representation of domain

    const xScaleGlobal = scaleLinear()
      .domain(extent(globalData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, 1500]) //visual representation of domain

    const yScale = scaleLinear().domain([-1.5, 3]).range([400, 0])

    //Axis
    const xAxis = axisBottom(xScale)
      .ticks(14)
      .tickFormat(index => index + 1)

    const yAxis = axisRight(yScale)

    svg.select(".x-axis").style("transform", "translateY(400px)").call(xAxis)
    svg.select(".y-axis").call(yAxis)

    //define country line
    const selectedCountryLine = line()
      .x(climateData => xScaleGlobal(climateData.year))
      .y(climateData => yScale(climateData.value))
      .curve(curveCardinal)

    //define global line
    const globalLine = line()
      .x(climateData => xScale(climateData.year))
      .y(climateData => yScale(climateData.median))
      .curve(curveCardinal)

    console.log(globalData)

    //Create lines
    svg
      .selectAll(".line")
      .data([data.climateData])
      .join("path")
      .attr("class", "line")
      .attr("d", climateData => selectedCountryLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "blue")
    svg
      .append("path")
      .data([globalData])
      .attr("class", "line")
      .attr("d", climateData => globalLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "green")
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
