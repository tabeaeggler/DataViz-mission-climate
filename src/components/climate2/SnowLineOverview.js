import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonNavRight.svg"
import ButtonLeft from "../../assets/img/buttonNavLeft.svg"
import history from "../../routing/history"
import Snow from "react-snowstorm"
import SnowLineDraggableGraph from "./SnowLineDraggableGraph"

/**
 * creates context for the snowline graph with speech bubbles
 * @param {boolean} props.showSnowlineInteraction indicates whether snowline iteraction elements are visible
 * @param {boolean} props.showSnowlineGraph indicates whether the snowline graph is focused
 * @param {function} props.setShowSnowlineGraph triggers switch to glacier visualisation
 * @param {function} props.setPageNr setter for navigation
 */

const SnowLineOverview = props => {
  //translation
  const { t } = useTranslation()
  //speech bubbles
  const [showAnswer, setShowAnswer] = useState(false)
  const [hideIntroductionBubble, setHideIntroductionBubble] = useState(false)
  //data
  const [data, setData] = useState([{ year: 1960, snowline: 900 }])

  /**
   * creates the header section of the mountains page with animation
   * @returns dom element with header
   */
  function createHeader() {
    return (
      <CSSTransition
        in={props.showSnowlineGraph && props.showSnowlineInteraction}
        timeout={{ enter: 3000, exit: 0 }}
        classNames="fade-climate2"
        unmountOnExit
        appear>
        <div className="snowline-title-wrapper zoom-mountain">
          <h1> {t("Climate2_Title.1")}</h1>
          <h2 className="subtitle">{t("Climate2_Title.2")}</h2>
          <h6 className="source source-snowline">{t("Climate2_Source_Snowline")}</h6>
        </div>
      </CSSTransition>
    )
  }

  /**
   * adds speach bubble for introduction to the topic
   * @returns dom element with speech bubble
   */
  function createBubbleIntroduction() {
    return (
      <CSSTransition
        in={props.showSnowlineInteraction && !hideIntroductionBubble}
        timeout={{ enter: 3000, exit: 500 }}
        classNames="fade-climate2"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-snow-introduction zoom-mountain">
          <p className="bubble-box-text">
            <b> {t("Climate2_Bubble_Snowline.1")}</b>
            {t("Climate2_Bubble_Snowline.2")}
          </p>
        </div>
      </CSSTransition>
    )
  }

  /**
   * adds speach bubble for showing snowline answer
   * @returns dom element with speech bubble
   */
  function createBubbleShowAnswer() {
    return (
      <CSSTransition in={showAnswer && props.showSnowlineInteraction} timeout={{ enter: 3000, exit: 500 }} classNames="fade-climate2" unmountOnExit appear>
        <div className="bubble-box bubble-box-climate2-snow-answer zoom-mountain">
          <p className="bubble-box-text">
            <b>{t("Climate2_Bubble_Snowline.3")}</b>
            <span className="text-solution-bold">
              <b>{t("Climate2_Bubble_Snowline.4")}</b>
            </span>
            {t("Climate2_Bubble_Snowline.5")}
            <b>{t("Climate2_Bubble_Snowline.6")}</b>
            {t("Climate2_Bubble_Snowline.7")}
          </p>
        </div>
      </CSSTransition>
    )
  }

  /**
   * handles submit event
   */
  function showQuizzResult() {
    setData(prevState => [...prevState, { year: 2020, snowline: 1250 }])
    setShowAnswer(true)
  }

  /**
   * adds next navigation button
   * @returns dom element with arrow button right
   */
  function navigationNext() {
    return (
      <CSSTransition in={showAnswer && props.showSnowlineGraph} timeout={{ enter: 3000, exit: 0 }} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-next-button zoom-mountain" id="navigation-button-next-mountain">
          <button
            onClick={() => {
              props.setShowSnowlineGraph(false)
            }}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * adds back navigation button
   * @returns dom element with arrow button left
   */
  function navigationBack() {
    return (
      <CSSTransition in={props.showSnowlineInteraction} timeout={2000} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-back-button zoom-mountain" id="navigation-button-back-mountain">
          <button
            onClick={() => {
              props.setPageNr(1)
              history.push(process.env.PUBLIC_URL + "/globe")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * react lifecycle
   */
  useEffect(() => {
    props.setPageNr(2)
  }, [props])

  return (
    <React.Fragment>
      {createHeader()}
      {createBubbleShowAnswer()}
      {createBubbleIntroduction()}
      {navigationNext()}
      {navigationBack()}
      <SnowLineDraggableGraph
        showAnswer={showAnswer}
        data={data}
        showQuizzResult={showQuizzResult}
        showSnowlineInteraction={props.showSnowlineInteraction}
        setHideIntroductionBubble={setHideIntroductionBubble}
      />
      <Snow animationInterval={50} followMouse={false} vMaxY={1.5} vMaxX={3} flakesMaxActive={90} flakesMax={150}></Snow>
    </React.Fragment>
  )
}

export default SnowLineOverview
