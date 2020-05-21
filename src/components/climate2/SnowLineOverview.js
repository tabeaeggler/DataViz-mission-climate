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
const SnowLineOverview = props => {
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
      <CSSTransition in={!showAnswer} timeout={4000} classNames="bubble-fade" unmountOnExit appear>
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
        in={showAnswer && props.showInteraction}
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
          <CSSTransition
            in={true}
            timeout={3600}
            classNames="show-button"
            unmountOnExit
            appear>
            <button
              id="next-button"
              onClick={() => {
                props.showGlacier()
              }}>
              <img src={ButtonRight} alt="continue"></img>
            </button>
          </CSSTransition>
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
        in={props.showInteraction}
        timeout={{ enter: 3000, exit: 0 }}
        classNames="fade-climate2"
        unmountOnExit
        appear>
        <div className="snowline-title-wrapper zoom-mountain">
          <h1 className="title"> {t("Climate2_Title.1")}</h1>
          <h2 className="subtitle">{t("Climate2_Title.2")}</h2>
          <h6 className="source source-snowline">{t("Climate2_Source_Snow")}</h6>
          {createBubbleStartQuizz()}
        </div>
      </CSSTransition>
      <div className="snowline-wrapper zoom-mountain">
        <SnowLineDraggableGraph
          showAnswer={showAnswer}
          data={data}
          showQuizzResult={showQuizzResult}
          showInteraction={props.showInteraction}
        />
        {createBubbleShowAnswer()}
      </div>
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
