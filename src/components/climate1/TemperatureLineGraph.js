import React, { useEffect, useRef } from "react"
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

  function getTagPosition(tag) {
    var countryTagPos = props.climateData[props.climateData.length - 1].value
    var globalTagPos = props.globalData[props.globalData.length - 1].value

    console.log("countryTagPos", countryTagPos)

    if (Math.abs(globalTagPos - countryTagPos) < 0.1) {
      if (globalTagPos > countryTagPos) {
        if (tag === "global") return parseFloat(globalTagPos) + 0.07
        if (tag === "country") return parseFloat(countryTagPos) - 0.07
      }
      if (globalTagPos < countryTagPos) {
        if (tag === "global") return parseFloat(globalTagPos) - 0.07
        if (tag === "country") return parseFloat(countryTagPos) + 0.07
      }
    } else {
      if (tag === "global") return globalTagPos
      if (tag === "country") return countryTagPos
    }
  }

  function createLineGraph() {
    const width = 1350
    const height = 350
    const margin = 40
    const svg = select(svgRef.current).attr(
      "transform",
      `translate(${margin},${margin})`
    ) //wrapper, so that the svg is available for d3.

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

    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis)
    svg.append("g").call(yAxis)

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

    //create country line
    svg
      .selectAll(".line")
      .data([props.climateData])
      .join("path")
      .attr("class", "line")
      .attr("d", climateData => selectedCountryLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "blue")

    //create global line
    svg
      .selectAll(".global-line")
      .data([props.globalData])
      .join("path")
      .attr("class", "global-line")
      .attr("d", climateData => globalLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "green")

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
          (width - 20) +
          "," +
          yScale(getTagPosition("country")) +
          ")"
      )
      .attr("dy", ".35em")
      .style("fill", "blue")
      .text(eval(t("Climate1_TooltipTemperature.4")))

    //create line-naming for global line
    svg
      .append("text")
      .attr("class", "globalName")
      .attr(
        "transform",
        "translate(" +
          (width - 20) +
          "," +
          yScale(getTagPosition("global")) +
          ")"
      )
      .attr("dy", ".35em")
      .style("fill", "green")
      .text(t("Climate1_TooltipTemperature.5"))
  }

  useEffect(() => {
    console.log(props.selectedCountry)
    console.log(props.climateData)
    createLineGraph()
  }, [props]) //Render as soon props has changed

  return (
    <React.Fragment>
      <h1>{eval(t("Climate1_TooltipTemperature.4"))}</h1>
      <div className="temperature-graph-container">
        <svg className="temperature-graph">
          <g ref={svgRef}></g>
        </svg>
      </div>
    </React.Fragment>
  )
}

export default TemperatureLineGraph
