import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  select,
  scaleLinear,
  drag,
  event,
  easeQuad,
  easeCubic,
  easeLinear,
} from "d3"

const GlacierMeltDraggable = props => {
  //transaltion
  const { t } = useTranslation()

  //svg sizing
  const svgRef = useRef()
  const width = 700
  const height = 550
  const margin = 98
  const mountainHeight = 2200

  //state
  const [draggableLinePosition, setDraggableLinePosition] = useState(1000)
  const [showSubmitButton, setShowSubmitButton] = useState(false)

  /**
   * Main code for SnowLineDraggable
   */
  function createGlacierMelt() {}

  /**
   * React Lifecycle
   */
  useEffect(() => {
    createGlacierMelt()
  }, [props.showAnswer])

  /**
   * Handle submission of result
   */
  function showResult() {
    props.showQuizzResult()
    setShowSubmitButton(false)
  }

  return (
    <React.Fragment>
      <div className="glacier-container">
        <p>Hallo</p>
        <svg className="glacier-graph" width={width + 2 * margin}>
          <g ref={svgRef}></g>
        </svg>
        {showSubmitButton ? (
          <button
            className="submit-button"
            style={{
              bottom: (draggableLinePosition * height) / mountainHeight,
            }}
            onClick={() => showResult()}>
            {t("Climate2_Submit_Button")}
          </button>
        ) : null}
      </div>
    </React.Fragment>
  )
}

export default GlacierMeltDraggable
