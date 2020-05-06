import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import Slider from "rc-slider"
import Tooltip from "rc-slider"
import SliderWithTooltip from "rc-slider"
import LakeGraph from "./LakeGraph"
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
    percentage: 5,
    volumePercentage: 6.5,
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
        <p>
          {(100 - percentageLabel.percentage).toFixed(0)} % des Volumens von
          1850.
        </p>
        <p>
          Dies entspricht einem Gesamtvolument von{" "}
          {(dataVolume.data_1850 - percentageLabel.volumePercentage).toFixed(0)}{" "}
          km <sup>3</sup>
        </p>
        <button className="submit-button" onClick={() => ""}>
          {t("Climate2_Submit_Button")}
        </button>
      </div>
    )
  }

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
            max={80}
            value={percentageLabel.percentage}
            onChange={handleSliderChange}
          />
          {showPercentageLabel()}
        </div>
      </CSSTransition>
    )
  }

  return (
    <React.Fragment>
      <div className="glacier-container">
        {createBubbleStartQuizz()}
        <LakeGraph props={6}></LakeGraph>
        <h6 className="source-climate2">{t("Climate2_Source_Glacier")}</h6>
      </div>
    </React.Fragment>
  )
}

export default GlacierMeltOverview
