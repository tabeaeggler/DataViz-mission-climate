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
  //transaltion
  const { t } = useTranslation()

  //svg sizing
  const svgRef = useRef()
  const width = 700
  const height = 550
  const margin = 98
  const mountainHeight = 2200
  const marginTextYear = 60

  //state
  const [draggableLinePosition, setDraggableLinePosition] = useState(1000)
  const [showSubmitButton, setShowSubmitButton] = useState(false)

  /**
   * Main code for SnowLineDraggable
   */
  function createSnowLine() {
    const svg = select(svgRef.current)
      .attr("transform", `translate(${margin},0)`)
      .attr("class", "group")

    const yScale = scaleLinear().domain([mountainHeight, 0]).range([0, height])

    if (props.showAnswer) {
      //create distance rectangle
      svg
        .append("rect")
        .attr("class", "rect-difference")
        .attr("x", -2)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr(
          "y",
          draggableLinePosition > props.data[1].snowline
            ? yScale(draggableLinePosition - 10)
            : yScale(props.data[1].snowline - 10)
        )
        .attr("width", width + 2)
        .attr(
          "height",
          Math.abs(
            yScale(draggableLinePosition) - yScale(props.data[1].snowline - 10)
          )
        )
        .style("opacity", "0")
        .transition()
        .delay(3500)
        .duration(1000)
        .ease(easeLinear)
        .style("opacity", "0.3")

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
        .duration(2500)
        .ease(easeCubic)
        .attr("x2", width)

      svg
        .append("text")
        .attr("x", width + 5)
        .attr("y", yScale(props.data[1].snowline - 35))
        .style("font-size", "10px")
        .text("Nullgradgrenze bei " + props.data[1].snowline + " m.ü.M")
        .style("fill", "white")
        .style("opacity", 0)
        .transition()
        .delay(2700)
        .duration(300)
        .ease(easeLinear)
        .style("opacity", 1)

      svg
        .append("text")
        .style("fill", "white")
        .style("font-size", "12px")
        .attr("x", 0)
        .attr("y", yScale(props.data[1].snowline - marginTextYear))
        .text("2018")
        .style("opacity", 0)
        .transition()
        .delay(2700)
        .duration(300)
        .ease(easeLinear)
        .style("opacity", 1)

      svg
        .append("text")
        .style("fill", "white")
        .style("font-size", "12px")
        .attr("x", -50)
        .attr("y", yScale(props.data[1].snowline))
        .text("Lösung")
        .style("opacity", 0)
        .transition()
        .delay(3400)
        .duration(300)
        .ease(easeLinear)
        .style("opacity", 1)

      //render draggable line STATIC
      svg.select(".draggable-line-text").interrupt()
      svg.select(".draggable-line").remove()
      svg
        .append("line")
        .attr("class", "draggable-line-static")
        .attr("x1", 2)
        .attr("x2", width)
        .attr("y1", yScale(draggableLinePosition))
        .attr("y2", yScale(draggableLinePosition))

      svg
        .append("text")
        .style("fill", "white")
        .style("font-size", "12px")
        .attr("x", -100)
        .attr("y", yScale(draggableLinePosition))
        .text("Deine Schätzung")
        .style("opacity", 0)
        .transition()
        .delay(300)
        .duration(300)
        .ease(easeLinear)
        .style("opacity", 1)
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
        .attr("x", width + 5)
        .attr("y", yScale(props.data[0].snowline - 35))
        .text("Nullgradgrenze bei " + props.data[0].snowline + " m.ü.M")

      svg
        .append("text")
        .style("fill", "white")
        .style("font-size", "12px")
        .attr("x", 2)
        .attr("y", yScale(props.data[0].snowline - marginTextYear))
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
        .attr("x", width + 5)
        .attr("y", yScale(draggableLinePosition))
        .text(" ")

      var textDraggableLineYear = svg
        .append("text")
        .attr("class", "draggable-line-text")
        .style("fill", "white")
        .style("font-size", "12px")
        .attr("x", 2)
        .attr("y", yScale(draggableLinePosition - marginTextYear))
        .text(2018)
      animationLineText()

      function dragstarted() {
        if (!props.showAnswer) {
          setShowSubmitButton(true)
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
            .style("font-size", "10px")
            .text(
              "Nullgradgrenze bei " +
                yScale.invert(newYPosition).toFixed(0) +
                " m.ü.M"
            )

          textDraggableLineYear
            .attr("y", newYPosition + marginTextYear / 4)
            .text("2018")
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
        .attr("y", yScale(draggableLinePosition - marginTextYear + 60))
        .transition()
        .attr("y", yScale(draggableLinePosition - marginTextYear))
        .transition()
        .attr("y", yScale(draggableLinePosition - marginTextYear + 60))
        .transition()
        .attr("y", yScale(draggableLinePosition - marginTextYear))
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
  }, [props.showAnswer])

  /**
   * Handle submission of result
   */
  function showResult() {
    props.showQuizzResult()
    setShowSubmitButton(false)
  }

  return (
    <React.Fragment>
      <div className="snowline-container">
        <svg className="snowline-graph" width={width+2*margin}>
          <g ref={svgRef}></g>
        </svg>
        {showSubmitButton ? (
          <button
            className="submit-button"
            style={{ bottom: (draggableLinePosition * height) / mountainHeight }}
            onClick={() => showResult()}>
            {t("Climate2_Submit_Button")}
          </button>
        ) : null}
      </div>
    </React.Fragment>
  )
}

export default SnowLineDraggableGraph
