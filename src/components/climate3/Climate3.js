import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import * as d3Force from "d3-force"
import "./climate3.css"
import history from "../../routing/history"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import ButtonLeft from "../../assets/img/buttonLeft.svg"
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

    /**
     * (1) initial animation simulation.
     * source: (0) climate2
     */
    simulation
      .force("x", d3Force.forceX(d => width * d.cluster1X).strength(0.01))
      .force("y", d3Force.forceY(d => height * d.cluster1Y).strength(0.01))
      .force("charge", d3Force.forceManyBody())
      .force("collide", d3Force.forceCollide(25))
      .alphaTarget(0.09)

    /**
     * (1) initial animation simulation.
     * source: (2) gas
     */
    d3.select("#inital-bubble-animation-back").on("click", function () {
      d3.selectAll(".bubble-title-gas").style("opacity", 1).transition().delay(0).duration(1000).style("opacity", 0)
      d3.selectAll(".bubble-source-gas").style("opacity", 1).transition().delay(0).duration(1000).style("opacity", 0)

      setTimeout(function () {
        simulation
          .force("x", d3Force.forceX(d => width * d.cluster1X).strength(0.01))
          .force("y", d3Force.forceY(d => height * d.cluster1Y).strength(0.01))
          .force("charge", d3Force.forceManyBody())
          .force("collide", d3Force.forceCollide(25))
          .alphaTarget(0.3)
      }, 1000)
    })

    /**
     * (2) split bubbles by gas.
     * source: (1) start page
     */
    d3.select("#split-bubbles-by-gas").on("click", function () {
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
      addTextLabel("bubble-source-gas", width * 0.15, height * 0.65, t("Climate3_Gas_Cause.1"), 8000)
      addTextLabel("bubble-source-gas", width * 0.15, height * 0.665, t("Climate3_Gas_Cause.2"), 8000)
      addTextLabel("bubble-source-gas", width * 0.35, height * 0.72, t("Climate3_Gas_Cause.3"), 8000)
      addTextLabel("bubble-source-gas", width * 0.35, height * 0.735, t("Climate3_Gas_Cause.4"), 8000)
      addTextLabel("bubble-source-gas", width * 0.6, height * 0.83, t("Climate3_Gas_Cause.5"), 8000)
      addTextLabel("bubble-source-gas", width * 0.6, height * 0.845, t("Climate3_Gas_Cause.6"), 8000)
      addTextLabel("bubble-source-gas", width * 0.83, height * 0.69, t("Climate3_Gas_Cause.7"), 8000)
      addTextLabel("bubble-source-gas", width * 0.83, height * 0.705, t("Climate3_Gas_Cause.8"), 8000)
    })

    /**
     * (2) split bubbles by gas.
     * source: (3) sector
     */
    d3.select("#split-bubbles-by-gas-back").on("click", function () {
      d3.selectAll(".bubble-title-sector").style("opacity", 1).transition().delay(0).duration(1000).style("opacity", 0)
      d3.selectAll(".bubble-source-sector").style("opacity", 1).transition().delay(0).duration(1000).style("opacity", 0)

      //change color of bubbles by gas
      d3.selectAll(".bubble-FGAS").transition().delay(1600).duration(2000).style("fill", "#ffd763")
      d3.selectAll(".bubble-CH4").transition().delay(1600).duration(2000).style("fill", "#40b79b")
      d3.selectAll(".bubble-C02").transition().delay(1600).duration(2000).style("fill", "#d14aa7")
      d3.selectAll(".bubble-N02").transition().delay(1600).duration(2000).style("fill", "#d37b61")

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
      addTextLabel("bubble-source-gas", width * 0.15, height * 0.65, t("Climate3_Gas_Cause.1"), 8000)
      addTextLabel("bubble-source-gas", width * 0.15, height * 0.665, t("Climate3_Gas_Cause.2"), 8000)
      addTextLabel("bubble-source-gas", width * 0.35, height * 0.72, t("Climate3_Gas_Cause.3"), 8000)
      addTextLabel("bubble-source-gas", width * 0.35, height * 0.735, t("Climate3_Gas_Cause.4"), 8000)
      addTextLabel("bubble-source-gas", width * 0.6, height * 0.83, t("Climate3_Gas_Cause.5"), 8000)
      addTextLabel("bubble-source-gas", width * 0.6, height * 0.845, t("Climate3_Gas_Cause.6"), 8000)
      addTextLabel("bubble-source-gas", width * 0.83, height * 0.69, t("Climate3_Gas_Cause.7"), 8000)
      addTextLabel("bubble-source-gas", width * 0.83, height * 0.705, t("Climate3_Gas_Cause.8"), 8000)
    })

    /**
     * (3) split bubbles by sector.
     * source: (2) gas
     */
    d3.select("#split-bubbles-by-sector").on("click", function () {
      d3.selectAll(".bubble-title-gas").style("opacity", 1).transition().delay(0).duration(1000).style("opacity", 0)
      d3.selectAll(".bubble-source-gas").style("opacity", 1).transition().delay(0).duration(1000).style("opacity", 0)

      setTimeout(function () {
        simulation
          .force("x", d3Force.forceX(width / 2).strength(0.03))
          .force("y", d3Force.forceY(height / 2).strength(0.03))
          .force("charge", null)
          .alphaTarget(0.01)
          .restart()
      }, 500)

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
      addTextLabel("bubble-title-sector label-electricity", width * 0.15, height * 0.65, "25%", 6000)
      addTextLabel("bubble-title-sector label-agriculture", width * 0.32, height * 0.65, "24%", 6000)
      addTextLabel("bubble-title-sector label-industry", width * 0.48, height * 0.65, "21%", 6000)
      addTextLabel("bubble-title-sector label-transport", width * 0.63, height * 0.65, "14%", 6000)
      addTextLabel("bubble-title-sector label-other", width * 0.75, height * 0.65, "10%", 6000)
      addTextLabel("bubble-title-sector label-buildings", width * 0.87, height * 0.65, "6%", 6000)

      //add sector labels
      addTextLabel("bubble-title-sector label-electricity", width * 0.15, height * 0.68, t("Climate3_Sector.1"), 6000)
      addTextLabel("bubble-title-sector label-agriculture", width * 0.32, height * 0.68, t("Climate3_Sector.2"), 6000)
      addTextLabel("bubble-title-sector label-industry", width * 0.48, height * 0.68, t("Climate3_Sector.3"), 6000)
      addTextLabel("bubble-title-sector label-transport", width * 0.63, height * 0.68, t("Climate3_Sector.4"), 6000)
      addTextLabel("bubble-title-sector label-other", width * 0.75, height * 0.68, t("Climate3_Sector.5"), 6000)
      addTextLabel("bubble-title-sector label-buildings", width * 0.87, height * 0.68, t("Climate3_Sector.6"), 6000)

      //add sector source
      addTextLabel("bubble-source-sector", width * 0.15, height * 0.73, t("Climate3_Sector_Cause.1"), 8000)
      addTextLabel("bubble-source-sector", width * 0.15, height * 0.745, t("Climate3_Sector_Cause.2"), 8000)
      addTextLabel("bubble-source-sector", width * 0.32, height * 0.73, t("Climate3_Sector_Cause.3"), 8000)
      addTextLabel("bubble-source-sector", width * 0.32, height * 0.745, t("Climate3_Sector_Cause.4"), 8000)
      addTextLabel("bubble-source-sector", width * 0.48, height * 0.73, t("Climate3_Sector_Cause.5"), 8000)
      addTextLabel("bubble-source-sector", width * 0.48, height * 0.745, t("Climate3_Sector_Cause.6"), 8000)
      addTextLabel("bubble-source-sector", width * 0.63, height * 0.73, t("Climate3_Sector_Cause.7"), 8000)
      addTextLabel("bubble-source-sector", width * 0.63, height * 0.745, t("Climate3_Sector_Cause.8"), 8000)
      addTextLabel("bubble-source-sector", width * 0.75, height * 0.73, t("Climate3_Sector_Cause.9"), 8000)
      addTextLabel("bubble-source-sector", width * 0.75, height * 0.745, t("Climate3_Sector_Cause.10"), 8000)
      addTextLabel("bubble-source-sector", width * 0.87, height * 0.73, t("Climate3_Sector_Cause.11"), 8000)
      addTextLabel("bubble-source-sector", width * 0.87, height * 0.745, t("Climate3_Sector_Cause.12"), 8000)
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
      <CSSTransition in={textboxes.random} timeout={4000} classNames="bubble-fade" unmountOnExit appear>
        <div className="bubble-box-outer">
          <div className="bubble-box bubble-box-climate3">
            <p className="bubble-box-text">
              {t("Climate3_Bubble_1.1")}
              <span className="question-style">
                <b>{t("Climate3_Bubble_1.2")}</b>
              </span>
              {t("Climate3_Bubble_1.3")}
            </p>
          </div>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Adds next navigation button
   * @returns dom element with speech bubble
   */
  function navigationNext() {
    return (
      <div>
        <div className={textboxes.random ? "show-nav" : "hide-nav"}>
          <div className="bubble-box navigation-front-button">
            <button
              id="next-button"
              id="split-bubbles-by-gas"
              onClick={() => {
                setTextboxes({ random: false, splitGas: true, splitC02: false })
              }}>
              <img src={ButtonRight} alt="continue"></img>
            </button>
          </div>
        </div>
        <div className={textboxes.splitGas ? "show-nav-delay-8s" : "hide-nav"}>
          <div className="bubble-box navigation-front-button">
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
        <div className={textboxes.splitC02 ? "show-nav-delay-7s" : "hide-nav"}>
          <div className="bubble-box navigation-front-button">
            <button
              id="next-button"
              onClick={() => {
                console.log("Go to next page")
              }}>
              <img src={ButtonRight} alt="continue"></img>
            </button>
          </div>
        </div>
      </div>
    )
  }

  /**
   * Adds back navigation button
   * @returns dom element with speech bubble
   */
  function navigationBack() {
    return (
      <div>
        <div className={textboxes.random ? "show-nav" : "hide-nav"}>
          <div className="bubble-box navigation-back-button">
            <button
              id="next-button"
              onClick={() => {
                history.push("/Snowline")
              }}>
              <img src={ButtonLeft} alt="continue"></img>
            </button>
          </div>
        </div>

        <div className={textboxes.splitGas ? "show-nav" : "hide-nav"}>
          <div className="bubble-box navigation-back-button">
            <button
              id="next-button"
              id="inital-bubble-animation-back"
              onClick={() => {
                setTimeout(function () {
                  setTextboxes({ random: true, splitGas: false, splitC02: false })
                }, 3000)
              }}>
              <img src={ButtonLeft} alt="continue"></img>
            </button>
          </div>
        </div>

        <div className={textboxes.splitC02 ? "show-nav" : "hide-nav"}>
          <div className="bubble-box navigation-back-button">
            <button
              id="next-button"
              id="split-bubbles-by-gas-back"
              onClick={() => {
                setTextboxes({ random: false, splitGas: true, splitC02: false })
              }}>
              <img src={ButtonLeft} alt="continue"></img>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <CSSTransition in={true} timeout={100000} classNames="fade" unmountOnExit appear>
        <div>
          {createBubble1()}
          {navigationNext()}
          {navigationBack()}
          <svg className="svg-container" width={width} height={height}>
            <g ref={svgRef}></g>
          </svg>
          <h1 className="title"> {t("Climate3_Title.1")}</h1>
          {textboxes.random ? <h2 className="subtitle">{t("Climate3_Title.2")}</h2> : ""}
          {textboxes.splitGas ? (
            <div className="show-textbox">
              <h2 className="subtitle show-textbox">{t("Climate3_Title.3")}</h2>
            </div>
          ) : (
            ""
          )}
          {textboxes.splitC02 ? (
            <div className="show-textbox">
              <h2 className="subtitle">{t("Climate3_Title.4")}</h2>
            </div>
          ) : (
            ""
          )}
          <h6 className="source">{t("Climate3_Source")}</h6>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate3
