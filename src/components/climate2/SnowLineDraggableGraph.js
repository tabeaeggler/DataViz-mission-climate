import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { select, scaleLinear, drag, event, easeQuad, easeCubic, easeLinear } from "d3"

/**
 * creates a draggable snowline graph
 * @param {boolean} props.showAnswer indicates whether submission has occured
 * @param {array} props.data height of snowline of specific year
 * @param {function} props.showQuizzResult handles submit event
 * @param {boolean} props.showSnowlineInteraction indicates whether snowline iteraction elements are visible
 * @param {function} props.setHideIntroductionBubble manages visibility of introduction bubble
 */
const SnowLineDraggableGraph = props => {
  //transaltion
  const { t } = useTranslation()
  //svg sizing
  const svgRef = useRef()
  const width = 700
  const height = 556
  const marginLeft = 98
  const marginTop = 45
  const mountainHeight = 2128
  const marginTextY = 70
  const marginTextX = 50
  const offset = 75
  //state
  const [draggableLinePosition, setDraggableLinePosition] = useState(1000)
  const [showSubmitButton, setShowSubmitButton] = useState(false)

  /**
   * main code for snowlinegraph
   */
  function createSnowLine() {
    const svg = select(svgRef.current).attr("transform", `translate(${marginLeft},${marginTop})`)
    const yScale = scaleLinear().domain([mountainHeight, 0]).range([0, height])

    if (props.showAnswer) {
      //create rectangle, line and text to show difference between original and solution
      svg
        .append("rect")
        .attr("class", "difference-rect")
        .attr("x", -2)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("y", yScale(props.data[1].snowline))
        .attr("width", width + 2)
        .attr("height", Math.abs(yScale(props.data[0].snowline - 10) - yScale(props.data[1].snowline - 10)))
        .style("opacity", "0")
        .transition()
        .delay(3500)
        .duration(1000)
        .ease(easeLinear)
        .style("opacity", "0.3")

      svg
        .append("line")
        .attr("class", "difference-line")
        .attr("y1", yScale(props.data[0].snowline))
        .attr("y2", yScale(props.data[1].snowline))
        .attr("x1", width + 15)
        .attr("x2", width + 15)
        .style("opacity", 0)
        .transition()
        .delay(3500)
        .duration(1000)
        .ease(easeLinear)
        .style("opacity", 1)

      svg
        .append("text")
        .attr("class", "snowline-text difference-text")
        .attr("x", width + 20)
        .attr("y", yScale(props.data[1].snowline - 200))
        .text("350 m")
        .style("opacity", 0)
        .transition()
        .delay(3500)
        .duration(1000)
        .ease(easeLinear)
        .style("opacity", 1)

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
        .attr("class", "snowline-text")
        .attr("x", width - marginTextX)
        .attr(
          "y",
          props.data[1].snowline - draggableLinePosition < offset && props.data[1].snowline - draggableLinePosition > 0
            ? yScale(props.data[1].snowline + marginTextY / 2)
            : yScale(props.data[1].snowline - marginTextY)
        )
        .text(props.data[1].snowline + " m")
        .style("opacity", 0)
        .transition()
        .delay(2700)
        .duration(300)
        .ease(easeLinear)
        .style("opacity", 1)

      svg
        .append("text")
        .attr("class", "snowline-text")
        .attr("x", 8)
        .attr(
          "y",
          props.data[1].snowline - draggableLinePosition < offset && props.data[1].snowline - draggableLinePosition > 0
            ? yScale(props.data[1].snowline + marginTextY / 2)
            : yScale(props.data[1].snowline - marginTextY)
        )
        .text(t("Climate2_Graph.1"))
        .style("opacity", 0)
        .transition()
        .delay(2700)
        .duration(300)
        .ease(easeLinear)
        .style("opacity", 1)

      //render draggable line and text statically
      svg.select(".draggable-line-text-year").remove()
      svg.select(".draggable-line-text-meter").remove()
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
        .attr("class", "snowline-text draggable-text")
        .attr("x", width - marginTextX)
        .attr(
          "y",
          props.data[1].snowline - draggableLinePosition < 0 && props.data[1].snowline - draggableLinePosition > -offset
            ? yScale(draggableLinePosition) - 5
            : yScale(draggableLinePosition - marginTextY)
        )
        .text(draggableLinePosition + " m")

      svg
        .append("text")
        .attr("class", "snowline-text draggable-text")
        .attr("x", 8)
        .attr(
          "y",
          props.data[1].snowline - draggableLinePosition < 0 && props.data[1].snowline - draggableLinePosition > -offset
            ? yScale(draggableLinePosition) - 5
            : yScale(draggableLinePosition - marginTextY)
        )
        .text(t("Climate2_Graph.2"))
    }

    if (!props.showAnswer && props.showSnowlineInteraction) {
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
        .attr("class", "snowline-text")
        .attr("x", width - marginTextX)
        .attr("y", yScale(props.data[0].snowline - marginTextY))
        .text(props.data[0].snowline + " m")

      svg
        .append("text")
        .attr("class", "snowline-text")
        .attr("x", 8)
        .attr("y", yScale(props.data[0].snowline - marginTextY))
        .text("1960")

      //render draggable line and its extended drag area
      var draggableGroup = svg.append("g")

      draggableGroup
        .append("line")
        .attr("class", "draggable-area")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(draggableLinePosition))
        .attr("y2", yScale(draggableLinePosition))

      draggableGroup
        .append("line")
        .attr("class", "draggable-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(draggableLinePosition))
        .attr("y2", yScale(draggableLinePosition))

      draggableGroup.call(drag().on("start", dragstarted).on("drag", dragged).on("end", dragended))
      animationLine()

      var textDraggableLineMeter = svg
        .append("text")
        .attr("class", "draggable-line-text-meter snowline-text")
        .attr("x", width - marginTextX)
        .attr("y", yScale(draggableLinePosition - marginTextY))
        .text(" ")

      var textDraggableLineYear = svg
        .append("text")
        .attr("class", "draggable-line-text-year snowline-text")
        .attr("x", 8)
        .attr("y", yScale(draggableLinePosition - marginTextY))
        .text("2018")
      animationLineText(-marginTextY, ".draggable-line-text-year")

      svg
        .append("text")
        .attr("class", "draggable-line-text-question snowline-text")
        .attr("x", width / 2 - 100)
        .attr("y", yScale(draggableLinePosition + marginTextY))
        .text(t("Climate2_Graph.3"))
      animationLineText(marginTextY, ".draggable-line-text-question")

      /**
       * handle drag start event
       */
      function dragstarted() {
        if (!props.showAnswer) {
          setShowSubmitButton(false)
          props.setHideIntroductionBubble(true)

          svg.selectAll(".draggable-line, .draggable-line-text-year, .draggable-line-text-meter").classed("active-text", true)
          svg.selectAll(".draggable-line, .draggable-area, .draggable-line-text-year").interrupt()
          svg.select(".draggable-line-text-question").remove()
        }
      }

      /**
       * handle drag event
       */
      function dragged() {
        //select lines and dragabble area
        var currentLine = select(".draggable-line")
        var currentDragArea = select(".draggable-area")
        var linePos = parseFloat(currentLine.attr("y1"))

        if (!props.showAnswer && yScale.invert(linePos).toFixed(0) < 2110 && yScale.invert(linePos).toFixed(0) > 200) {
          //calculate position (difference)
          const zoomFactor = 1.6
          var deltaY = event.dy * zoomFactor

          //calculate new position
          var newYPosition = parseFloat(currentLine.attr("y1")) + deltaY
          setDraggableLinePosition(yScale.invert(newYPosition).toFixed(0))

          //update the line properties
          currentLine.attr("y1", newYPosition).attr("y2", newYPosition)
          currentDragArea.attr("y1", newYPosition).attr("y2", newYPosition)

          //update text
          textDraggableLineMeter.attr("y", newYPosition + marginTextY / 4).text(yScale.invert(newYPosition).toFixed(0) + " m")
          textDraggableLineYear.attr("y", newYPosition + marginTextY / 4)
        } else if (yScale.invert(linePos).toFixed(0) >= 2110) {
          handleBoundries(2109)
        } else if (yScale.invert(linePos).toFixed(0) <= 200) {
          handleBoundries(201)
        }
      }

      /**
       * Stop drag event if boundries are overpassed
       * @param {number} newPosition valid position in mountain boundries
       */
      function handleBoundries(newPosition) {
        //cancel event
        event.on("drag", null)

        //select lines and dragabble area
        var currentLine = select(".draggable-line")
        var currentDragArea = select(".draggable-area")

        //set new position
        var newYPosition = yScale(newPosition)
        setDraggableLinePosition(newPosition)

        //update the line properties
        currentLine.attr("y1", newYPosition).attr("y2", newYPosition)
        currentDragArea.attr("y1", newYPosition).attr("y2", newYPosition)

        //update text
        textDraggableLineMeter.attr("y", newYPosition + marginTextY / 4).text(yScale.invert(newYPosition).toFixed(0) + " m")
        textDraggableLineYear.attr("y", newYPosition + marginTextY / 4)

        dragended()
      }

      /**
       * handle drag end event
       */
      function dragended() {
        if (!props.showAnswer) {
          setShowSubmitButton(true)
          svg.selectAll(".draggable-line, .draggable-line-text-year, .draggable-line-text-meter").classed("active-text", false)
        }
      }
    }

    /**
     * handle animation of text
     */
    function animationLineText(offset, selector) {
      svg
        .select(selector)
        .transition()
        .delay(3000)
        .duration(600)
        .ease(easeQuad)
        .attr("y", yScale(selector === ".draggable-line-text-question" ? draggableLinePosition + 2 * offset : draggableLinePosition))
        .transition()
        .attr("y", yScale(draggableLinePosition + offset))
        .transition()
        .attr("y", yScale(selector === ".draggable-line-text-question" ? draggableLinePosition + 2 * offset : draggableLinePosition))
        .transition()
        .attr("y", yScale(draggableLinePosition + offset))
        .on("end", function () {
          animationLineText(offset, selector)
        })
    }

    /**
     * handle animation of draggable line
     */
    function animationLine() {
      svg
        .selectAll(".draggable-line, .draggable-area")
        .transition()
        .delay(3000)
        .duration(600)
        .ease(easeQuad)
        .attr("y1", d => yScale(draggableLinePosition + marginTextY))
        .attr("y2", d => yScale(draggableLinePosition + marginTextY))
        .transition()
        .attr("y1", d => yScale(draggableLinePosition))
        .attr("y2", d => yScale(draggableLinePosition))
        .transition()
        .attr("y1", d => yScale(draggableLinePosition + marginTextY))
        .attr("y2", d => yScale(draggableLinePosition + marginTextY))
        .transition()
        .attr("y1", d => yScale(draggableLinePosition))
        .attr("y2", d => yScale(draggableLinePosition))
        .on("end", animationLine)
    }
  }

  /**
   * react lifecycle
   */
  useEffect(() => {
    createSnowLine()
  }, [props.showAnswer, props.showSnowlineInteraction])

  /**
   * handle submission of result
   */
  function showResult() {
    props.showQuizzResult()
    setShowSubmitButton(false)
  }

  return (
    <React.Fragment>
      <div className="snowline-container zoom-mountain">
        <svg className="snowline-graph" width={width + 2 * marginLeft}>
          <g ref={svgRef}></g>
        </svg>
        {showSubmitButton ? (
          <button
            className="submit-button submit-button-snowline"
            style={{
              bottom: (draggableLinePosition * height) / mountainHeight - 5,
            }}
            onClick={() => showResult()}>
            {t("Climate2_Submit_Button")}
          </button>
        ) : null}
      </div>
    </React.Fragment>
  )
}

export default SnowLineDraggableGraph
