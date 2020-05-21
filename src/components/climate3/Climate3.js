import React, { useState, useEffect, useRef } from "react"
import * as d3 from "d3"
import * as d3Force from "d3-force"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import BubbleObjectsPath from "../../assets/data_climate3/bubble_objects.csv"
import "./climate3.css"

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
        return `bubble-${d.sector} bubble-${d.type} `
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
      var forceXSplitedByGas = d3Force
        .forceX(function (d) {
          if (d.type === "FGAS") {
            return width * 0.05
          } else if (d.type === "CH4") {
            return width * 0.29
          } else if (d.type === "N02") {
            return width * 0.9
          } else {
            return width * 0.6
          }
        })
        .strength(0.27)

      simulation
        .force("x", forceXSplitedByGas) //center bubbles on x-axis
        .force("y", d3Force.forceY(height / 2).strength(0.27)) //center bubbles on y-axis
        .force("charge", d3Force.forceManyBody())
        .alphaTarget(0.07) //move speed
        .restart() //restart simulatin with new force

      //Add gastext labels
      addTextLabel("bubble-title-gas bubble-FGAS", width * 0.0, 410, "Fluorierte Gase")
      addTextLabel("bubble-title-gas bubble-CH4", width * 0.25, 470, "Methan CH4")
      addTextLabel("bubble-title-gas bubble-C02", width * 0.52, 560, "Kohlenstoffdioxid C02")
      addTextLabel("bubble-title-gas bubble-N02", width * 0.82, 440, "Stickstoffdioxid N02")
    })

    //Split bubbles by sector
    d3.select("#split-bubbles-by-sector").on("click", function () {
      //center all bubbles
      setTimeout(function () {
        simulation
          .force("x", d3Force.forceX(width / 2).strength(0.06))
          .force("y", d3Force.forceY(height / 2).strength(0.06))
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
      d3.selectAll(".bubble-Electricity").transition().delay(1600).duration(2000).style("fill", "white")
      d3.selectAll(".bubble-Agriculture").transition().delay(1600).duration(2000).style("fill", "#f6e4df")
      d3.selectAll(".bubble-Industry").transition().delay(1600).duration(2000).style("fill", "#edcabf")
      d3.selectAll(".bubble-Transport").transition().delay(1600).duration(2000).style("fill", "#e4afa0")
      d3.selectAll(".bubble-Other").transition().delay(1600).duration(2000).style("fill", "#db9580")
      d3.selectAll(".bubble-Buildings").transition().delay(1600).duration(2000).style("fill", "#d37b61")

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

      //Add sector labels and change bubble color
      addTextLabel("bubble-title-gas label-electricity", width * 0.06, 500, "Electricity", 6000)
      addTextLabel("bubble-title-gas label-agriculture", width * 0.26, 500, "Agriculture", 6000)
      addTextLabel("bubble-title-gas label-industry", width * 0.47, 500, "Industry", 6000)
      addTextLabel("bubble-title-gas label-transport", width * 0.64, 500, "Transport", 6000)
      addTextLabel("bubble-title-gas label-other", width * 0.8, 500, "Other", 6000)
      addTextLabel("bubble-title-gas label-buildings", width * 0.92, 500, "Buildings", 6000)
    })

    //Function to display textlabels
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

  function createBubble1() {
    return (
      <div className={textboxes.random ? "show-textbox" : "hide-textbox"}>
        <div className="bubble-box bubble-box-climate3-txtbox1">
          <p className="bubble-box-text">
            Der Mensch ist hauptverantwortlich für den Klimawandel. Hierbei spielen Treibhausgase die
            wichtigste Rolle, welche unter anderem beim Verbrauch von Strom, Gas und Benzin entstehen.
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

  function createBubble2() {
    return (
      <div className={textboxes.splitGas ? "show-textbox" : "hide-textbox"}>
        <div className="bubble-box bubble-box-climate3-txtbox2">
          <p className="bubble-box-text">
            Die verschiedenen Gase tragen nicht in gleichem Masse zum Treibhauseffekt bei. Um die Wirkung
            verschiedener Treibhausgase vergleichbar zu machen, wurde die Einheit der CO₂-Äquivalente
            eingeführt. Beispielsweise ist No2 300 mal wirksamer als Co2.
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

  function createBubble3() {
    return (
      <div className={textboxes.splitC02 ? "show-textbox" : "hide-textbox"}>
        <div className="bubble-box bubble-box-climate3-txtbox3">
          <p className="bubble-box-text">
            In der vorhergehenden Betrachtung wurden die Anteile der verschiedenen Treibhausgase aller
            menschengemachten Emissionen gezeigt. Der Ausstoss lässt sich auch nach Sektoren aufschlüsseln.
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
          <h2 className="subtitle">
            {textboxes.splitC02
              ? "- Auf welche Sektoren sind die Treibhausgase zurückzuführen? -"
              : "- Welche Treibhausgase werden ausgestossen? -"}
          </h2>
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
