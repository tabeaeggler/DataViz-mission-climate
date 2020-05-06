import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import LakeGraph from "./LakeGraph"

function GlacierMeltOverview() {
  //transaltion
  const { t } = useTranslation()

  //svg sizing
  const svgRef = useRef()
  const width = 700
  const height = 550
  const margin = 98
  const mountainHeight = 2200

  //state
  const [showAnswer, setShowAnswer] = useState(false)
  const [nextPage, setNextPage] = useState(false)

  /**
   * Adds Speach Bubble with text for Globe
   */
  function createBubbleStartQuizz() {
    return (
      <CSSTransition
        in={!showAnswer}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate2-glacier-start">
          <p className="bubble-box-text">
            Die Gletscher schmelzen immer mehr. Um wieviel ist der Gletscher im
            Jahr 2019 seit 1850 zurückgegeangen?
          </p>
          
        </div>
      </CSSTransition>
    )
  }

  return (
    <React.Fragment>
      <div className="glacier-container">
        {createBubbleStartQuizz()}
        <LakeGraph scaleFactor={6}></LakeGraph>
      </div>
    </React.Fragment>
  )
}

export default GlacierMeltOverview
