import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import * as d3Force from "d3-force"
import * as d3Zoom from "d3-zoom"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import BubbleObjectsPath from "../../assets/data_climate3/bubble_objects.csv"
import "./climate3.css"
import { transition } from "d3"

function Climate3() {
  const { t } = useTranslation()
  const [textboxes, setTextboxes] = useState({
    random: true,
    splitGas: false,
    splitC02: false,
  })
  const svgRef = useRef()
  var width = 1400,
    height = 680

  function createBubbleChart(data) {
    const svg = d3.select(svgRef.current)

    //set bubble position and radius
    var padding = 4
    for (var i = 0; i < data.length; i++) {
      data[i].radius = 11
      data[i].x = Math.random() * width
      data[i].y = Math.random() * height
    }

    //create circles
    var circles = svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", function (d) {
        return "bubble-" + d.type
      })
      .attr("r", function (d) {
        return d.radius
      })

    //applies forces to every single circle
    var simulation = d3Force
      .forceSimulation()
      .force("x", d3Force.forceX(width / 2).strength(0.035)) //center bubbles on x-axis
      .force("y", d3Force.forceY(height / 2).strength(0.035)) //center bubbles on y-axis
      .force("collide", d3Force.forceCollide(17)) //no overlapping -> radius of area collision to avoid

    //update position after tick (pos change)
    simulation.nodes(data).on("tick", ticked)
    function ticked() {
      circles
        .attr("cx", function (d) {
          return d.x
        })
        .attr("cy", function (d) {
          return d.y
        })
    }

    //Split bubbles by gas
    d3.select("#split-bubbles-by-gas").on("click", function () {
      console.log("by gas")
      var forceXSplitedByGas = d3Force
        .forceX(function (d) {
          if (d.type === "FGAS") {
            return width * 0.05
          } else if (d.type === "N02") {
            return width * 0.25
          } else if (d.type === "CH4") {
            return width * 0.9
          } else {
            return width * 0.55
          }
        })
        .strength(0.08)

      simulation
        .force("x", forceXSplitedByGas) //center bubbles on x-axis
        .force("y", d3Force.forceY(height / 2).strength(0.08)) //center bubbles on y-axis
        .force("collide", d3Force.forceCollide(17)) //no overlapping -> radius of area collision to avoid
        .alphaTarget(0.2) //move speed
        .restart() //restart simulatin with new force

      //Add gastext labels
      addTextLabel("bubble-title-gas bubble-FGAS", width * 0.0, 420, "Fluorierte Gase")
      addTextLabel("bubble-title-gas bubble-N02", width * 0.18, 420, "Stickstoffdioxid N02")
      addTextLabel("bubble-title-gas bubble-C02", width * 0.47, 530, "Kohlenstoffdioxid C02")
      addTextLabel("bubble-title-gas bubble-CH4", width * 0.85, 480, "Methan CH4")
    })

    var zoomed = false

    //Split bubbles by sector
    d3.select("#split-bubbles-by-sector").on("click", function () {
      svg.attr("class", "zoom")

      //Remove Gas text labels
      d3.selectAll(".bubble-CH4")
        .style("opacity", 1)
        .transition()
        .delay(0.5)
        .duration(500)
        .style("opacity", 0)
      d3.selectAll(".bubble-FGAS")
        .style("opacity", 1)
        .transition()
        .delay(0.5)
        .duration(500)
        .style("opacity", 0)
      d3.selectAll(".bubble-N02")
        .style("opacity", 1)
        .transition()
        .delay(0.5)
        .duration(500)
        .style("opacity", 0)

      d3.selectAll(".bubble-title-gas")
        .style("opacity", 1)
        .transition()
        .delay(1.5)
        .duration(500)
        .style("opacity", 0)

      //Split C02 bubbles
      var forceXSplitedBySector = d3Force
        .forceX(function (d) {
          if (d.type === "C02-Electricity") {
            return width * 0.1
          } else if (d.type === "C02-Agriculture") {
            return width * 0.3
          } else if (d.type === "C02-Industry") {
            return width * 0.5
          } else if (d.type === "C02-Transport") {
            return width * 0.68
          } else if (d.type === "C02-Other") {
            return width * 0.83
          } else if (d.type === "C02-Buildings") {
            return width * 0.95
          }
        })
        .strength(0.08)

      simulation
        .force("x", forceXSplitedBySector) //center bubbles on x-axis
        .force("y", d3Force.forceY(height / 2).strength(0.08)) //center bubbles on y-axis
        .force("collide", d3Force.forceCollide(17)) //no overlapping -> radius of area collision to avoid
        .alphaTarget(0.2) //move speed
        .stop() //restart simulatin with new force

      setTimeout(function () {
        simulation.restart()
      }, 2200)

      //Add sector text labels and change color
      addTextLabel("bubble-title-gas bubble-C02-Electricity", width * 0.06, 150, "Electricity")
      d3.selectAll(".bubble-C02-Electricity").attr("class", "bubble-C02-electricty-split-color")

      addTextLabel("bubble-title-gas bubble-C02-Agriculture", width * 0.26, 150, "Agriculture", 5000)
      d3.selectAll(".bubble-C02-Agriculture").attr("class", "bubble-C02-agriculture-split-color")

      addTextLabel("bubble-title-gas bubble-C02-Industry", width * 0.47, 150, "Industry", 6000)
      d3.selectAll(".bubble-C02-Industry").attr("class", "bubble-C02-industry-split-color")

      addTextLabel("bubble-title-gas bubble-C02-Transport", width * 0.64, 150, "Transport", 7000)
      d3.selectAll(".bubble-C02-Transport").attr("class", "bubble-C02-transport-split-color")

      addTextLabel("bubble-title-gas bubble-C02-Other", width * 0.79, 150, "Other", 8000)
      d3.selectAll(".bubble-C02-Other").attr("class", "bubble-C02-other-split-color")

      addTextLabel("bubble-title-gas bubble-C02-Buildings", width * 0.92, 150, "Buildings", 9000)
      d3.selectAll(".bubble-C02-Buildings").attr("class", "bubble-C02-buildings-split-color")
    })

    //Function to display textlabels
    function addTextLabel(cssClass, xPos, yPos, text, delay = 3500) {
      svg
        .append("text")
        .attr("class", cssClass)
        .attr("x", xPos)
        .attr("y", yPos)
        .text(text)
        .style("opacity", 0)
        .transition()
        .delay(delay)
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1)
    }
  }

  /**
   * React Lifecycle -> Renders only once
   */
  useEffect(() => {
    d3.csv(BubbleObjectsPath).then(data => {
      createBubbleChart(data)
    })
  }, [])

  function createBubble1() {
    return (
      <CSSTransition in={textboxes.random} timeout={4000} classNames="bubble-fade" unmountOnExit appear>
        <div className="bubble-box bubble-box-climate3-txtbox1">
          <p className="bubble-box-text">
            Hauptsächlich sind die Treibhausgase verantowrtlich für den Klimawandel...
          </p>
          <button
            id="next-button"
            id="split-bubbles-by-gas"
            onClick={() => {
              setTextboxes({ random: false, splitGas: true, splitC02: false })
            }}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  function createBubble2() {
    return (
      <div className={textboxes.splitGas ? "show-textbox" : "hide-textbox"}>
        <div className="bubble-box bubble-box-climate3-txtbox2">
          <p className="bubble-box-text">Dabei wird das Gas C02 am Meisten ausgestossen...</p>
          <button
            id="next-button"
            id="split-bubbles-by-sector"
            onClick={() => {
              setTextboxes({ random: false, splitGas: false, splitC02: true })
            }}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </div>
    )
  }

  function createBubble3() {
    return (
      <div className={textboxes.splitC02 ? "show-textbox" : "hide-textbox"}>
        <div className="bubble-box bubble-box-climate3-txtbox3">
          <p className="bubble-box-text">Co2-Ausstoss nach Sektor...</p>
          <button
            id="next-button"
            onClick={() => {
              console.log("Go to next page")
            }}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <CSSTransition in={true} timeout={100000} classNames="fade" unmountOnExit appear>
        <div>
          <h1 className="climate2-title"> {t("Climate3_Title.1")}</h1>
          {createBubble1()}
          {createBubble2()}
          {createBubble3()}
          <svg className="svg-container" width={width} height={height}>
            <g ref={svgRef}></g>
          </svg>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate3
