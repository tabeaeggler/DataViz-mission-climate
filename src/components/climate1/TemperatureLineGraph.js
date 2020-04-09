import React, { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
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
    const width = 1000

    //Set the ranges
    const xScale = scaleLinear()
      .domain(extent(data.climateData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, width]) //visual representation of domain

    const xScaleGlobal = scaleLinear()
      .domain(extent(globalData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, width]) //visual representation of domain

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

    console.log(data.climateData[58].value)

    //Create line
    svg
      .selectAll(".line")
      .data([data.climateData])
      .join("path")
      .attr("class", "line")
      .attr("d", climateData => selectedCountryLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "blue")

    //Create Legend
    svg
      .append("text")
      .attr(
        "transform",
        "translate(" +
          (width + 25) +
          "," +
          yScale(data.climateData[58].value) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "blue")
      .text(eval(t("TooltipTemperature.4")))

    /*  
    //Create Global line
    svg
      .append("path")
      .data([globalData])
      .attr("class", "line")
      .attr("d", climateData => globalLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "green")
      */
  }, [props])

  return (
    <React.Fragment>
      <h1>{eval(t("TooltipTemperature.4"))}</h1>
      <svg className="temperature-graph" ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </React.Fragment>
  )
}

export default TemperatureLineGraph
