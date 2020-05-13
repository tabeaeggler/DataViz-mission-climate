import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import Slider from "rc-slider"
import GlacierGraph from "./GlacierGraph"
import "rc-slider/assets/index.css"
import "rc-tooltip/assets/bootstrap.css"

function GlacierMeltOverview2() {
  //transaltion
  const { t } = useTranslation()

  //state
  const [showAnswer, setShowAnswer] = useState(false)
  const [nextPage, setNextPage] = useState(false)
  const [percentageLabel, setPercentageLabel] = useState({
    percentageDecrease: 0,
    currentVolume: 130,
  })
  const [scaleFactor, setScaleFactor] = useState(0)
  const [scaleFactorEstimation, setScaleFactorEstimation] = useState(0)

  const [dataVolume, setDataVolume] = useState({
    data_1850: 130,
    data_2019: 50.645,
  })

  const solutionVolume = 39
  const solutionIce = 51

  function handleSliderChange(p) {
    setPercentageLabel({
      percentageDecrease: p,
      currentVolume: dataVolume.data_1850 - (dataVolume.data_1850 * p) / 100,
    })
    setScaleFactor(calculateScaleFactor(p))
  }

  function calculateScaleFactor(p) {
    //Source: https://en.wikipedia.org/wiki/Water
    const densityWater = 997
    //Source: https://de.wikipedia.org/wiki/Eis
    const densityIce = 918
    //Source: https://en.wikipedia.org/wiki/Lake_Lucerne
    const volumeLakeLucern = 11.8

    var newCurrentVolume =
      dataVolume.data_1850 - (dataVolume.data_1850 * p) / 100

    var difference = dataVolume.data_1850 - newCurrentVolume
    var conversionIceToWater = (densityIce * difference) / densityWater
    var scaleFactor = conversionIceToWater / volumeLakeLucern

    return scaleFactor
  }

  function showResult() {
    setShowAnswer(true)
    setScaleFactorEstimation(scaleFactor)
    setScaleFactor(6.2)
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
            <span className="question-style">
              {t("Climate2_Bubble_Glacier.1")}
            </span>{" "}
            {t("Climate2_Bubble_Glacier.2")}
          </p>
        </div>
      </CSSTransition>
    )
  }
  function createBubbleShowAnswer() {
    return (
      <CSSTransition
        in={showAnswer}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate2-glacier-answer">
          <p className="bubble-box-text extra-line-spacing">
            <b>
              {t("Climate2_Bubble_Glacier.3")}
              <span className="text-solution-bold">{solutionVolume} % </span>
              {t("Climate2_Bubble_Glacier.4")}
            </b>
            {t("Climate2_Bubble_Glacier.5")}
            <b>
              <span className="text-solution-bold">{solutionIce} km&sup3;</span>
            </b>
            {t("Climate2_Bubble_Glacier.6")}
            <b>
              <span className="text-solution-bold">{scaleFactor} x</span>
            </b>
            {t("Climate2_Bubble_Glacier.7")}

            {t("Climate2_Bubble_Glacier.8")}
          </p>
          <button id="next-button">
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  function showSliderAndNumbers() {
    return (
      <CSSTransition
        in={!showAnswer}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="slider-container-glacier">
          <Slider
            max="80"
            value={percentageLabel.percentageDecrease}
            onChange={handleSliderChange}
          />
          <div className="slider-text-volume">
            <p className="slider-text-bold">
              {percentageLabel.percentageDecrease.toFixed(0)} %
            </p>
            <p className="slider-text-small"> {t("Climate2_Slider.1")}</p>
          </div>
          <div className="slider-text-ice">
            <p className="slider-text-bold">
              {(dataVolume.data_1850 - percentageLabel.currentVolume).toFixed(
                0
              )}{" "}
              km&sup3;
            </p>
            <p className="slider-text-small">{t("Climate2_Slider.2")}</p>
            <button
              className="submit-button submit-button-glacier"
              onClick={() => showResult()}>
              {t("Climate2_Submit_Button")}
            </button>
          </div>
          <div className="slider-text-scaleFactor">
            <p className="slider-text-bold">{scaleFactor.toFixed(1)} x</p>
            <p className="slider-text-small">{t("Climate2_Slider.3")}</p>
          </div>
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
          <h1 className="title"> {t("Climate2_Title.1")}</h1>
          <h2 className="subtitle">{t("Climate2_Title.3")}</h2>
          <div className="glacier-container">
            {createBubbleStartQuizz()}
            {createBubbleShowAnswer()}
            <GlacierGraph
              scaleFactor={scaleFactor}
              showAnswer={showAnswer}
              scaleFactorEstimation={scaleFactorEstimation}></GlacierGraph>
            {showSliderAndNumbers()}
            <h6 className="source">{t("Climate2_Source_Glacier")}</h6>
          </div>
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default GlacierMeltOverview2
