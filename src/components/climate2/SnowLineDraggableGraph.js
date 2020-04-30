import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  select,
  scaleLinear,
  drag,
  event,
  easeQuad,
  easeCubic,
  easeLinear,
} from "d3"

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

    if (props.showAnswer) {
      //render answer-line and text
      svg
        .append("line")
        .attr("class", "snowline-update")
        .attr("y1", d => yScale(props.data[1].snowline))
        .attr("y2", d => yScale(props.data[1].snowline))
        .attr("x1", 0)
        .attr("x2", 0)
        .transition()
        .delay(800)
        .duration(3000)
        .ease(easeCubic)
        .attr("x2", width)

      svg
        .append("text")
        .attr("x", width + 20)
        .attr("y", yScale(props.data[1].snowline - 35))
        .text(props.data[1].snowline + " m.ü.M")
        .style("fill", "white")
        .style("opacity", 0)
        .transition()
        .delay(3400)
        .duration(300)
        .ease(easeLinear)
        .style("opacity", 1)

      svg
        .append("text")
        .style("fill", "black")
        .style("font-size", "12px")
        .attr("x", 2)
        .attr("y", yScale(props.data[1].snowline - 90))
        .text("Lösung 2018")
        .style("opacity", 0)
        .transition()
        .delay(3400)
        .duration(300)
        .ease(easeLinear)
        .style("opacity", 1)

      //render draggable line STATIC
      svg.select(".draggable-line").remove()
      svg
        .append("line")
        .attr("class", "draggable-line-static")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(draggableLinePosition))
        .attr("y2", yScale(draggableLinePosition))
    }

    if (!props.showAnswer) {
      //add static line and text for 1960
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
        .style("font-size", "10px")
        .attr("x", width + 20)
        .attr("y", yScale(props.data[0].snowline - 35))
        .text("Schneefallgrenze bei " + props.data[0].snowline + " m.ü.M")

      svg
        .append("text")
        .style("fill", "black")
        .style("font-size", "12px")
        .attr("x", 2)
        .attr("y", yScale(props.data[0].snowline - 90))
        .text(1960)

      //render draggable line
      svg
        .append("line")
        .attr("class", "draggable-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(draggableLinePosition))
        .attr("y2", yScale(draggableLinePosition))
        .call(
          drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
      animationLine()

      var textDraggableLineMeter = svg
        .append("text")
        .style("fill", "white")
        .attr("x", width + 20)
        .attr("y", yScale(draggableLinePosition))
        .text(" ")

      var textDraggableLineYear = svg
        .append("text")
        .attr("class", "draggable-line-text")
        .style("fill", "black")
        .style("font-size", "12px")
        .attr("x", 2)
        .attr("y", yScale(draggableLinePosition - 100))
        .text(2018)
      animationLineText()

      function dragstarted() {
        if (!props.showAnswer) {
          select(this).classed("active-d3-item", true)
          svg.select(".draggable-line").interrupt()
          svg.select(".draggable-line-text").interrupt()
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
          textDraggableLineMeter
            .attr("y", newYPosition)
            .text(yScale.invert(newYPosition).toFixed(0) + " m.ü.M")

          textDraggableLineYear.attr("y", newYPosition).text("2018")
        }
      }

      function dragended() {
        if (!props.showAnswer) {
          select(this).classed("active-d3-item", false)
        }
      }
    }

    function animationLineText() {
      svg
        .select(".draggable-line-text")
        .transition()
        .delay(3000)
        .duration(600)
        .ease(easeQuad)
        .attr("y", yScale(draggableLinePosition - 100 + 60))
        .transition()
        .attr("y", yScale(draggableLinePosition - 100))
        .transition()
        .attr("y", yScale(draggableLinePosition - 100 + 60))
        .transition()
        .attr("y", yScale(draggableLinePosition - 100))
        .on("end", animationLineText)
    }

    function animationLine() {
      svg
        .select(".draggable-line")
        .transition()
        .delay(3000)
        .duration(600)
        .ease(easeQuad)
        .attr("y1", d => yScale(draggableLinePosition + 60))
        .attr("y2", d => yScale(draggableLinePosition + 60))
        .transition()
        .attr("y1", d => yScale(draggableLinePosition))
        .attr("y2", d => yScale(draggableLinePosition))
        .transition()
        .attr("y1", d => yScale(draggableLinePosition + 60))
        .attr("y2", d => yScale(draggableLinePosition + 60))
        .transition()
        .attr("y1", d => yScale(draggableLinePosition))
        .attr("y2", d => yScale(draggableLinePosition))
        .on("end", animationLine)
    }
  }

  /**
   * React Lifecycle
   */
  useEffect(() => {
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
