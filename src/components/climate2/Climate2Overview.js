import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import SnowLineOverview from "./SnowLineOverview"
import GlacierMeltOverview2 from "./GlacierMeltOverview2"

function Climate1Overview() {
  const { t } = useTranslation()
  const [showInteraction, setShowInteraction] = useState(false)

  return (
    <React.Fragment>
      <CSSTransition
        in={true}
        timeout={1500}
        classNames="zoom-in-landscape"
        unmountOnExit
        appear
        onEntered={() => setShowInteraction(true)}>
        <div className={"landscape-container"}>
          <SnowLineOverview
            showInteraction={showInteraction}></SnowLineOverview>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default Climate1Overview
