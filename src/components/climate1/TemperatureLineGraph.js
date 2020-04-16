import React, { useEffect, useRef } from "react"
import "./climate1.css"
import { useTranslation } from "react-i18next"
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  scaleLinear,
  axisLeft,
  extent,
} from "d3"

const TemperatureLineGraph = props => {
  const { t } = useTranslation()
  const svgRef = useRef()
  const svgLinesRef = useRef()

  // gridlines in x axis function
  function make_x_gridlines(xScale) {
    return axisBottom(xScale).ticks(10)
  }

  // gridlines in y axis function
  function make_y_gridlines(yScale) {
    return axisLeft(yScale).ticks(10)
  }

  function getTagPosition(tag) {
    var countryTagPos = props.climateData[props.climateData.length - 1].value
    var globalTagPos = props.globalData[props.globalData.length - 1].value

    if (Math.abs(globalTagPos - countryTagPos) < 0.16) {
      if (globalTagPos > countryTagPos) {
        if (tag === "global") return parseFloat(globalTagPos) + 0.1
        if (tag === "country") return parseFloat(countryTagPos) - 0.1
      }
      if (globalTagPos < countryTagPos) {
        if (tag === "global") return parseFloat(globalTagPos) - 0.1
        if (tag === "country") return parseFloat(countryTagPos) + 0.1
      }
    } else {
      if (tag === "global") return globalTagPos
      if (tag === "country") return countryTagPos
    }
  }

  function createLineGraph() {
    const width = 1000
    const height = 350
    const margin = 40
    const svg = select(svgRef.current).attr(
      "transform",
      `translate(${margin},${margin})`
    ) //wrapper, so that the svg is available for d3.

    const svgLines = select(svgLinesRef.current).attr(
      "transform",
      `translate(${margin},${margin})`
    )

    //Set the ranges
    const xScale = scaleLinear()
      .domain(extent(props.climateData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, width]) //visual representation of domain
      .nice()

    const xScaleGlobal = scaleLinear()
      .domain(extent(props.globalData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, width]) //visual representation of domain
      .nice()

    const yScale = scaleLinear().domain([-1.5, 3]).range([height, 0])

    //create and axis
    const xAxis = axisBottom(xScale).tickFormat(index => index)
    const yAxis = axisLeft(yScale)

    //define country line
    const selectedCountryLine = line()
      .defined(function (climateData) {
        return climateData.value !== ""
      })
      .x(climateData => xScale(climateData.year))
      .y(climateData => yScale(climateData.value))
      .curve(curveCardinal)

    //define global line
    const globalLine = line()
      .x(climateData => xScaleGlobal(climateData.year))
      .y(climateData => yScale(climateData.value))
      .curve(curveCardinal)

    // add the X gridlines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines(xScale).tickSize(-height).tickFormat(""))

    // add the Y gridlines
    svg
      .append("g")
      .attr("class", "grid")
      .call(make_y_gridlines(yScale).tickSize(-width).tickFormat(""))

    // add axis
    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis)
    svg.append("g").call(yAxis)

    //remove old line tag
    svg.select(".countryName").remove()
    svg.select(".globalName").remove()

    //create line-naming for country line
    svg
      .append("text")
      .attr("class", "countryName")
      .attr(
        "transform",
        "translate(" +
          (width - 15) +
          "," +
          yScale(getTagPosition("country")) +
          ")"
      )
      .attr("dy", ".35em")
      .style("fill", "#D37B61")
      .text(eval(t("Climate1_TooltipTemperature.4")))

    //create line-naming for global line
    svg
      .append("text")
      .attr("class", "globalName")
      .attr(
        "transform",
        "translate(" +
          (width - 15) +
          "," +
          yScale(getTagPosition("global")) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("opacity", "0.2")
      .style("fill", "white")
      .text(t("Climate1_TooltipTemperature.5"))

    //create country line
    svgLines
      .selectAll(".line")
      .data([props.climateData])
      .join("path")
      .attr("class", "line")
      .attr("d", climateData => selectedCountryLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "#D37B61")

    //create global line
    svgLines
      .selectAll(".global-line")
      .data([props.globalData])
      .join("path")
      .attr("class", "global-line")
      .attr("d", climateData => globalLine(climateData))
      .attr("fill", "none")
      .attr("opacity", "0.2")
      .attr("stroke", "white")
  }

  useEffect(() => {
    createLineGraph()
  }, [props]) //Render as soon props has changed

  return (
    <React.Fragment>
      <h1>{eval(t("Climate1_TooltipTemperature.4"))}</h1>
      <div className="temperature-graph-container">
        <svg className="temperature-graph">
          <g ref={svgRef}></g>
          <g ref={svgLinesRef}></g>
        </svg>
      </div>
    </React.Fragment>
  )
}

export default TemperatureLineGraph
