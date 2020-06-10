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

  return (
      <CSSTransition
        in={showSnowlineGraph}
        timeout={{enter:1500, exit:2000}}
        classNames="zoom-in-landscape"
        unmountOnExit={false}
        appear
        onEntered={() => setShowSnowlineInteraction(true)}
        onExit={() => setShowSnowlineInteraction(false)}>
        <div className="landscape-container">
          <SnowLineOverview
            showSnowlineInteraction={showSnowlineInteraction}
            setShowSnowlineGraph={setShowSnowlineGraph}></SnowLineOverview>
          <GlacierOverview showGlacierInteraction={!showSnowlineGraph}></GlacierOverview>
        </div>
      </CSSTransition>
  )
}

export default Climate2
