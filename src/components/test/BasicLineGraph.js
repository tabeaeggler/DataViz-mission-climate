//useRef hook: creates a variable in a function to hold an object across multiple rendering passes.
//useEffect hook: Used when DOM-elements have been rendered -> Similar to componentDidMount
import React, { useRef, useEffect, useState } from "react"
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  scaleLinear,
  axisRight
} from "d3"
import "./basicLineGraph.css"

function BasicLineGraph() {
  const [data, setData] = useState([20, 30, 60, 25, 10, 18, 20, 20, 90, 10])
  
  const svgRef = useRef()

  useEffect(() => {
    const svg = select(svgRef.current) //wrapper, so that the svg is available for d3.

    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, 300]) //visual representation of domain

    const yScale = scaleLinear()
      .domain([0, 90]) //max element of data array
      .range([150, 0])

    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat(index => index + 1)
    svg
      .select(".x-axis")
      .style("transform", "translateY(150px)")
      .call(xAxis)

    const yAxis = axisRight(yScale)
    svg
      .select(".y-axis")
      .style("transform", "translateX(300px)")
      .call(yAxis)

    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal)

    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", value => myLine(value))
      .attr("fill", "none")
      .attr("stroke", "blue")
  }, [data]) //[]: if array empty: ensure that it only runs once.

  return (
    <React.Fragment>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
      <br />
      <br />
      <button onClick={() => setData(data.map(value => value + 5))}>
        Update data
      </button>
    </React.Fragment>
  )
}

export default BasicLineGraph

/** Part 1: Render some dots
    svg
      .selectAll("circle")
      .data(data)
      .join(
        enter => enter.append("circle").attr("class", "newCircles"), ////What to dou with a new piece of data
        update => update.attr("class", "updated"),
        exit => exit.remove()
      )
      .attr("stroke", "red"); //valid for enter,update & exit! -> No repeating!
     */
