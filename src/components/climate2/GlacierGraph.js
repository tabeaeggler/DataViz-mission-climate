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
 * @param {boolean} props.showGlacierInteraction indicates whether glacier iteraction elements are visible
 */
const GlacierGraph = props => {
  //translation
  const { t } = useTranslation()

  //layout
  const glacierWidth = 345
  const glacierHeight = 551

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
        alt="scaled glacier"
        className={"glacier-img"}></img>
    )
  }

  return (
    <React.Fragment>
      <div className="glacier-img-container">
        <CSSTransition
          in={props.showGlacierInteraction}
          timeout={5000}
          classNames="glacier-animation-fade-in"
          unmountOnExit
          appear>
          <p className="glacier-original-text">{t("Climate2_Glacier_Graph.2") + " 1850"} 180 km&sup3;</p>
        </CSSTransition>
        {getScaledGlacier(1, GlacierTransparent)}
      </div>

      {!props.showAnswer ? (
        <div className="glacier-img-container">
          {props.scaleFactor < 1 ? (
            <p
              className="glacier-text glacier-input-text"
              style={{
                bottom: props.scaleFactor * glacierHeight,
                position: "absolute",
              }}>
              {"2019: " + t("Climate2_Glacier_Graph.1")}
            </p>
          ) : null}
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
          <p className="glacier-text glacier-result-text">
            {t("Climate2_Glacier_Graph.2") + " 2019"} 51 km&sup3;
          </p>
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
            left: glacierWidth,
          }} className="estimation-container">
          <p className="glacier-estimation-text">{t("Climate2_Glacier_Graph.1")}</p>
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
