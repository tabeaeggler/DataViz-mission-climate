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
  const svgRef = useRef()
  var width = 1600,
    height = 800

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
    var simulation = d3Force.forceSimulation().force("collide", d3Force.forceCollide(17)) //no overlapping -> radius of area collision to avoid

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
      .force("y", d3Force.forceY(d => width * d.cluster1Y).strength(0.01))
      .force("charge", d3Force.forceManyBody())
      .force("collide", d3Force.forceCollide(25))
      .alphaTarget(0.09)
      .restart()

    //initial animation cluster2 simulation
    setTimeout(function () {
      simulation
        .force("x", d3Force.forceX(d => width * d.cluster2X).strength(0.01))
        .force("y", d3Force.forceX(d => width * d.cluster2Y).strength(0.01))
        .force("charge", d3Force.forceManyBody())
        .force("collide", d3Force.forceCollide(33))
        .alphaTarget(0.09)
        .restart()
    }, 12000)

    //initial animation cluster3 simulation
    setTimeout(function () {
      simulation
        .force("x", d3Force.forceX(d => width * d.cluster3X).strength(0.02))
        .force("y", d3Force.forceY(d => width * d.cluster3Y).strength(0.02))
        .force("charge", d3Force.forceManyBody())
        .force("collide", d3Force.forceCollide(30))
        .alphaTarget(0.09)
        .restart()
    }, 24000)

    //split bubbles by gas
    d3.select("#split-bubbles-by-gas").on("click", function () {
      var forceXSplitedByGas = d3Force
        .forceX(function (d) {
          if (d.type === "FGAS") {
            return width * 0.1
          } else if (d.type === "CH4") {
            return width * 0.33
          } else if (d.type === "N02") {
            return width * 0.88
          } else {
            return width * 0.61
          }
        })
        .strength(0.27)

      simulation
        .force("x", forceXSplitedByGas) //center bubbles on x-axis
        .force("y", d3Force.forceY(height / 2).strength(0.27)) //center bubbles on y-axis
        .force("charge", d3Force.forceManyBody())
        .alphaTarget(0.07) //move speed
        .restart() //restart simulatin with new force

      //add gas labels
      addTextLabel("bubble-title-gas bubble-FGAS", width * 0.09, 410, t("Climate3_Gas.1"))
      addTextLabel("bubble-title-gas bubble-CH4", width * 0.31, 470, t("Climate3_Gas.2"))
      addTextLabel("bubble-title-gas bubble-C02", width * 0.62, 560, t("Climate3_Gas.3"))
      addTextLabel("bubble-title-gas bubble-N02", width * 0.9, 440, t("Climate3_Gas.4"))

      //add percentage labels
      addTextLabel("bubble-title-gas bubble-FGAS", width * 0.09, 440, "2%", 5500)
      addTextLabel("bubble-title-gas bubble-CH4", width * 0.31, 500, "16%", 5500)
      addTextLabel("bubble-title-gas bubble-C02", width * 0.62, 590, "76%", 5500)
      addTextLabel("bubble-title-gas bubble-N02", width * 0.9, 470, "6%", 5500)
    })

    //split bubbles by sector
    d3.select("#split-bubbles-by-sector").on("click", function () {
      //center all bubbles
      setTimeout(function () {
        simulation
          .force("x", d3Force.forceX(width / 2).strength(0.05))
          .force("y", d3Force.forceY(height / 2).strength(0.05))
          .force("charge", null)
          .alphaTarget(0.15)
          .restart()
      }, 500)

      //remove gas text labels
      d3.selectAll(".bubble-title-gas")
        .style("opacity", 1)
        .transition()
        .delay(0.5)
        .duration(2000)
        .style("opacity", 0)

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
            return width * 0.1
          } else if (d.sector === "Agriculture") {
            return width * 0.3
          } else if (d.sector === "Industry") {
            return width * 0.5
          } else if (d.sector === "Transport") {
            return width * 0.68
          } else if (d.sector === "Other") {
            return width * 0.83
          } else if (d.sector === "Buildings") {
            return width * 0.95
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

      //add sector labels
      addTextLabel("bubble-title-gas label-electricity", width * 0.09, 500, t("Climate3_Sector.1"), 6000)
      addTextLabel("bubble-title-gas label-agriculture", width * 0.3, 500, t("Climate3_Sector.2"), 6000)
      addTextLabel("bubble-title-gas label-industry", width * 0.5, 500, t("Climate3_Sector.3"), 6000)
      addTextLabel("bubble-title-gas label-transport", width * 0.68, 500, t("Climate3_Sector.4"), 6000)
      addTextLabel("bubble-title-gas label-other", width * 0.83, 500, t("Climate3_Sector.5"), 6000)
      addTextLabel("bubble-title-gas label-buildings", width * 0.95, 500, t("Climate3_Sector.6"), 6000)

      //add percentage label
      addTextLabel("bubble-title-gas label-electricity", width * 0.09, 530, "25%", 8500)
      addTextLabel("bubble-title-gas label-agriculture", width * 0.3, 530, "24%", 8500)
      addTextLabel("bubble-title-gas label-industry", width * 0.5, 530, "21%", 8500)
      addTextLabel("bubble-title-gas label-transport", width * 0.68, 530, "14%", 8500)
      addTextLabel("bubble-title-gas label-other", width * 0.83, 530, "10%", 8500)
      addTextLabel("bubble-title-gas label-buildings", width * 0.95, 530, "6%", 8500)
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
      <div className={textboxes.random ? "show-textbox" : "hide-textbox"}>
        <div className="bubble-box bubble-box-climate3-txtbox1">
          <p className="bubble-box-text">
            <b>{t("Climate3_Bubble_1.1")}</b>
            {t("Climate3_Bubble_1.2")}
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
      </div>
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
          <p className="bubble-box-text">
            {t("Climate3_Bubble_2.1")}
            <b>{t("Climate3_Bubble_2.2")}</b>
            {t("Climate3_Bubble_2.3")}
          </p>
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
          <p className="bubble-box-text">
            {t("Climate3_Bubble_3.1")}
            <b>{t("Climate3_Bubble_3.2")}</b>
          </p>
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
          <h1 className="title"> {t("Climate3_Title.1")}</h1>

          {textboxes.random ? <h2 className="subtitle">{t("Climate3_Title.2")}</h2> : ""}
          {textboxes.splitGas ? <h2 className="subtitle">{t("Climate3_Title.3")}</h2> : ""}
          {textboxes.splitC02 ? <h2 className="subtitle">{t("Climate3_Title.4")}</h2> : ""}
          {createBubble1()}
          {createBubble2()}
          {createBubble3()}
          <svg className="svg-container" width={width} height={height}>
            <g ref={svgRef}></g>
          </svg>
          <h6 className="source">{t("Climate3_Source")}</h6>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate3
