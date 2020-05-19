import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import SnowLineOverview from "./SnowLineOverview"
import GlacierMeltOverview2 from "./GlacierMeltOverview2"

function Climate1Overview() {
  const { t } = useTranslation()
  const [showInteraction, setShowInteraction] = useState(false)
  const [showMountain, setShowMountain] = useState(true)

  function showGlacier() {
    setShowInteraction(false)
    setShowMountain(false)
  }

  return (
    <React.Fragment>
      <CSSTransition
        in={showMountain}
        timeout={{enter:1500, exit:2000}}
        classNames="zoom-in-landscape"
        unmountOnExit={false}
        appear
        onEntered={() => setShowInteraction(true)}
        onExit={() => setShowInteraction(false)}>
        <div className={"landscape-container"}>
          <SnowLineOverview
            showInteraction={showInteraction}
            showGlacier={showGlacier}></SnowLineOverview>
          <GlacierMeltOverview2 showInteraction={!showInteraction}></GlacierMeltOverview2>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate1Overview
