import React, { useState } from "react"
import { CSSTransition } from "react-transition-group"
import SnowLineOverview from "./SnowLineOverview"
import GlacierOverview from "./GlacierOverview"
import "./climate2.css"

/**
 * Assembles all elements of climate2 screen
 */
function Climate2() {
  //states
  const [showSnowlineInteraction, setShowSnowlineInteraction] = useState(false)
  const [showSnowlineGraph, setShowSnowlineGraph] = useState(true)
  const [navigateBackToSnowline, setNavigateBackToSnowline] = useState(false)

  return (
    <React.Fragment>
      <CSSTransition
        in={showSnowlineGraph}
        timeout={{ enter: 1500, exit: 2000 }}
        classNames={navigateBackToSnowline ? "zoom-back" : "zoom-in-landscape"}
        unmountOnExit={false}
        appear
        onEntered={() =>  setShowSnowlineInteraction(true)}
        onExit={() => {
          setNavigateBackToSnowline(false)
          setShowSnowlineGraph(false)
        }}>
        <div className="landscape-container">
          <SnowLineOverview
            showSnowlineInteraction={showSnowlineInteraction}
            setShowSnowlineGraph={setShowSnowlineGraph}
            showSnowlineGraph={showSnowlineGraph}></SnowLineOverview>
          <GlacierOverview
            setNavigateBackToSnowline={setNavigateBackToSnowline}
            setShowSnowlineGraph={setShowSnowlineGraph}
            showSnowlineGraph={showSnowlineGraph}
            showGlacierInteraction={!showSnowlineGraph}></GlacierOverview>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate2
