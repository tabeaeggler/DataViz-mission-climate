import React from "react"
import GlacierOriginal from "../../assets/img/glacierOriginal.svg"
import GlacierTransparent from "../../assets/img/glacierTransparent.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"

/**
 * creates a scalable glacier graph
 * @param {boolean} props.showAnswer indicates whether submission has occured
 * @param {number} props.scaleFactor scale factor for scaling the svg glacier
 * @param {number} props.scaleFactorEstimation scale factor of submitted estimation for scaling the glacier svg
 * @param {boolean} props.showGlacierInteraction indicates whether glacier iteraction elements are visible
 * @param {array} props.glacierData volume data of swiss glaciers
 */
const GlacierGraph = props => {
  //translation
  const { t } = useTranslation()

  //layout
  const glacierWidth = 345
  const glacierHeight = 551

  /**
   * Creates a glacier showing the reference volume of 1850 with animation
   * @returns dom element
   */
  function getReferenceGlacier() {
    return (
      <CSSTransition
        in={props.showGlacierInteraction}
        timeout={3000}
        classNames="glacier-animation-fade-in"
        unmountOnExit
        appear>
        <div className="glacier-img-container">
          <p className="glacier-original-text">
            {t("Climate2_Glacier_Graph.3")} 1850: {props.glacierData.data_1850} km&sup3;
          </p>
          {getScaledGlacier(1, GlacierTransparent)}
        </div>
      </CSSTransition>
    )
  }

  /**
   * Creates a glacier with the volume of the users estimation
   * @returns dom element
   */
  function getEstimationGlacier() {
    var estimationText //dynamic text showing estimated volume
    if (!props.showAnswer) {
      if (props.scaleFactor < 1) {
        estimationText = (
          <p
            className="glacier-text glacier-input-text"
            style={{
              bottom: props.scaleFactor * glacierHeight,
            }}>
            {t("Climate2_Glacier_Graph.3") + " 2019: " + calculateEstimatedVolume()} km&sup3;
          </p>
        )
      }
      return (
        <div className="glacier-img-container">
          {estimationText}
          {getScaledGlacier(props.scaleFactor, GlacierOriginal)}
        </div>
      )
    }
  }

  /**
   * Creates the animation for showing the result
   * @returns dom element
   */
  function getResultAnimation() {
    return (
      <React.Fragment>
        <CSSTransition
          in={props.showAnswer}
          timeout={2000}
          classNames="glacier-animation-scale-down"
          unmountOnExit
          appear>
          <div className="glacier-img-container">{getScaledGlacier(props.scaleFactorEstimation, GlacierOriginal)}</div>
        </CSSTransition>

        <CSSTransition
          in={props.showAnswer}
          timeout={5000}
          classNames="glacier-animation-scale-up"
          unmountOnExit
          appear>
          <div className="glacier-img-container">
            <p className="glacier-text glacier-result-text">{t("Climate2_Glacier_Graph.2")} 51 km&sup3;</p>
            {getScaledGlacier(props.scaleFactor, GlacierOriginal)}
          </div>
        </CSSTransition>
      </React.Fragment>
    )
  }

  /**
   * Creates an animated line with the users estimation
   * @returns dom element
   */
  function getEstimationLine() {
    return (
      <CSSTransition in={props.showAnswer} timeout={500} classNames="glacier-animation-fade-in" unmountOnExit appear>
        <div
          style={{
            bottom: props.scaleFactorEstimation * glacierHeight,
            left: glacierWidth,
          }}
          className="estimation-container">
          <p className="glacier-estimation-text">
            {t("Climate2_Glacier_Graph.1") + calculateEstimatedVolume()} km&sup3;
          </p>
          <div className="glacier-estimation-line"></div>
        </div>
      </CSSTransition>
    )
  }

  /**
   * scales the image container for the glacier svg
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
        alt="glacier"
        className={"glacier-img"}></img>
    )
  }

  /**
   * calculates volume of user estimation
   * @returns {number} volume in cubic kilometers
   */
  function calculateEstimatedVolume() {
    return (props.glacierData.data_1850 * props.scaleFactor).toFixed(0)
  }

  return (
    <React.Fragment>
      {getReferenceGlacier()}
      {getEstimationGlacier()}
      {getResultAnimation()}
      {getEstimationLine()}
    </React.Fragment>
  )
}

export default GlacierGraph
