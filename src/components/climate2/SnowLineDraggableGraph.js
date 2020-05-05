import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle  } from "react"
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

const SnowLineDraggableGraph = forwardRef((props, ref) =>{
  //transaltion
  const { t } = useTranslation()

  //svg sizing
  const svgRef = useRef()
  const width = 700
  const height = 556
  const marginLeft = 98
  const marginTop = 45
  const mountainHeight = 2128
  const marginTextY = 60
  const marginTextX = 50

  //state
  const [draggableLinePosition, setDraggableLinePosition] = useState(1000)
  const [showSubmitButton, setShowSubmitButton] = useState(false)

  /**
   * Main code for SnowLineDraggable
   */
  function createSnowLine() {
    const svg = select(svgRef.current)
      .attr("transform", `translate(${marginLeft},${marginTop})`)
      .attr("class", "group")

    const yScale = scaleLinear().domain([mountainHeight, 0]).range([0, height])

    if (props.showAnswer) {
      //create distance rectangle and answer text
      svg
        .append("rect")
        .attr("class", "difference-rect")
        .attr("x", -2)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("y", yScale(props.data[1].snowline))
        .attr("width", width + 2)
        .attr(
          "height",
          Math.abs(
            yScale(props.data[0].snowline - 10) -
              yScale(props.data[1].snowline - 10)
          )
        )
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
        .attr("class", "difference-text")
        .attr("x", width + 20)
        .attr("y", yScale(props.data[1].snowline - 175))
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
        .attr("class", "snowline-text answer-text")
        .attr("x", 8)
        .attr(
          "y",
          props.data[1].snowline - draggableLinePosition < 75 &&
            props.data[1].snowline - draggableLinePosition > 0
            ? yScale(props.data[1].snowline + marginTextY / 2)
            : yScale(props.data[1].snowline - marginTextY)
        )
        .text("2018: Lösung")
        .style("opacity", 0)
        .transition()
        .delay(2700)
        .duration(300)
        .ease(easeLinear)
        .style("opacity", 1)

      //render draggable line and text STATIC
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
          props.data[1].snowline - draggableLinePosition < 0 &&
            props.data[1].snowline - draggableLinePosition > -75
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
          props.data[1].snowline - draggableLinePosition < 0 &&
            props.data[1].snowline - draggableLinePosition > -75
            ? yScale(draggableLinePosition) - 5
            : yScale(draggableLinePosition - marginTextY)
        )
        .text("2018: Deine Schätzung")
      animationLineText()

      svg
        .append("text")
        .attr("class", "snowline-text answer-text")
        .attr("x", width - marginTextX)
        .attr(
          "y",
          props.data[1].snowline - draggableLinePosition < 75 &&
            props.data[1].snowline - draggableLinePosition > 0
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
        .attr("class", "draggable-line-text-meter snowline-text")
        .attr("x", width - marginTextX)
        .attr("y", yScale(draggableLinePosition - marginTextY))
        .text(" ")

      var textDraggableLineYear = svg
        .append("text")
        .attr("class", "draggable-line-text-year snowline-text")
        .attr("x", 8)
        .attr("y", yScale(draggableLinePosition - marginTextY))
        .text("2018: Deine Schätzung")
      animationLineText()

      function dragstarted() {
        if (!props.showAnswer) {
          setShowSubmitButton(true)
          select(this).classed("active-d3-item", true)
          select(".draggable-line-text-meter").classed("active-text", true)
          select(".draggable-line-text-year").classed("active-text", true)
          svg.select(".draggable-line").interrupt()
          svg.select(".draggable-line-text-year").interrupt()
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
            .attr("y", newYPosition + marginTextY / 4)
            .text(yScale.invert(newYPosition).toFixed(0) + " m")

          textDraggableLineYear.attr("y", newYPosition + marginTextY / 4)
        }
      }

      function dragended() {
        if (!props.showAnswer) {
          select(this).classed("active-d3-item", false)
          select(".draggable-line-text-meter").classed("active-text", false)
          select(".draggable-line-text-year").classed("active-text", false)
        }
      }
    }

    function animationLineText() {
      svg
        .select(".draggable-line-text-year")
        .transition()
        .delay(3000)
        .duration(600)
        .ease(easeQuad)
        .attr("y", yScale(draggableLinePosition - marginTextY + 60))
        .transition()
        .attr("y", yScale(draggableLinePosition - marginTextY))
        .transition()
        .attr("y", yScale(draggableLinePosition - marginTextY + 60))
        .transition()
        .attr("y", yScale(draggableLinePosition - marginTextY))
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

   /**
   * Trigger visibility of button from parent
   */
  function showButton() {
    setShowSubmitButton(true)
  }

  useImperativeHandle(ref, () => {
    return {
      showButton: showButton
    };
  });

  return (
    <React.Fragment>
      <div className="snowline-container">
        <svg className="snowline-graph" width={width + 2 * marginLeft}>
          <g ref={svgRef}></g>
        </svg>
        {showSubmitButton ? (
          <button
            className="submit-button"
            style={{
              bottom: (draggableLinePosition * height) / mountainHeight,
            }}
            onClick={() => showResult()}>
            {t("Climate2_Submit_Button")}
          </button>
        ) : null}
      </div>
    </React.Fragment>
  )
});

export default SnowLineDraggableGraph
