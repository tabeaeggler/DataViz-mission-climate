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

/**
 * Creates a linegraph with two lines: country specific & global climate change
 * @param {array} props.selectedCountry geojson data for selected country
 * @param {array} props.climateData country specifiy climate data from 1961 - 2019
 * @param {array} props.globalData global climata data from 1961 - 2019
 */
const TemperatureLineGraph = props => {
  const { t } = useTranslation()
  const svgRef = useRef()
  const svgLinesRef = useRef()

  /**
   * Creates a gridlines in x axis function
   * @param {function} xScale
   * @returns {function} grid function
   */
  function make_x_gridlines(xScale) {
    return axisBottom(xScale).ticks(10)
  }

  /**
   * Creates a gridlines in y axis function
   * @param {function} yScale
   * @returns {function} grid function
   */
  function make_y_gridlines(yScale) {
    return axisLeft(yScale).ticks(10)
  }

  /**
   * Calculates best position for naming tags beside line
   * @param {string} tag differs the line. Is either global or country
   * @returns {number} position for naming tag
   */
  function getTagPosition(tag) {
    console.log(typeof tag)
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

  /**
   * Main code for linegraph
   */
  function createLineGraph() {
    const width = 1000
    const height = 350
    const margin = 40
    //wrapper, so that the svg is available for d3
    const svg = select(svgRef.current).attr(
      "transform",
      `translate(${margin},${margin})`
    )
    //create seperate svg for lines to ensure that the lines are above the grid -> render after other svg
    const svgLines = select(svgLinesRef.current).attr(
      "transform",
      `translate(${margin},${margin})`
    )

    //set the X and Y ranges
    const xScale = scaleLinear()
      .domain(extent(props.climateData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, width]) //visual representation of domain
      .nice()

    const yScale = scaleLinear().domain([-1.5, 3]).range([height, 0])

    //create X and Y axis
    const xAxis = axisBottom(xScale).tickFormat(index => index)
    const yAxis = axisLeft(yScale)

    //define country and global line
    const selectedCountryLine = line()
      .defined(function (climateData) {
        return climateData.value !== ""
      })
      .x(climateData => xScale(climateData.year))
      .y(climateData => yScale(climateData.value))
      .curve(curveCardinal)

    const globalLine = line()
      .x(climateData => xScale(climateData.year))
      .y(climateData => yScale(climateData.value))
      .curve(curveCardinal)

    //add X and Y gridlines
    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines(xScale).tickSize(-height).tickFormat(""))

    svg
      .append("g")
      .attr("class", "grid")
      .call(make_y_gridlines(yScale).tickSize(-width).tickFormat(""))

    //add X and Y axis
    svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis)
    svg.append("g").call(yAxis)

    //remove old line tag
    svg.select(".countryName").remove()
    svg.select(".globalName").remove()

    //add naming tags for country and global line
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

    //add lines
    svgLines
      .selectAll(".line")
      .data([props.climateData])
      .join("path")
      .attr("class", "line")
      .attr("d", climateData => selectedCountryLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "#D37B61")

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

  /**
   * React Lifecycle -> Renders as soon as props has changed
   */
  useEffect(() => {
    createLineGraph()
  }, [props])

  return (
    <React.Fragment>
      <h2>{eval(t("Climate1_TooltipTemperature.4"))}</h2>
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
