import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import Snow from "react-snowstorm"
import SnowLineDraggableGraph from "./SnowLineDraggableGraph"

/**
 * Creates context for the snowline graph with speech bubbles
 * @param {boolean} props.showSnowlineInteraction indicates whether snowline iteraction elements are visible
 * @param {function} props.setShowSnowlineGraph triggers switch to glacier visualisation
 */
const SnowLineOverview = props => {
  //translation
  const { t } = useTranslation()
  //speech bubbles
  const [showAnswer, setShowAnswer] = useState(false)
  const [hideStartBubble, setHideStartBubble] = useState(false)
  //data
  const [data, setData] = useState([{ year: 1960, snowline: 900 }])

  /**
   * Adds Speach Bubble for showing snowline quizz question
   * @returns dom element with speech bubble
   */
  function createBubbleStartQuizz() {
    return (
      <CSSTransition
        in={props.showSnowlineInteraction && !hideStartBubble}
        timeout={{ enter: 3000, exit: 0 }}
        classNames="fade-climate2"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate2-snow-start zoom-mountain">
          <p className="bubble-box-text">
            <b> {t("Climate2_Bubble_Snowline.1")}</b>
            {t("Climate2_Bubble_Snowline.2")}
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
        in={showAnswer && props.showSnowlineInteraction}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate2-snow-answer">
          <p className="bubble-box-text">
            <b>{t("Climate2_Bubble_Snowline.3")}</b>
            <span className="text-solution-bold">
              <b>{t("Climate2_Bubble_Snowline.4")}</b>
            </span>
            {t("Climate2_Bubble_Snowline.5")}
          </p>
          <CSSTransition in={true} timeout={3600} classNames="show-button" unmountOnExit appear>
            <button
              id="next-button"
              onClick={() => {
                props.setShowSnowlineGraph(false)
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
        in={props.showSnowlineInteraction}
        timeout={{ enter: 3000, exit: 0 }}
        classNames="fade-climate2"
        unmountOnExit
        appear>
        <div className="snowline-title-wrapper zoom-mountain">
          <h1 className="title"> {t("Climate2_Title.1")}</h1>
          <h2 className="subtitle">{t("Climate2_Title.2")}</h2>
          <h6 className="source source-snowline">{t("Climate2_Source_Snowline")}</h6>
        </div>
      </CSSTransition>

      <div className="snowline-wrapper zoom-mountain">
        <SnowLineDraggableGraph
          showAnswer={showAnswer}
          data={data}
          showQuizzResult={showQuizzResult}
          showSnowlineInteraction={props.showSnowlineInteraction}
          setHideStartBubble={setHideStartBubble}
        />
        {createBubbleShowAnswer()}
      </div>

      {createBubbleStartQuizz()}

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
