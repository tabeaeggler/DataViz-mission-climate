import React, { useState, useEffect, useRef, useCallback } from "react"
import * as d3 from "d3"
import * as d3Force from "d3-force"
import "./climate3.css"
import history from "../../routing/history"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonNavRight.svg"
import ButtonLeft from "../../assets/img/buttonNavLeft.svg"
import BubbleObjectsPath from "../../assets/data_climate3/bubble_objects.csv"

/**
 * assembles all elements of climate3 screen
 * @param {function} props.setPageNr setter for navigation
 */

function Climate3(props) {
  const { t } = useTranslation()
  const [state, setState] = useState({
    overview: true,
    splitGas: false,
    splitSector: false,
  })

  const svgRef = useRef()
  const radiusBubble = 11
  const width = window.innerWidth
  const height = window.innerHeight

  const createBubbleChart = useCallback(
    data => {
      const svg = d3.select(svgRef.current)

      //set bubble initial position and radius
      for (var i = 0; i < data.length; i++) {
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
        .attr("r", radiusBubble)

      //create initial force
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
        d3.selectAll(".bubble-title-gas").style("opacity", 1).transition().duration(1000).style("opacity", 0)
        d3.selectAll(".bubble-source-gas").style("opacity", 1).transition().duration(1000).style("opacity", 0)

        simulation
          .force("x", d3Force.forceX(d => width * d.cluster1X).strength(0.01))
          .force("y", d3Force.forceY(d => height * d.cluster1Y).strength(0.01))
          .force("charge", d3Force.forceManyBody())
          .force("collide", d3Force.forceCollide(25))
          .alphaTarget(0.3)
      })

      /**
       * (2) split bubbles by gas.
       * source: (1) start page
       */
      d3.select("#split-bubbles-by-gas").on("click", function () {
        splitGasAnimation(3000, 1.0)
        addGasTextLabels()
      })

      /**
       * (2) split bubbles by gas.
       * source: (3) sector
       */
      d3.select("#split-bubbles-by-gas-back").on("click", function () {
        d3.selectAll(".bubble-title-sector").style("opacity", 1).transition().delay(0).duration(1000).style("opacity", 0)
        d3.selectAll(".bubble-source-sector").style("opacity", 1).transition().delay(0).duration(1000).style("opacity", 0)

        //change color of bubbles by gas
        d3.selectAll(".bubble-FGAS").transition().delay(1600).duration(2800).style("fill", "#ffd763")
        d3.selectAll(".bubble-CH4").transition().delay(1600).duration(2800).style("fill", "#40b79b")
        d3.selectAll(".bubble-C02").transition().delay(1600).duration(2800).style("fill", "#d14aa7")
        d3.selectAll(".bubble-N02").transition().delay(1600).duration(2800).style("fill", "#d37b61")

        splitGasAnimation(4200, 0.94, 600)
        addGasTextLabels()
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
            .force("x", d3Force.forceX(width / 2).strength(0.032))
            .force("y", d3Force.forceY(height / 2).strength(0.032))
            .force("charge", null)
            .alphaTarget(0.012)
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
        var forceXSplitedBySector = d3Force.forceX(function (d) {
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

        setTimeout(function () {
          simulation
            .force("x", forceXSplitedBySector.strength(0.07))
            .force("y", d3Force.forceY(height / 2).strength(0.07))
            .alphaTarget(0.25)
            .restart()
        }, 4000)

        setTimeout(function () {
          simulation.force("x", forceXSplitedBySector.strength(0.08)).force("y", d3Force.forceY(height / 2).strength(0.08))
        }, 9300)

        addSectorTextLabels()
      })

      /**
       * split gas force and animation -> used twice for next and back nav
       */
      function splitGasAnimation(timeout, speedCenter, additionalTime = 0) {
        setTimeout(function () {
          simulation
            .force("collide", d3Force.forceCollide(17))
            .force("charge", null)
            .force("x", d3Force.forceX(width / 2).strength(0.013))
            .force("y", d3Force.forceY(height / 2).strength(0.013))
            .alphaTarget(speedCenter)
            .restart()
        }, 500)

        var forceXSplitedByGas = d3Force.forceX(function (d) {
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

        setTimeout(function () {
          simulation
            .force("x", forceXSplitedByGas.strength(0.024))
            .force("y", d3Force.forceY(height / 2).strength(0.024))
            .force("collide", d3Force.forceCollide(17))
            .force("charge", null)
            .alphaTarget(0.65)
            .restart()
        }, timeout)

        setTimeout(function () {
          simulation.force("x", forceXSplitedByGas.strength(0.018)).force("y", d3Force.forceY(height / 2).strength(0.018))
        }, timeout + additionalTime + 4000)
        setTimeout(function () {
          simulation.force("x", forceXSplitedByGas.strength(0.01)).force("y", d3Force.forceY(height / 2).strength(0.01))
        }, timeout + additionalTime + 4700)
      }

      /**
       * add gas text lables: percentage, gas, source
       */
      function addGasTextLabels() {
        var posFGAS = 0.57
        var posCH4 = 0.64
        var posC02 = 0.74
        var posN02 = 0.6
        var posAdd1 = 0.033
        var posAdd2 = 0.033
        var posAdd3 = 0.02
        //add percentage labels
        addTextLabel("bubble-title-gas bubble-FGAS", width * 0.15, height * posFGAS, "2%", 6000)
        addTextLabel("bubble-title-gas bubble-CH4", width * 0.35, height * posCH4, "16%", 6000)
        addTextLabel("bubble-title-gas bubble-C02", width * 0.6, height * posC02, "76%", 6000)
        addTextLabel("bubble-title-gas bubble-N02", width * 0.83, height * posN02, "6%", 6000)

        //add gas labels
        addTextLabel("bubble-title-gas bubble-FGAS", width * 0.15, height * (posFGAS + posAdd1), t("Climate3_Gas.1"), 6000)
        addTextLabel("bubble-title-gas bubble-CH4", width * 0.35, height * (posCH4 + posAdd1), t("Climate3_Gas.2"), 6000)
        addTextLabel("bubble-title-gas bubble-C02", width * 0.6, height * (posC02 + posAdd1), t("Climate3_Gas.3"), 6000)
        addTextLabel("bubble-title-gas bubble-N02", width * 0.83, height * (posN02 + posAdd1), t("Climate3_Gas.4"), 6000)

        //add gas source
        addTextLabel("bubble-source-gas bubble-FGAS", width * 0.15, height * (posFGAS + posAdd1 + posAdd2), t("Climate3_Gas_Cause.1"), 8000)
        addTextLabel("bubble-source-gas bubble-FGAS", width * 0.15, height * (posFGAS + posAdd1 + posAdd2 + posAdd3), t("Climate3_Gas_Cause.2"), 8000)
        addTextLabel("bubble-source-gas bubble-CH4", width * 0.35, height * (posCH4 + posAdd1 + posAdd2), t("Climate3_Gas_Cause.3"), 8000)
        addTextLabel("bubble-source-gas bubble-CH4", width * 0.35, height * (posCH4 + posAdd1 + posAdd2 + posAdd3), t("Climate3_Gas_Cause.4"), 8000)
        addTextLabel("bubble-source-gas bubble-C02", width * 0.6, height * (posC02 + posAdd1 + posAdd2), t("Climate3_Gas_Cause.5"), 8000)
        addTextLabel("bubble-source-gas bubble-C02", width * 0.6, height * (posC02 + posAdd1 + posAdd2 + posAdd3), t("Climate3_Gas_Cause.6"), 8000)
        addTextLabel("bubble-source-gas bubble-N02", width * 0.83, height * (posN02 + posAdd1 + posAdd2), t("Climate3_Gas_Cause.7"), 8000)
        addTextLabel("bubble-source-gas bubble-N02", width * 0.83, height * (posN02 + posAdd1 + posAdd2 + posAdd3), t("Climate3_Gas_Cause.8"), 8000)
      }

      /**
       * add gas text Lables: percentage, sector, description
       */
      function addSectorTextLabels() {
        var posPercentage = 0.65
        var posSector = posPercentage + 0.033
        var posSource = posSector + 0.033
        var posSource2 = posSource + 0.02
        //add percentage label
        addTextLabel("bubble-title-sector label-electricity", width * 0.15, height * posPercentage, "25%", 6000)
        addTextLabel("bubble-title-sector label-agriculture", width * 0.32, height * posPercentage, "24%", 6000)
        addTextLabel("bubble-title-sector label-industry", width * 0.48, height * posPercentage, "21%", 6000)
        addTextLabel("bubble-title-sector label-transport", width * 0.63, height * posPercentage, "14%", 6000)
        addTextLabel("bubble-title-sector label-other", width * 0.75, height * posPercentage, "10%", 6000)
        addTextLabel("bubble-title-sector label-buildings", width * 0.87, height * posPercentage, "6%", 6000)

        //add sector labels
        addTextLabel("bubble-title-sector label-electricity", width * 0.15, height * posSector, t("Climate3_Sector.1"), 6000)
        addTextLabel("bubble-title-sector label-agriculture", width * 0.32, height * posSector, t("Climate3_Sector.2"), 6000)
        addTextLabel("bubble-title-sector label-industry", width * 0.48, height * posSector, t("Climate3_Sector.3"), 6000)
        addTextLabel("bubble-title-sector label-transport", width * 0.63, height * posSector, t("Climate3_Sector.4"), 6000)
        addTextLabel("bubble-title-sector label-other", width * 0.75, height * posSector, t("Climate3_Sector.5"), 6000)
        addTextLabel("bubble-title-sector label-buildings", width * 0.87, height * posSector, t("Climate3_Sector.6"), 6000)

        //add sector source
        addTextLabel("bubble-source-sector label-electricity", width * 0.15, height * posSource, t("Climate3_Sector_Cause.1"), 8000)
        addTextLabel("bubble-source-sector label-electricity", width * 0.15, height * posSource2, t("Climate3_Sector_Cause.2"), 8000)
        addTextLabel("bubble-source-sector label-agriculture", width * 0.32, height * posSource, t("Climate3_Sector_Cause.3"), 8000)
        addTextLabel("bubble-source-sector label-agriculture", width * 0.32, height * posSource2, t("Climate3_Sector_Cause.4"), 8000)
        addTextLabel("bubble-source-sector label-industry", width * 0.48, height * posSource, t("Climate3_Sector_Cause.5"), 8000)
        addTextLabel("bubble-source-sector label-industry", width * 0.48, height * posSource2, t("Climate3_Sector_Cause.6"), 8000)
        addTextLabel("bubble-source-sector label-transport", width * 0.63, height * posSource, t("Climate3_Sector_Cause.7"), 8000)
        addTextLabel("bubble-source-sector label-transport", width * 0.63, height * posSource2, t("Climate3_Sector_Cause.8"), 8000)
        addTextLabel("bubble-source-sector label-other", width * 0.75, height * posSource, t("Climate3_Sector_Cause.9"), 8000)
        addTextLabel("bubble-source-sector label-other", width * 0.75, height * posSource2, t("Climate3_Sector_Cause.10"), 8000)
        addTextLabel("bubble-source-sector label-buildings", width * 0.87, height * posSource, t("Climate3_Sector_Cause.11"), 8000)
        addTextLabel("bubble-source-sector label-buildings", width * 0.87, height * posSource2, t("Climate3_Sector_Cause.12"), 8000)
      }

      /**
       * add textlabel to a specific position
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
    },
    [height, width, t]
  )

  /**
   * react lifecycle
   */
  useEffect(() => {
    props.setPageNr(3)
    d3.csv(BubbleObjectsPath).then(data => {
      createBubbleChart(data)
    })
  }, [props, createBubbleChart])

  /**
   * adds speach bubble: overview
   * @returns dom element with speech bubble
   */
  function createBubble() {
    return (
      <CSSTransition in={state.overview} timeout={2000} classNames="bubble-fade" unmountOnExit appear>
        <div className="bubble-box bubble-box-climate3">
          <p className="bubble-box-text">
            <span className="question-style">
              <b> {t("Climate3_Bubble_1.1")}</b>
            </span>
            {t("Climate3_Bubble_1.2")}
            {t("Climate3_Bubble_1.3")}
          </p>
        </div>
      </CSSTransition>
    )
  }

  /**
   * adds next navigation button
   * @returns dom element with arrow button right
   */
  function navigationNext() {
    return (
      <div>
        <div className={state.overview ? "show-nav" : "hide-nav"}>
          <div className="navigation-button navigation-next-button">
            <button
              id="split-bubbles-by-gas"
              onClick={() => {
                setState({ overview: false, splitGas: true, splitSector: false })
              }}>
              <img src={ButtonRight} alt="continue"></img>
            </button>
          </div>
        </div>
        <div className={state.splitGas ? "show-nav-delay-8s" : "hide-nav"}>
          <div className="navigation-button navigation-next-button">
            <button
              id="split-bubbles-by-sector"
              onClick={() => {
                setState({ overview: false, splitGas: false, splitSector: true })
              }}>
              <img src={ButtonRight} alt="continue"></img>
            </button>
          </div>
        </div>
        <div className={state.splitSector ? "show-nav-delay-8s" : "hide-nav"}>
          <div className="navigation-button navigation-next-button">
            <button
              onClick={() => {
                props.setPageNr(4)
                history.push(process.env.PUBLIC_URL + "/end")
              }}>
              <img src={ButtonRight} alt="continue"></img>
            </button>
          </div>
        </div>
      </div>
    )
  }

  /**
   * adds back navigation button
   * @returns dom element with arrow button left
   */
  function navigationBack() {
    return (
      <div>
        <div className={state.overview ? "show-nav" : "hide-nav"}>
          <div className="navigation-button navigation-back-button">
            <button
              onClick={() => {
                props.setPageNr(2)
                history.push(process.env.PUBLIC_URL + "/snowline")
              }}>
              <img src={ButtonLeft} alt="continue"></img>
            </button>
          </div>
        </div>

        <div className={state.splitGas ? "show-nav-delay-8s" : "hide-nav"}>
          <div className="navigation-button navigation-back-button">
            <button
              id="inital-bubble-animation-back"
              onClick={() => {
                setState({ overview: true, splitGas: false, splitSector: false })
              }}>
              <img src={ButtonLeft} alt="continue"></img>
            </button>
          </div>
        </div>

        <div className={state.splitSector ? "show-nav-delay-8s" : "hide-nav"}>
          <div className="navigation-button navigation-back-button">
            <button
              id="split-bubbles-by-gas-back"
              onClick={() => {
                setState({ overview: false, splitGas: true, splitSector: false })
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
      <CSSTransition in={true} timeout={10000} classNames="fade" unmountOnExit appear>
        <div>
          {createBubble()}
          {navigationNext()}
          {navigationBack()}
          <svg className="svg-container" width={width} height={height}>
            <g ref={svgRef}></g>
          </svg>
          <h1> {t("Climate3_Title.1")}</h1>
          {state.overview ? <h2 className="subtitle">{t("Climate3_Title.2")}</h2> : ""}
          {state.splitGas ? (
            <div className="show-subtitles">
              <h2 className="subtitle show-textbox">{t("Climate3_Title.3")}</h2>
            </div>
          ) : (
            ""
          )}
          {state.splitSector ? (
            <div className="show-subtitles">
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