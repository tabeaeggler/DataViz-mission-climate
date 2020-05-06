import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import Slider from "rc-slider"
import Tooltip from "rc-slider"
import SliderWithTooltip from "rc-slider"

import {
  select,
  scaleLinear,
  drag,
  event,
  easeQuad,
  easeCubic,
  easeLinear,
} from "d3"
import "rc-slider/assets/index.css"
import "rc-tooltip/assets/bootstrap.css"

function GlacierMeltOverview() {
  //transaltion
  const { t } = useTranslation()

  //svg sizing
  const svgRef = useRef()

  //state
  const [showAnswer, setShowAnswer] = useState(false)
  const [nextPage, setNextPage] = useState(false)
  const [percentageLabel, setPercentageLabel] = useState({
    percentage: 10,
    volumePercentage: 13,
  })
  const [dataVolume, setDataVolume] = useState({
    data_1850: 130,
    data_2019: 50.645,
  })

  function handleSliderChange(p) {
    setPercentageLabel({
      percentage: p,
      volumePercentage: (dataVolume.data_1850 * p) / 100,
    })
  }

  function showPercentageLabel() {
    return (
      <div>
        <p>{percentageLabel.percentage} % Rückgang</p>
        <p>
          {percentageLabel.volumePercentage} km<sup>3</sup> Rückgang
        </p>
      </div>
    )
  }

  function showVolumeLabel() {}

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
          <Slider
            value={percentageLabel.percentage}
            onChange={handleSliderChange}
          />
          {showPercentageLabel()}
          {showVolumeLabel()}
        </div>
      </CSSTransition>
    )
  }

  return (
    <React.Fragment>
      <div className="glacier-container">
        {createBubbleStartQuizz()}
        <svg className="glacier-graph" width={500}>
          <g ref={svgRef}></g>
        </svg>
      </div>
    </React.Fragment>
  )
}

export default GlacierMeltOverview
