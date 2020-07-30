import React from "react"
import GlacierOriginal from "../../assets/img/glacierOriginal.svg"
import GlacierTransparent from "../../assets/img/glacierTransparent.svg"
import { useTranslation } from "react-i18next"
import { CSSTransition } from "react-transition-group"

/**
 * creates a scalable glacier graph
 * @param {number} props.scaleFactor scale factor for scaling the svg glacier
 * @param {boolean} props.showAnswer indicates whether submission has occured
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
   * creates a glacier showing the reference volume of 1850 with animation
   * @returns dom element
   */
  function createReferenceGlacier() {
    return (
      <div className="glacier-img-container">
        <CSSTransition
          in={props.showGlacierInteraction}
          timeout={3000}
          classNames="glacier-animation-fade-in"
          unmountOnExit
          appear>
          <p className="glacier-original-text">
            {t("Climate2_Glacier_Graph.3")} 1850: <br></br>{props.glacierData.data_1850} km&sup3;
          </p>
        </CSSTransition>
        {getScaledGlacier(1, GlacierTransparent)}
      </div>
    )
  }

  /**
   * creates a glacier with the volume of the users estimation
   * @returns dom element
   */
  function createEstimationGlacier() {
    var estimationText //dynamic text showing estimated volume
    if (!props.showAnswer) {
      if (props.scaleFactor < 1) {
        //only show text when estimation started
        estimationText = (
          <p
            className="glacier-text glacier-input-text"
            style={{
              bottom: props.scaleFactor * glacierHeight,
            }}>
            {t("Climate2_Glacier_Graph.3") + " 2019: "} <br></br> {calculateEstimatedVolume(props.scaleFactor)} km&sup3;
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
   * creates the animation for showing the result
   * @returns dom element
   */
  function createResultAnimation() {
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
            <p className="glacier-text glacier-result-text">{t("Climate2_Glacier_Graph.2")} <br></br> 51 km&sup3;</p>
            {getScaledGlacier(props.scaleFactor, GlacierOriginal)}
          </div>
        </CSSTransition>
      </React.Fragment>
    )
  }

  /**
   * creates an animated line with the users estimation
   * @returns dom element
   */
  function createEstimationLine() {
    return (
      <CSSTransition in={props.showAnswer} timeout={500} classNames="glacier-animation-fade-in" unmountOnExit appear>
        <div
          style={{
            bottom: props.scaleFactorEstimation * glacierHeight          }}
          className="estimation-container">
          <p className="glacier-estimation-text">
            {t("Climate2_Glacier_Graph.1") + calculateEstimatedVolume(props.scaleFactorEstimation)} km&sup3;
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
   * calculates the volume of the users estimation
   * @returns {number} volume in cubic kilometers
   */
  function calculateEstimatedVolume(scale) {
    return (props.glacierData.data_1850 * scale).toFixed(0)
  }

  return (
    <React.Fragment>
      <div className="glacier-wrapper glacier-zoom">
        {createReferenceGlacier()}
        {createEstimationGlacier()}
        {createResultAnimation()}
        {createEstimationLine()}
      </div>
    </React.Fragment>
  )
}

export default GlacierGraph
