import React from "react"
import GlacierOriginal from "../../assets/img/glacierOriginal.svg"
import GlacierTransparent from "../../assets/img/glacierTransparent.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"

/**
 * Creates a scalable glacier graph
 * @param {boolean} props.showAnswer indicates whether submission has occured
 * @param {number} props.scaleFactor scale factor for scaling the svg glacier
 * @param {number} props.scaleFactorEstimation scale factor of submitted estimation for scaling the glacier svg
 */
const GlacierGraph = props => {
  //translation
  const { t } = useTranslation()

  //layout 
  const glacierWidth = 346
  const glacierHeight = 551
  const margin = 20

  /**
   * Scales the image container for the glacier svg
   * @param {number} scaleFactor
   * @param {string} image 
   * @returns dom element containing scaled glacier graphic
   */
  function getScaledGlacier(scaleFactor, image) {
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
      <div className="glacier-img-container">
        <CSSTransition
          in={props.showAnswer}
          timeout={5000}
          classNames="glacier-animation-fade-in"
          unmountOnExit
          appear>
          <p className="glacier-original-text">Volumen 1850</p>
        </CSSTransition>
        {getScaledGlacier(1, GlacierTransparent)}
      </div>
      {!props.showAnswer ? (
        <div className="glacier-img-container">
          {getScaledGlacier(props.scaleFactor, GlacierOriginal)}
        </div>
      ) : null}

      <CSSTransition
        in={props.showAnswer}
        timeout={5000}
        classNames="glacier-animation-scale-up"
        unmountOnExit
        appear>
        <div className="glacier-img-container">
          <p className="glacier-text glacier-result-text">Volumen 2019</p>
          {getScaledGlacier(props.scaleFactor, GlacierOriginal)}
        </div>
      </CSSTransition>

      <CSSTransition
        in={props.showAnswer}
        timeout={500}
        classNames="glacier-animation-fade-in"
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
        classNames="glacier-animation-scale-down"
        unmountOnExit
        appear>
        <div className="glacier-img-container">
          {getScaledGlacier(props.scaleFactorEstimation, GlacierOriginal)}
        </div>
      </CSSTransition>
    </React.Fragment>
  )
}

export default GlacierGraph
