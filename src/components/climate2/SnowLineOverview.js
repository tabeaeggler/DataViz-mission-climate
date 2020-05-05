import React, {useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import SnowLineDraggableGraph from "./SnowLineDraggableGraph"

function SnowLineOverview() {
  const { t } = useTranslation()

  const [showAnswer, setShowAnswer] = useState(false)
  console.log(showAnswer)
  const [nextPage, setNextPage] = useState(false)

  const [data, setData] = useState([{ year: 1960, snowline: 900 }])
  //   let data = [{ year: 1960, snowline: 900 }]

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
        <div className="bubble-box bubble-box-climate2-start">
          <p className="bubble-box-text">{t("Climate2_Bubble.1")}</p>
        </div>
      </CSSTransition>
    )
  }

  function createBubbleShowAnswer() {
    // return (
    //   <CSSTransition
    //     in={showAnswer}
    //     timeout={4000}
    //     classNames="bubble-fade"
    //     unmountOnExit
    //     appear>
    //     <div className="bubble-box bubble-box-climate2-answer">
    //       <p className="bubble-box-text">{t("Climate2_Bubble.2")}</p>
    //       <button id="next-button" onClick={() => setShowAnswer(true)}>
    //         <img src={ButtonRight} alt="continue"></img>
    //       </button>
    //     </div>
    //   </CSSTransition>
    // )
  }

  function showQuizzResult() {
    setData(prevState => [...prevState, { year: 2020, snowline: 1250 }])
    setShowAnswer(true)
  }

  return (
    <React.Fragment>
      <div className="snowline-wrapper">
        {createBubbleStartQuizz()}
        {createBubbleShowAnswer()}
        <SnowLineDraggableGraph
          showAnswer={showAnswer}
          data={data}
          showQuizzResult={showQuizzResult}
        />
      </div>
    </React.Fragment>
  )
}

export default SnowLineOverview
