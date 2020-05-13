import React from "react"
import GlacierOriginal from "../../assets/img/glacierOriginal.svg"
import FilledLake from "../../assets/img/filledLakeOfLucern.svg"
import EstimationLake from "../../assets/img/estimationLakeOfLucern.svg"
import ResultLake from "../../assets/img/resultLakeOfLucern.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"

const GlacierGraph = props => {
  const { t } = useTranslation()
  const width = 346
  const height = 551

  function getScaledLake(scaleFactor, image) {
    return (
      <img
        width={width}
        height={height * scaleFactor}
        src={image}
        alt="scaled lake"></img>
    )
  }

  return (
    <React.Fragment>
      <div className="lake-graph-container">
        {/* <CSSTransition
          in={props.showAnswer}
          timeout={6000}
          classNames="lake-animation-orginal"
          unmountOnExit
          appear>
          <div className="original-lake">
            <p className="original-text-lake">Vierwaldstättersee</p>
            {getScaledLake(1, OriginalLake)}
          </div>
        </CSSTransition> */}
        {/* <CSSTransition
          in={props.scaleFactorEstimation != 0}
          timeout={3000}
          classNames="lake-animation-estimation"
          unmountOnExit
          appear>
          <div className="scaled-lake">
            {getScaledLake(props.scaleFactorEstimation, EstimationLake)}
          </div>
        </CSSTransition>
        {
          <CSSTransition
            in={props.showAnswer}
            timeout={3000}
            classNames="lake-animation-result"
            unmountOnExit
            appear>
            <div className="scaled-lake">
              {getScaledLake(props.scaleFactor, ResultLake)}
            </div>
          </CSSTransition>
        } */}
        <div className="scaled-lake">
          {!props.showAnswer
            ? getScaledLake(props.scaleFactor, GlacierOriginal)
            : null}
        </div>
      </div>
    </React.Fragment>
  )
}

export default GlacierGraph
