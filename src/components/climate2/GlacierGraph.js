import React from "react"
import GlacierOriginal from "../../assets/img/glacierOriginal.svg"
import GlacierTransparent from "../../assets/img/glacierTransparent.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"

/**
 * Creates a scalable glacier grafic
 */
const GlacierGraph = props => {
  const { t } = useTranslation()
  const glacierWidth = 346
  const glacierHeight = 551
  const margin = 20

  /**
   * Scales an image container for glacier svg
   * @param {number} scaleFactor
   * @param {svg} image
   * @returns dom element
   */
  function getScaledGlacier(scaleFactor, image) {
    console.log(image)

    return (
      <img
        width={glacierWidth}
        height={glacierHeight * scaleFactor}
        src={image}
        alt="scaled lake"></img>
    )
  }

  return (
    <React.Fragment>
      <div className="glacier-scaled">
        <CSSTransition
          in={props.showAnswer}
          timeout={5000}
          classNames="glacier-animation-appear"
          unmountOnExit
          appear>
          <p className="glacier-original-text">1850</p>
        </CSSTransition>
        {getScaledGlacier(1, GlacierTransparent)}
      </div>
      {!props.showAnswer ? (
        <div className="glacier-scaled">
          {getScaledGlacier(props.scaleFactor, GlacierOriginal)}
        </div>
      ) : null}

      <CSSTransition
        in={props.showAnswer}
        timeout={5000}
        classNames="glacier-animation-appear"
        unmountOnExit
        appear>
        <div className="glacier-scaled">
          <p className="glacier-text">2019</p>
          {getScaledGlacier(props.scaleFactor, GlacierOriginal)}
        </div>
      </CSSTransition>

      <CSSTransition
        in={props.showAnswer}
        timeout={500}
        classNames="glacier-animation-appear"
        unmountOnExit
        appear>
        <div
          style={{
            bottom: props.scaleFactorEstimation * glacierHeight,
            position: "absolute",
            textAlign: "right",
            left: window.innerWidth / 2 + glacierWidth / 2 - margin,
          }}>
          <p className="glacier-estimation-text">
            {t("Climate2_Glacier_Graph")}
          </p>
          <div className="glacier-estimation-line"></div>
        </div>
      </CSSTransition>

      <CSSTransition
        in={props.showAnswer}
        timeout={2000}
        classNames="glacier-animation-fade"
        unmountOnExit
        appear>
        <div className="glacier-scaled">
          {getScaledGlacier(props.scaleFactorEstimation, GlacierOriginal)}
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default GlacierGraph
