import React from "react"
import Lake from "../../assets/img/lakeOfLucern.svg"
import FilledLake from "../../assets/img/filledLakeOfLucern.svg"
import EstimationLake from "../../assets/img/estimationLakeOfLucern.svg"
import { CSSTransition } from "react-transition-group"

const LakeGraph = props => {
  const originalScale = 6.2
  const screenWidth = window.innerWidth
  const screenHeight = window.innerHeight

  function getScaledLake(scaleFactor, image) {
    return (
      <div className="scaled-lake">
        <img
          width={(screenWidth / originalScale) * scaleFactor}
          height={(screenHeight / originalScale) * scaleFactor}
          src={image}
          alt="scaled lake"></img>
      </div>
    )
  }

  return (
    <React.Fragment>
      <div className="lake-graph-container">
        <div className="original-lake">
          <img
            width={screenWidth / originalScale}
            height={screenHeight / originalScale}
            src={Lake}
            alt="original lake"></img>
        </div>
        <CSSTransition
          in={props.scaleFactorEstimation != 0}
          timeout={2000}
          classNames="lake-animation-estimation"
          unmountOnExit
          appear>
          {getScaledLake(props.scaleFactorEstimation, EstimationLake)}
        </CSSTransition>
        {
          <CSSTransition
            in={props.showAnswer}
            timeout={5000}
            classNames="lake-animation-result"
            unmountOnExit
            appear>
            {getScaledLake(props.scaleFactor, FilledLake)}
          </CSSTransition>
        }
        {!props.showAnswer ? getScaledLake(props.scaleFactor, FilledLake) : null}
      </div>
    </React.Fragment>
  )
}

export default LakeGraph
