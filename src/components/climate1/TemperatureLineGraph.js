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
  interpolateRdYlBu,
  scaleSequential
} from "d3"
import { legendColor } from "d3-svg-legend"


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
  const svgRefLegend = useRef()


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
    var globalTagPos = props.globalData[props.globalData.length - 1].value
    if (props.selectedCountry === undefined || props.climateData.length === 0)
      return globalTagPos

    var countryTagPos = props.climateData[props.climateData.length - 1].value
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
    const width = (window.innerWidth / 2) * 0.8
    const height = 250
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
      .domain(extent(props.globalData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, width]) //visual representation of domain
      .nice()

    const yScale = scaleLinear().domain([-2, 3]).range([height, 0])

    //create X and Y axis
    const xAxis = axisBottom(xScale).tickFormat(index => index)
    const yAxis = axisLeft(yScale).tickFormat(
      index => index.toFixed(1) + " " + "\u2103"
    )

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
    svg.select(".country-name").remove()
    svg.select(".global-name").remove()
    svg.select(".linegraph-description").remove()

    //define global line
    const globalLine = line()
      .x(climateData => xScale(climateData.year))
      .y(climateData => yScale(climateData.value))
      .curve(curveCardinal)

    //add global line
    svgLines
      .selectAll(".global-line")
      .data([props.globalData])
      .join("path")
      .attr("class", "global-line")
      .attr("d", climateData => globalLine(climateData))
      .attr("fill", "none")
      .attr("opacity", "0.4")
      .attr("stroke", "white")

    //add name tag for global line
    svg
      .append("text")
      .attr("class", "global-name")
      .attr(
        "transform",
        "translate(" +
          (width - 10) +
          "," +
          yScale(getTagPosition("global")) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("opacity", "0.4")
      .style("fill", "white")
      .text(t("Climate1_TooltipTemperature.5"))

    //add description text for graph
    svg
      .append("svg:text")
      .append("svg:tspan")
      .attr("class", "linegraph-description")
      .style("fill", "#bbb9b9")
      .attr("y", "15px")
      .attr("x", "20px")
      .text(t("Climate1_TooltipTemperature.6"))
      .append("svg:tspan")
      .attr("y", "40px")
      .attr("x", "22px")
      .text(t("Climate1_TooltipTemperature.7"))

    //only render country line when country is selcted
    if (props.selectedCountry !== undefined || props.climateData.length > 0) {
      //define country line
      const selectedCountryLine = line()
        .defined(function (climateData) {
          return climateData.value !== ""
        })
        .x(climateData => xScale(climateData.year))
        .y(climateData => yScale(climateData.value))
        .curve(curveCardinal)

      //add country line
      svgLines
        .selectAll(".line")
        .data([props.climateData])
        .join("path")
        .attr("class", "line")
        .attr("d", climateData => selectedCountryLine(climateData))
        .attr("fill", "none")
        .attr("stroke", "#D37B61")

      //add name tag for country line
      svg
        .append("text")
        .attr("class", "country-name")
        .attr(
          "transform",
          "translate(" +
            (width - 10) +
            "," +
            yScale(getTagPosition("country")) +
            ")"
        )
        .attr("dy", ".35em")
        .style("fill", "#D37B61")
        .text(eval(t("Climate1_TooltipTemperature.4")))
    }
  }

  /**
   * Creates color-scale legend for globe
   */
  function createLegend() {
    const colorScaleLegend = scaleSequential(interpolateRdYlBu).domain([3, -3])
    const svg = select(svgRefLegend.current)//.attr("transform", "translate(0,20)")
    var legend = legendColor()
      .scale(colorScaleLegend)
      .cells(8)
      .orient("vertical")
      .shapeWidth(5)
      .shapePadding(-2)
      .shapeHeight(33)
    svg.call(legend)
  }

  /**
   * React Lifecycle -> Renders as soon as props has changed
   */
  useEffect(() => {
    createLineGraph()
    createLegend()
  }, [props])

  return (
    <React.Fragment>
      {/* <h2>{eval(t("Climate1_TooltipTemperature.4"))}</h2> */}
      <div className="temperature-graph-container">
        <svg
          className="temperature-graph"
          width={(window.innerWidth / 2)*0.93}>
          <g ref={svgRef}></g>
          <g ref={svgLinesRef}></g>
        </svg>
        <svg className="legend-world">
          <g ref={svgRefLegend}></g>
        </svg>
      </div>
    </React.Fragment>
  )
}

export default TemperatureLineGraph
