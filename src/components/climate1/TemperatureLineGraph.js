import React, { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
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
  const { t } = useTranslation()
  const svgRef = useRef()

  function createLineGraph() {
    const svg = select(svgRef.current) //wrapper, so that the svg is available for d3.
    const width = 1000

    //Set the ranges
    const xScale = scaleLinear()
      .domain(extent(props.climateData, d => d.year)) //1961 - 2019: 58 Jahre
      .range([0, width]) //visual representation of domain

    const xScaleGlobal = scaleLinear()
      .domain(extent(props.globalData, d => d.year)) //1961 - 2019: 58 Jahre
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
      .x(climateData => xScale(climateData.year))
      .y(climateData => yScale(climateData.value))
      .curve(curveCardinal)

    //define global line
    const globalLine = line()
      .x(climateData => xScaleGlobal(climateData.year))
      .y(climateData => yScale(climateData.median))
      .curve(curveCardinal)

    //Create Country line
    svg
      .selectAll(".line")
      .data([props.climateData])
      .join("path")
      .attr("class", "line")
      .attr("d", climateData => selectedCountryLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "blue")

    //Create Global line
    svg
      .selectAll(".global-line")
      .data([props.globalData])
      .join("path")
      .attr("class", "global-line")
      .attr("d", climateData => globalLine(climateData))
      .attr("fill", "none")
      .attr("stroke", "green")

    //Remove old country line tag
    svg.select(".countryName").remove()

    //Create Line-naming for country line
    svg
      .append("text")
      .attr("class", "countryName")
      .attr(
        "transform",
        "translate(" +
          (width + 10) +
          "," +
          yScale(props.climateData[props.climateData.length - 1].value) +
          ")"
      )
      .attr("dy", ".35em")
      .attr("text-anchor", "start")
      .style("fill", "blue")
      .text(eval(t("Climate1_TooltipTemperature.4")))

    //Create Line-naming for global line
    svg
      .append("text")

      .attr(
        "transform",
        "translate(" +
          (width + 10) +
          "," +
          yScale(props.globalData[props.globalData.length - 1].median) +
          ")"
      )

      .attr("dy", ".35em")
      .attr("text-anchor", "hallo")
      .style("fill", "green")
      .text(t("Climate1_TooltipTemperature.5"))
  }

  useEffect(() => {
    createLineGraph()
  }, [props]) //Render as soon props has changed

  return (
    <React.Fragment>
      <h1>{eval(t("Climate1_TooltipTemperature.4"))}</h1>
      <svg className="temperature-graph" ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </React.Fragment>
  )
}

export default TemperatureLineGraph
