import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import Slider from "rc-slider"
import GlacierGraph from "./GlacierGraph"
import history from "../../routing/history"
import "rc-slider/assets/index.css"
import "rc-tooltip/assets/bootstrap.css"
import "./climate2.css"

/**
 * Creates context for a scalable glacier graph with speech bubbles and slider
 */
const GlacierMeltOverview2 = props => {
  //transaltion
  const { t } = useTranslation()

  //state
  const [showAnswer, setShowAnswer] = useState(false)
  // const [nextPage, setNextPage] = useState(false)
  const [percentageLabel, setPercentageLabel] = useState({
    percentageDecrease: 0,
    currentVolume: 130,
  })
  const [scaleLake, setScaleLake] = useState(0)
  const [scaleFactorEstimation, setScaleFactorEstimation] = useState(0)

  const dataVolume = {
    data_1850: 130,
    data_2019: 50.645,
  }

  //solutions
  const solutionVolume = 61
  const solutionIce = 51

  /**
   * Handles slider interaction. Sets new percentage and scale of lake.
   * @param {number} percentage
   */
  function handleSliderChange(percentage) {
    setPercentageLabel({
      percentageDecrease: percentage,
      currentVolume: dataVolume.data_1850 - (dataVolume.data_1850 * percentage) / 100,
    })
    setScaleLake(calculateScaleFactor(percentage))
  }

  /**
   * Calculates scale of lake
   * @returns {number} scale of lake
   */
  function calculateScaleFactor(percentage) {
    //Source: https://en.wikipedia.org/wiki/Water
    const densityWater = 997
    //Source: https://de.wikipedia.org/wiki/Eis
    const densityIce = 918
    //Source: https://en.wikipedia.org/wiki/Lake_Lucerne
    const volumeLakeLucern = 11.8

    var newCurrentVolume = dataVolume.data_1850 - (dataVolume.data_1850 * percentage) / 100
    var difference = dataVolume.data_1850 - newCurrentVolume
    var conversionIceToWater = (densityIce * difference) / densityWater
    var scaleFactor = conversionIceToWater / volumeLakeLucern

    return scaleFactor
  }

  /**
   * Handles submit event
   */
  function showResult() {
    const resultPercentage = 61

    setShowAnswer(true)
    setScaleFactorEstimation(calculatePercentage())
    setPercentageLabel({
      percentageDecrease: resultPercentage,
    })
    setScaleLake(calculateScaleFactor(resultPercentage))
  }

  /**
   * Calculates percentage of remaining glacier volume according to the current volume decrease
   * @returns {number} perscentage of remaining glacier volume
   */
  function calculatePercentage() {
    return (100 - percentageLabel.percentageDecrease) * 0.01
  }

  /**
   * Adds Speach Bubble for showing glacier quizz question
   * @returns dom element with speech bubble
   */
  function createBubbleStartQuizz() {
    return (
      <CSSTransition in={!showAnswer} timeout={4000} classNames="bubble-fade" unmountOnExit appear>
        <div className="glacier-zoom bubble-box bubble-box-glacier-start">
          <p className="bubble-box-text">
            <b>
              <span className="question-style">{t("Climate2_Bubble_Glacier.1")}</span>
            </b>
            {t("Climate2_Bubble_Glacier.2")}
          </p>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Adds Speach Bubble for showing glacier quizz answer
   * @returns dom element with speech bubble text
   */
  function createBubbleShowAnswer() {
    return (
      <CSSTransition in={showAnswer} timeout={4000} classNames="bubble-fade" unmountOnExit appear>
        <div className="bubble-box bubble-box-glacier-answer">
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
              <span className="text-solution-bold">{scaleLake.toFixed(1)} x</span>
            </b>
            {t("Climate2_Bubble_Glacier.7")}

            {t("Climate2_Bubble_Glacier.8")}
          </p>
          <button
            id="next-button"
            onClick={() => {
              history.push("/Cause")
            }}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Adds slider and glacier attributes
   * @returns dom element with slider and glacier attributes
   */
  function showSliderAndNumbers() {
    return (
      <CSSTransition in={!showAnswer} timeout={4000} classNames="bubble-fade" unmountOnExit appear>
        <div className="slider-container-glacier">
          <Slider max="90" value={percentageLabel.percentageDecrease} onChange={handleSliderChange} />
          <div className="glacier-zoom slider-text-volume">
            <p className="slider-text-bold">{percentageLabel.percentageDecrease.toFixed(0)} %</p>
            <p className="slider-text-small"> {t("Climate2_Slider.1")}</p>
          </div>
          <div className="glacier-zoom slider-text-ice">
            <p className="slider-text-bold">
              {(dataVolume.data_1850 - percentageLabel.currentVolume).toFixed(0) + " "}
              km&sup3;
            </p>
            <p className="slider-text-small">{t("Climate2_Slider.2")}</p>
            <button className="submit-button submit-button-glacier" onClick={() => showResult()}>
              {t("Climate2_Submit_Button")}
            </button>
          </div>
          <div className="glacier-zoom slider-text-scaleFactor">
            <p className="slider-text-bold">{scaleLake.toFixed(1)} x</p>
            <p className="slider-text-small">{t("Climate2_Slider.3")}</p>
          </div>
        </div>
      </CSSTransition>
    )
  }

  return (
    <React.Fragment>
      <CSSTransition
        in={props.showInteraction}
        timeout={{ enter: 3000, exit: 0 }}
        classNames="fade-climate2"
        unmountOnExit
        appear>
        <div className="glacier-title-wrapper">
          <h1 className="glacier-zoom title"> {t("Climate2_Title.1")}</h1>
          <h2 className="glacier-zoom subtitle">{t("Climate2_Title.3")}</h2>
          <h6 className="glacier-zoom source source-glacier">{t("Climate2_Source_Glacier")}</h6>
          {createBubbleStartQuizz()}
          {showSliderAndNumbers()}
        </div>
      </CSSTransition>
      <div className="glacier-wrapper glacier-zoom">
        <GlacierGraph
          scaleFactor={calculatePercentage()}
          showAnswer={showAnswer}
          scaleFactorEstimation={scaleFactorEstimation}></GlacierGraph>
        {createBubbleShowAnswer()}
      </div>
    </React.Fragment>
  )
}

export default GlacierMeltOverview2
