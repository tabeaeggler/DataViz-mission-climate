import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { select, scaleLinear, drag, event } from "d3"

const SnowLineDraggableGraph = props => {
  const { t } = useTranslation()
  const svgRef = useRef()
  const [draggableLinePosition, setDraggableLinePosition] = useState(1000)

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

    const yScale = scaleLinear().domain([mountainHeight, 0]).range([0, height])

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

    //render answer-line and text
    if (props.showAnswer) {
      svg
        .append("line")
        .attr("class", "snowline-update")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => yScale(props.data[1].snowline))
        .attr("y2", d => yScale(props.data[1].snowline))
      
        svg
        .append("text")
        .style("fill", "white")
        .attr("x", width + 20)
        .attr("y", yScale(props.data[1].snowline - 35))
        .text(props.data[1].snowline + " m.ü.M")
    }

    //add static line and text for 1960
    if(!props.showAnswer){
    svg
      .append("line")
      .attr("class", "snowline-enter")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => yScale(props.data[0].snowline))
      .attr("y2", d => yScale(props.data[0].snowline))
    
     svg
      .append("text")
      .style("fill", "white")
      .attr("x", width + 20)
      .attr("y", yScale(props.data[0].snowline - 35))
       .text(props.data[0].snowline + " m.ü.M")
      }

    //draggable line
    svg
      .append("line")
      .attr("class", "draggable-line")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(draggableLinePosition))
      .attr("y2", yScale(draggableLinePosition))
      .call(
        drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
    )

    var text = svg
    .append("text")
    .style("fill", "white")
    .attr("x", width + 20)
    .attr("y", yScale(draggableLinePosition))
    .text(draggableLinePosition+ " m.ü.M")

    function dragstarted() {
      if (!props.showAnswer) {
        select(this).classed("active-d3-item", true)
      }
    }

    function dragged() {
      if (!props.showAnswer) {
        var y = event.dy
        var currentLine = select(this)
        var newYPosition = parseInt(currentLine.attr("y1")) + y

        //Check boundaries of drag area
        if (newYPosition > height) newYPosition = height
        else if (newYPosition < 0) newYPosition = 0

        setDraggableLinePosition(yScale.invert(newYPosition).toFixed(0))

        //Update the line properties
        currentLine.attr("y1", newYPosition).attr("y2", newYPosition)

        //Update text
        text
          .attr("y", newYPosition)
          .text(yScale.invert(newYPosition).toFixed(0) + " m.ü.M")
      }
    }

    function dragended() {
      if (!props.showAnswer) {
        select(this).classed("active-d3-item", false)
      }
    }
  }

  /**
   * React Lifecycle
   */
  useEffect(() => {
    console.log(props)
    createSnowLine()
  }, [props])

  return (
    <React.Fragment>
      <div className="snowline-container">
        <svg className="snowline-graph" width={500}>
          <g ref={svgRef}></g>
        </svg>
      </div>
    </React.Fragment>
  )
}

export default SnowLineDraggableGraph
