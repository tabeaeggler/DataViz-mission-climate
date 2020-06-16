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
  const [navigateBack, setNavigateBack] = useState(false)

  console.log(navigateBack)

  return (
    <React.Fragment>
      <CSSTransition
        in={showSnowlineGraph}
        timeout={{ enter: 1500, exit: 2000 }}
        classNames={navigateBack ? "zoom-back" : "zoom-in-landscape"}
        unmountOnExit={false}
        appear
        onEntered={() =>  setShowSnowlineInteraction(true)}
        onExit={() => {
          setNavigateBack(false)
          setShowSnowlineGraph(false)
        }}>
        <div className="landscape-container">
          <SnowLineOverview
            showSnowlineInteraction={showSnowlineInteraction}
            setShowSnowlineGraph={setShowSnowlineGraph}
            showSnowlineGraph={showSnowlineGraph}></SnowLineOverview>
          <GlacierOverview
            setNavigateBack={setNavigateBack}
            setShowSnowlineGraph={setShowSnowlineGraph}
            showSnowlineGraph={showSnowlineGraph}
            showGlacierInteraction={!showSnowlineGraph}></GlacierOverview>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate2
