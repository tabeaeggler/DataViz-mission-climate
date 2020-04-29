import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { select, scaleLinear, drag, event } from "d3"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"

function SnowLineDraggable() {
  const { t } = useTranslation()
  const svgRef = useRef()
  const [showBubble, setShowBubble] = useState({
    startQuizz: true,
    exitQuizz: false,
  })
  //const [data, setData] = useState({ year: 1960, snowline: 900 })

  //console.log("init", data)

  var data = [{ year: 1960, snowline: 900 }]

  /**
   * Adds Speach Bubble with text for Globe
   */
  function createBubbleStartQuizz() {
    return (
      <CSSTransition
        in={showBubble.startQuizz}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate2-start">
          <p className="bubble-box-text">
            "Starte das Quizz und bestätige die Eingabe"
          </p>
          <button id="next-button" onClick={() => showQuizzResult()}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  function showQuizzResult() {
    //setData({ year: 1960, snowline: 900 }, { year: 2018, snowline: 1250 })
    // console.log(data)
    setShowBubble({
      startQuizz: false,
      exitQuizz: true,
    })
    //show result line
    //undrag line
    //shwo second bubble
  }

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

    //add static line
    svg
      .selectAll("line")
      .data(data)
      .join(
        enter => enter.append("line").attr("stroke", "green"),
        update => update.attr("stroke", "red")
      )
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", d => yScale(d.snowline))
      .attr("y2", d => yScale(d.snowline))

    //draggable line
    var draggableLine = svg
      .append("line")
      .attr("stroke", "blue")
      .attr("stroke-width", "10")
      .attr("x1", 0)
      .attr("x2", width)
      .attr("y1", yScale(data[0].snowline - 100))
      .attr("y2", yScale(data[0].snowline - 100))
      .call(
        drag().on("start", dragstarted).on("drag", dragged).on("end", dragended)
      )

    var text = svg
      .append("text")
      .style("fill", "white")
      .attr("x", width + 20)
      .attr("y", yScale(data[0].snowline - 100))
      .text(data[0].snowline + " m.ü.M")

    function dragstarted() {
      if (showBubble.startQuizz) {
        select(this).classed("active-d3-item", true)
      }
    }

    function dragged() {
      if (showBubble.startQuizz) {
        var y = event.dy
        var currentLine = select(this)
        var newYPosition = parseInt(currentLine.attr("y1")) + y

        //Check boundaries of drag area
        if (newYPosition > height) newYPosition = height
        else if (newYPosition < 0) newYPosition = 0

        //Update the line properties
        currentLine.attr("y1", newYPosition).attr("y2", newYPosition)

        //Update text
        text
          .attr("y", newYPosition)
          .text(yScale.invert(newYPosition).toFixed(0) + " m.ü.M")
      }
    }

    function dragended() {
      if (showBubble.startQuizz) {
        select(this).classed("active-d3-item", false)
      }
    }
  }

  /**
   * React Lifecycle
   */
  useEffect(() => {
    createSnowLine()
  }, [showBubble])

  return (
    <React.Fragment>
      <div className="snowline-container">
        {createBubbleStartQuizz()}
        <svg className="snowline-graph" width={500}>
          <g ref={svgRef}></g>
        </svg>
      </div>
    </React.Fragment>
  )
}

export default SnowLineDraggable
