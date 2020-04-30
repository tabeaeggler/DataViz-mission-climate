import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import SnowLineDraggableGraph from "./SnowLineDraggableGraph"

function SnowLineOverview() {
  const { t } = useTranslation()

  const [showAnswer, setShowAnswer] = useState(false)
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
          <p className="bubble-box-text">
            "Starte das Quizz und bestätige die Eingabe"
          </p>
          <button id="next-button" onClick={() => showQuizzResult()}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  function showQuizzResult() {
    //show result line
    //data.push({ year: 1980, snowline: 100 })
      //data = [{ year: 1980, snowline: 100 }, { year: 1980, snowline: 300 }]
      setData(prevState => [...prevState, { year: 2020, snowline: 1250 }])
      console.log(data)
    //undrag line
    setShowAnswer(true)
    //shwo second bubble
  }

  return (
    <React.Fragment>
      <div className="snowline-container">
              {createBubbleStartQuizz()}
              {console.log(data)}
        <SnowLineDraggableGraph
          showAnswer={showAnswer}
          data={data}/>
      </div>
    </React.Fragment>
  )
}

export default SnowLineOverview
