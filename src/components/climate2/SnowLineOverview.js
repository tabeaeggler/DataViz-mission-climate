import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import Snow from "react-snowstorm"
import SnowLineDraggableGraph from "./SnowLineDraggableGraph"
import history from "../../routing/history"
import "./climate2.css"

/**
 * Creates context for the snowline graph
 */
function SnowLineOverview() {
  //translation
  const { t } = useTranslation()
  //speech bubbles
  const [showAnswer, setShowAnswer] = useState(false)
  //data
  const [data, setData] = useState([{ year: 1960, snowline: 900 }])

  /**
   * Adds Speach Bubble for showing snowline quizz question
   * @returns dom element with speech bubble
   */
  function createBubbleStartQuizz() {
    return (
      <CSSTransition
        in={!showAnswer}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate2-snow-start">
          <p className="bubble-box-text">
            {t("Climate2_Bubble_Snowline.1")}
            <span className="question-style">
              <b>{t("Climate2_Bubble_Snowline.2")}</b>
            </span>
            {/*{t("Climate2_Bubble_Snowline.3")}*/}
          </p>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Adds Speach Bubble for showing snowline quizz answer
   * @returns dom element with speech bubble
   */
  function createBubbleShowAnswer() {
    return (
      <CSSTransition
        in={showAnswer}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate2-snow-answer">
          <p className="bubble-box-text">
            <b>{t("Climate2_Bubble_Snowline.4")}</b>
            <span className="text-solution-bold">
              <b>{t("Climate2_Bubble_Snowline.5")}</b>
            </span>
            {t("Climate2_Bubble_Snowline.6")}
          </p>
          <button
            id="next-button"
            onClick={() => {
              history.push("/glacier")
            }}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Handles submit event
   */
  function showQuizzResult() {
    setData(prevState => [...prevState, { year: 2020, snowline: 1250 }])
    setShowAnswer(true)
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
          <h2 className="subtitle">{t("Climate2_Title.2")}</h2>
          <div className="snowline-wrapper">
            {createBubbleStartQuizz()}
            {createBubbleShowAnswer()}
            <SnowLineDraggableGraph
              showAnswer={showAnswer}
              data={data}
              showQuizzResult={showQuizzResult}
            />
          </div>
          <h6 className="source">{t("Climate2_Source_Snow")}</h6>
        </div>
      </CSSTransition>
      <Snow
        animationInterval={50}
        followMouse={false}
        vMaxY={1.5}
        vMaxX={3}
        flakesMaxActive={90}
        flakesMax={150}></Snow>
    </React.Fragment>
  )
}

export default SnowLineOverview
