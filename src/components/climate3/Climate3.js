import React, {useState, useEffect, useRef} from "react"
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
  const [textboxes, setTextboxes] = useState({random: true, splitGas: false, splitC02: false})
  const svgRef = useRef()
  var width = 1200,
  height = 550;


  function createBubbleChart(data) {
    const svg = d3.select(svgRef.current)

    //set bubble position and radius
    var padding = 4;
    for (var i = 0; i < data.length; i++) {
        data[i].radius = 11;
        data[i].x = Math.random() * width;
        data[i].y = Math.random() * height;
    }
  
    //create circles
    var circles = svg
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
            .attr("class", function(d) {
              return "bubble-" + d.type;
            })
            .attr('r', function(d) {
                return d.radius;
            });
  


    //applies forces to every single circle  
    var simulation = d3Force.forceSimulation()
          .force("x",  d3Force.forceX(width/2).strength(0.035)) //center bubbles on x-axis
          .force("y", d3Force.forceY(height/2).strength(0.035)) //center bubbles on y-axis
          .force("collide", d3Force.forceCollide(17)) //no overlapping -> radius of area collision to avoid
  

    //update position after tick
    simulation.nodes(data).on('tick', ticked)
    function ticked() {
        circles
          .attr("cx", function(d){
            return d.x
          })
          .attr("cy", function(d){
            return d.y
          })
    }
  
    d3.select("#split-bubbles-by-gas").on("click", function() {
      //Here it works
      var forceXSplitedByGas = d3Force.forceX(function(d){
        if(d.type === "FGAS") {
            return width * 0.05
        }
        else if(d.type === "N20") {
          return width * 0.24
        }
        else if(d.type === "CH4") {
          return width * 0.9
        }
        else {
          return width * 0.55
        }
     }).strength(0.08)

      simulation
      .force("x", forceXSplitedByGas) //center bubbles on x-axis
      .force("y", d3Force.forceY(height/2).strength(0.08)) //center bubbles on y-axis
      .force("collide", d3Force.forceCollide(17)) //no overlapping -> radius of area collision to avoid
      .alphaTarget(0.2) //move speed
      .restart() //restart simulatin with new force
    })


  //Zoom
  d3.select("#split-bubbles-by-sectir").on("click", function() {
    console.log("hihi") //Doesn't work
    d3.selectAll('.bubble-CH4').remove();
  })



}
  


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
        <div className="bubble-box bubble-box-climate2-answer">
          <p className="bubble-box-text">
            Hauptsächlich sind die Treibhausgase verantowrtlich für den Klimawandel...
          </p>
          <button id="next-button" id="split-bubbles-by-gas" onClick={() => setTextboxes({random: false, splitGas: true, splitC02: false})}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  function createBubble2() {
    return (
      <CSSTransition
        in={textboxes.splitGas}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate2-answer">
          <p className="bubble-box-text">
            Dabei wird das Gas C02 am Meisten ausgestossen...
          </p>
          <button id="next-button" id="split-bubbles-by-sector" onClick={() => setTextboxes({random: false, splitGas: false, splitC02: true})}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
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
