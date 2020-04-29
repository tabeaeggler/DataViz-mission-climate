import React, { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { select, scaleLinear, drag, event } from "d3"

function SnowLineDraggable() {
  const { t } = useTranslation()
  const svgRef = useRef()

  /**
   * Main code for SnowLineDraggable
   */
  function createSnowLine() {
    const width = 300
    const height = 300
    const margin = 50
    const mountainHeight = 2200

    const svg = select(svgRef.current).attr(
      "transform",
      `translate(${margin},${margin})`
    )

    const yScale = scaleLinear().domain([0, mountainHeight]).range([0, height])

    //add mountain
    svg
      .selectAll("rect")
      .data([null])
      .join(enter =>
        enter
          .append("rect")
          .attr("width", width)
          .attr("height", height)
          .attr("fill", "white")
      )

    var data = [
      { year: 1960, snowline: 900 },
      { year: 2018, snowline: 1250 },
    ]

    //add static line
    svg
      .append("line")
      .attr("stroke", "green")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(mountainHeight - data[0].snowline))
      .attr("y2", yScale(mountainHeight - data[0].snowline))

    svg
      .append("line")
      .attr("stroke", "red")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(mountainHeight - data[1].snowline))
      .attr("y2", yScale(mountainHeight - data[1].snowline))

    //draggable line

    svg
      .append("line")
      .attr("stroke", "blue")
      .attr("stroke-width", "10")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(mountainHeight - data[0].snowline - 100))
      .attr("y2", yScale(mountainHeight - data[0].snowline - 100))
      .call(
        drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
      )

    function dragstarted() {
      select(this).classed("active-d3-item", true)
    }

    function dragged() {
      var y = event.dy

      var currentLine = select(this)

      // Update the line properties
      currentLine
        .attr("y1", parseInt(currentLine.attr("y1")) + y)
        .attr("y2", parseInt(currentLine.attr("y2")) + y)
    }

    function dragended() {
      select(this).classed("active-d3-item", false)
    }
  }

  /**
   * React Lifecycle
   */
  useEffect(() => {
    createSnowLine()
  }, [])

  return (
    <React.Fragment>
      <svg
        className="snowLine-container"
        width={(window.innerWidth / 2) * 0.93}>
        <g ref={svgRef}></g>
      </svg>
    </React.Fragment>
  )
}

export default SnowLineDraggable
