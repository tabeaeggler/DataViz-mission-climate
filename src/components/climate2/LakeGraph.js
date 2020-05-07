import React from "react"
import Lake from "../../assets/img/lakeOfLucern.svg"
import FilledLake from "../../assets/img/filledLakeOfLucern.svg"
import EstimationLake from "../../assets/img/estimationLakeOfLucern.svg"
import ResultLake from "../../assets/img/resultLakeOfLucern.svg"
import { CSSTransition } from "react-transition-group"

const LakeGraph = props => {
  const originalScale = 6.2
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  function getScaledLake(scaleFactor, image) {
    return (
      <img
        width={(screenWidth / originalScale) * scaleFactor}
        height={(screenHeight / originalScale) * scaleFactor}
        src={image}
        alt="scaled lake"></img>
    )
  }

  return (
    <React.Fragment>
      <div className="lake-graph-container">
        <div className="original-lake">
          <p className="original-text-lake">
            Vierwaldstättersee
          </p>
          {getScaledLake(1, Lake)}
        </div>
        <CSSTransition
          in={props.scaleFactorEstimation != 0}
          timeout={3000}
          classNames="lake-animation-estimation"
          unmountOnExit
          appear>
          <div className="scaled-lake">
            <p className="estimation-text-lake">
              Deine Schätzung: {props.scaleFactorEstimation.toFixed(0)} x
            </p>
            {getScaledLake(props.scaleFactorEstimation, EstimationLake)}
          </div>
        </CSSTransition>
        {
          <CSSTransition
            in={props.showAnswer}
            timeout={5000}
            classNames="lake-animation-result"
            unmountOnExit
            appear>
            <div className="scaled-lake">
              <p className="solution-text-lake">
                Lösung: {props.scaleFactor.toFixed(0)} x
              </p>
              {getScaledLake(props.scaleFactor, ResultLake)}
            </div>
          </CSSTransition>
        }
        <div className="scaled-lake">
          {!props.showAnswer
            ? getScaledLake(props.scaleFactor, FilledLake)
            : null}
        </div>
      </div>
    </React.Fragment>
  )
}

export default LakeGraph
