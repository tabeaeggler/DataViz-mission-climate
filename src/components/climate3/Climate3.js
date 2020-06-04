import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import * as d3Force from "d3-force"
import "./climate3.css"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import BubbleObjectsPath from "../../assets/data_climate3/bubble_objects.csv"

/**
 * Assembles all elements of climate3 screen
 */
function Climate3() {
  const { t } = useTranslation()
  const [textboxes, setTextboxes] = useState({
    random: true,
    splitGas: false,
    splitC02: false,
  })
  const [buttonDelay, setButtonDelay] = useState(false)
  const [showBubbleBox, setShowBubbleBox] = useState(true)
  const svgRef = useRef()
  const width = window.innerWidth
  const height = window.innerHeight

  function createBubbleChart(data) {
    const svg = d3.select(svgRef.current)

    //set bubble initial position and radius
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
        return `bubble-${d.sector} bubble-${d.type} `
      })
      .attr("r", function (d) {
        return d.radius
      })

    //initial force
    var simulation = d3Force.forceSimulation()

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

    //initial animation cluster1 simulation
    simulation
      .force("x", d3Force.forceX(d => width * d.cluster1X).strength(0.01))
      .force("y", d3Force.forceY(d => height * d.cluster1Y).strength(0.01))
      .force("charge", d3Force.forceManyBody())
      .force("collide", d3Force.forceCollide(25))
      .alphaTarget(0.09)

    //split bubbles by gas
    d3.select("#split-bubbles-by-gas").on("click", function () {
      //center all bubbles
      setTimeout(function () {
        simulation
          .force("collide", d3Force.forceCollide(17))
          .force("charge", null)
          .force("x", d3Force.forceX(width / 2).strength(0.015))
          .force("y", d3Force.forceY(height / 2).strength(0.015))
          .alphaTarget(0.7)
          .restart()
      }, 500)

      var forceXSplitedByGas = d3Force
        .forceX(function (d) {
          if (d.type === "FGAS") {
            return width * 0.15
          } else if (d.type === "CH4") {
            return width * 0.35
          } else if (d.type === "N02") {
            return width * 0.83
          } else {
            return width * 0.6
          }
        })
        .strength(0.02)

      setTimeout(function () {
        simulation
          .force("x", forceXSplitedByGas)
          .force("y", d3Force.forceY(height / 2).strength(0.02))
          .force("collide", d3Force.forceCollide(17))
          .force("charge", null)
          .alphaTarget(0.64)
          .restart()
      }, 3500)

      //add percentage labels
      addTextLabel("bubble-title-gas bubble-FGAS", width * 0.15, height * 0.57, "2%", 6000)
      addTextLabel("bubble-title-gas bubble-CH4", width * 0.35, height * 0.64, "16%", 6000)
      addTextLabel("bubble-title-gas bubble-C02", width * 0.6, height * 0.74, "76%", 6000)
      addTextLabel("bubble-title-gas bubble-N02", width * 0.83, height * 0.6, "6%", 6000)

      //add gas labels
      addTextLabel("bubble-title-gas bubble-FGAS", width * 0.15, height * 0.6, t("Climate3_Gas.1"), 6000)
      addTextLabel("bubble-title-gas bubble-CH4", width * 0.35, height * 0.67, t("Climate3_Gas.2"), 6000)
      addTextLabel("bubble-title-gas bubble-C02", width * 0.6, height * 0.78, t("Climate3_Gas.3"), 6000)
      addTextLabel("bubble-title-gas bubble-N02", width * 0.83, height * 0.64, t("Climate3_Gas.4"), 6000)

      //add gas source
      addTextLabel("bubble-source", width * 0.15, height * 0.65, t("Climate3_Gas_Cause.1"), 8000)
      addTextLabel("bubble-source", width * 0.15, height * 0.665, t("Climate3_Gas_Cause.2"), 8000)
      addTextLabel("bubble-source", width * 0.35, height * 0.72, t("Climate3_Gas_Cause.3"), 8000)
      addTextLabel("bubble-source", width * 0.35, height * 0.735, t("Climate3_Gas_Cause.4"), 8000)
      addTextLabel("bubble-source", width * 0.6, height * 0.83, t("Climate3_Gas_Cause.5"), 8000)
      addTextLabel("bubble-source", width * 0.6, height * 0.845, t("Climate3_Gas_Cause.6"), 8000)
      addTextLabel("bubble-source", width * 0.83, height * 0.69, t("Climate3_Gas_Cause.7"), 8000)
      addTextLabel("bubble-source", width * 0.83, height * 0.705, t("Climate3_Gas_Cause.8"), 8000)
    })

    //split bubbles by sector
    d3.select("#split-bubbles-by-sector").on("click", function () {
      //center all bubbles
      setTimeout(function () {
        simulation
          .force("x", d3Force.forceX(width / 2).strength(0.03))
          .force("y", d3Force.forceY(height / 2).strength(0.03))
          .force("charge", null)
          .alphaTarget(0.01)
          .restart()
      }, 500)

      //remove gas text labels
      d3.selectAll(".bubble-title-gas").style("opacity", 1).transition().delay(0.5).duration(2000).style("opacity", 0)

      //remove gas source text labels
      d3.selectAll(".bubble-source").style("opacity", 1).transition().delay(0.5).duration(2000).style("opacity", 0)

      //change color of bubbles by sector
      d3.selectAll(".bubble-Electricity").transition().delay(1600).duration(2000).style("fill", "#FFF5FA")
      d3.selectAll(".bubble-Agriculture").transition().delay(1600).duration(2000).style("fill", "#FAC8DF")
      d3.selectAll(".bubble-Industry").transition().delay(1600).duration(2000).style("fill", "#F4A8ED")
      d3.selectAll(".bubble-Transport").transition().delay(1600).duration(2000).style("fill", "#CF7CFF")
      d3.selectAll(".bubble-Other").transition().delay(1600).duration(2000).style("fill", "#9685e5")
      d3.selectAll(".bubble-Buildings").transition().delay(1600).duration(2000).style("fill", "#6a8adf")

      //split bubbles by sector
      var forceXSplitedBySector = d3Force
        .forceX(function (d) {
          if (d.sector === "Electricity") {
            return width * 0.15
          } else if (d.sector === "Agriculture") {
            return width * 0.32
          } else if (d.sector === "Industry") {
            return width * 0.48
          } else if (d.sector === "Transport") {
            return width * 0.63
          } else if (d.sector === "Other") {
            return width * 0.76
          } else if (d.sector === "Buildings") {
            return width * 0.87
          }
        })
        .strength(0.06)

      setTimeout(function () {
        simulation
          .force("x", forceXSplitedBySector)
          .force("y", d3Force.forceY(height / 2).strength(0.06))
          .alphaTarget(0.25)
          .restart()
      }, 4000)

      //add percentage label
      addTextLabel("bubble-title-gas label-electricity", width * 0.15, height * 0.65, "25%", 6000)
      addTextLabel("bubble-title-gas label-agriculture", width * 0.32, height * 0.65, "24%", 6000)
      addTextLabel("bubble-title-gas label-industry", width * 0.48, height * 0.65, "21%", 6000)
      addTextLabel("bubble-title-gas label-transport", width * 0.63, height * 0.65, "14%", 6000)
      addTextLabel("bubble-title-gas label-other", width * 0.75, height * 0.65, "10%", 6000)
      addTextLabel("bubble-title-gas label-buildings", width * 0.87, height * 0.65, "6%", 6000)

      //add sector labels
      addTextLabel("bubble-title-gas label-electricity", width * 0.15, height * 0.68, t("Climate3_Sector.1"), 6000)
      addTextLabel("bubble-title-gas label-agriculture", width * 0.32, height * 0.68, t("Climate3_Sector.2"), 6000)
      addTextLabel("bubble-title-gas label-industry", width * 0.48, height * 0.68, t("Climate3_Sector.3"), 6000)
      addTextLabel("bubble-title-gas label-transport", width * 0.63, height * 0.68, t("Climate3_Sector.4"), 6000)
      addTextLabel("bubble-title-gas label-other", width * 0.75, height * 0.68, t("Climate3_Sector.5"), 6000)
      addTextLabel("bubble-title-gas label-buildings", width * 0.87, height * 0.68, t("Climate3_Sector.6"), 6000)

      //add sector source
      addTextLabel("bubble-source", width * 0.15, height * 0.73, t("Climate3_Sector_Cause.1"), 8000)
      addTextLabel("bubble-source", width * 0.15, height * 0.745, t("Climate3_Sector_Cause.2"), 8000)
      addTextLabel("bubble-source", width * 0.32, height * 0.73, t("Climate3_Sector_Cause.3"), 8000)
      addTextLabel("bubble-source", width * 0.32, height * 0.745, t("Climate3_Sector_Cause.4"), 8000)
      addTextLabel("bubble-source", width * 0.48, height * 0.73, t("Climate3_Sector_Cause.5"), 8000)
      addTextLabel("bubble-source", width * 0.48, height * 0.745, t("Climate3_Sector_Cause.6"), 8000)
      addTextLabel("bubble-source", width * 0.63, height * 0.73, t("Climate3_Sector_Cause.7"), 8000)
      addTextLabel("bubble-source", width * 0.63, height * 0.745, t("Climate3_Sector_Cause.8"), 8000)
      addTextLabel("bubble-source", width * 0.75, height * 0.73, t("Climate3_Sector_Cause.9"), 8000)
      addTextLabel("bubble-source", width * 0.75, height * 0.745, t("Climate3_Sector_Cause.10"), 8000)
      addTextLabel("bubble-source", width * 0.87, height * 0.73, t("Climate3_Sector_Cause.11"), 8000)
      addTextLabel("bubble-source", width * 0.87, height * 0.745, t("Climate3_Sector_Cause.12"), 8000)
    })

    /**
     * function to add textlabel to a specific position
     */
    function addTextLabel(cssClass, xPos, yPos, text, delay = 3000) {
      svg
        .append("text")
        .attr("class", cssClass)
        .attr("x", xPos)
        .attr("y", yPos)
        .text(text)
        .style("opacity", 0)
        .transition()
        .delay(delay)
        .duration(1500)
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

  /**
   * Adds Speach Bubble 1: overview
   * @returns dom element with speech bubble
   */
  function createBubble1() {
    return (
      <CSSTransition in={showBubbleBox} timeout={4000} classNames="bubble-fade" unmountOnExit appear>
        <div className="bubble-box-outer">
          <div className="bubble-box bubble-box-climate3-txtbox1">
            <p className="bubble-box-text">
              <b>{t("Climate3_Bubble_1.1")}</b>
              {t("Climate3_Bubble_1.2")}
            </p>
            <button
              id="next-button"
              id="split-bubbles-by-gas"
              onClick={() => {
                setShowBubbleBox(false)
                setTextboxes({ random: false, splitGas: true, splitC02: false })
              }}>
              <img src={ButtonRight} alt="continue"></img>
            </button>
          </div>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Adds Speach Bubble 2: split by gas
   * @returns dom element with speech bubble
   */
  function createBubble2() {
    return (
      <div className={textboxes.splitGas ? "show-textbox" : "hide-textbox"}>
        <div className="bubble-box bubble-box-climate3-txtbox2">
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

  /**
   * Adds Speach Bubble 1: split by sector
   * @returns dom element with speech bubble
   */
  function createBubble3() {
    return (
      <div className={textboxes.splitC02 ? "show-textbox-3" : "hide-textbox"}>
        <div className="bubble-box bubble-box-climate3-txtbox3">
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
          {createBubble1()}
          {createBubble2()}
          {createBubble3()}
          <svg className="svg-container" width={width} height={height}>
            <g ref={svgRef}></g>
          </svg>
          <h1 className="title"> {t("Climate3_Title.1")}</h1>
          {textboxes.random ? <h2 className="subtitle">{t("Climate3_Title.2")}</h2> : ""}
          {textboxes.splitGas ? <h2 className="subtitle">{t("Climate3_Title.3")}</h2> : ""}
          {textboxes.splitC02 ? <h2 className="subtitle">{t("Climate3_Title.4")}</h2> : ""}
          <h6 className="source">{t("Climate3_Source")}</h6>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate3
