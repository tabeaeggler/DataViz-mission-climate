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
  var width = 1200,
    height = 550

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
          } else if (d.type === "N20") {
            return width * 0.24
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

      svg
        .append("text")
        .attr("class", "bubble-title bubble-FGAS")
        .attr("x", width * 0.03)
        .attr("y", 235)
        .text("F-Gas")
        .style("opacity", 0)
        .transition()
        .delay(3500)
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1)

      svg
        .append("text")
        .attr("class", "bubble-title bubble-N20")
        .attr("x", width * 0.23)
        .attr("y", 210)
        .text("N20")
        .style("opacity", 0)
        .transition()
        .delay(3500)
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1)

      svg
        .append("text")
        .attr("class", "bubble-title bubble-C02")
        .attr("x", width * 0.53)
        .attr("y", 90)
        .text("C02")
        .style("opacity", 0)
        .transition()
        .delay(3500)
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1)

      svg
        .append("text")
        .attr("class", "bubble-title bubble-CH4")
        .attr("x", width * 0.88)
        .attr("y", 180)
        .text("Methan CH4")
        .style("opacity", 0)
        .transition()
        .delay(3500)
        .duration(1000)
        .ease(d3.easeLinear)
        .style("opacity", 1)
    })

    //Split bubbles by sector
    d3.select("#split-bubbles-by-sector").on("click", function () {
      console.log("by sector") //Doesn't work
      d3.selectAll(".bubble-CH4").remove()
    })

    //remove hide-class
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
      <CSSTransition
        in={textboxes.random}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate3-txtbox1">
          <p className="bubble-box-text">
            Hauptsächlich sind die Treibhausgase verantowrtlich für den
            Klimawandel...
          </p>
          <button
            id="next-button"
            id="split-bubbles-by-gas"
            onClick={() => {
              //createbuble2 einblenden -> hide-textbox remove
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
          <p className="bubble-box-text">
            Dabei wird das Gas C02 am Meisten ausgestossen...
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
      <CSSTransition
        in={true}
        timeout={100000}
        classNames="fade"
        unmountOnExit
        appear>
        <div>
          <h1 className="climate2-title"> {t("Climate2_Title.1")}</h1>
          <h2 className="climate2-subtitle">{t("Climate2_Title.2")}</h2>
          {createBubble1()}
          {createBubble2()}

          <svg className="svg-container" width={width} height={height}>
            <g ref={svgRef}></g>
          </svg>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate3

//Zoom tries

/*

       const zoom = d3.zoom()
      //.translate([0, 0])
      //.scale(1)
      //.scaleExtent([.5, 20])
      .on("zoom", zoomed);
      
  svg.call(zoom);
  
  function zoomed() {
    svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

    d3.select("#split-bubbles-by-sector").on("click", function() {
      svg.transition()
        .call(zoom
              .translate([400, 200])
              .scale(5).event
        );
    })



     const zoom = d3Zoom.zoom()
                  .scaleExtent([1, 10])
                  .translate([0, 0])
                  .scale(1)
                  .on("zoom", zoomed);

      svg.call(zoom)

      function zoomed() {
        svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }
    
        //Zoom
    var zoom = d3.zoom()
    .on("zoom", zoomed)

    let zoomTrandform = null

    function zoomed(){
      zoomTrandform = d3.event.transform
    }

    d3.select("#split-bubbles-by-sector").on("click", function() {
      svg.call(zoom.translateTo, 50, 50)
      .transition()
      .duration(2000)
      .call(zoom.scaleTo, 2)
    })
    */
