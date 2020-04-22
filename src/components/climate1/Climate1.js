import React, { useEffect, useState, useRef } from "react"
import World from "./World"
import "./climate1.css"
import { useTranslation } from "react-i18next"

function Climate1() {
  const { t } = useTranslation()
  const [showBubble, setShowBubble] = useState({
    globe: true,
    linegraph: false,
  })

  function createBubbleGlobe() {
    return (
      <div className={showBubble.globe ? "bubble-visible" : "bubble-hidden"}>
        <div className="bubble-box-climate1-globe">
          <p>{t("Climate1_Bubble.1")}</p>
          <button
            className="bubble-button"
            onClick={() => setShowBubble({ globe: false, linegraph: true })}>
            <p>
              {t("Climate1_Button.1")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="bubble-button-arrow-globe"
                viewBox="0 0 511.995 511.995">
                <path
                  d="M381.039,248.62L146.373,3.287c-4.083-4.229-10.833-4.417-15.083-0.333c-4.25,4.073-4.396,10.823-0.333,15.083
                  L358.56,255.995L130.956,493.954c-4.063,4.26-3.917,11.01,0.333,15.083c2.063,1.979,4.729,2.958,7.375,2.958
                  c2.813,0,5.604-1.104,7.708-3.292L381.039,263.37C384.977,259.245,384.977,252.745,381.039,248.62z"
                />
              </svg>
            </p>
          </button>
        </div>
        <svg
          className="bubble-arrow-climate1-globe"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 42.5L44 2V85.5L1 42.5Z" />
        </svg>
      </div>
    )
  }

  function createBubbleLineGraph() {
    return (
      <div
        className={showBubble.linegraph ? "bubble-visible" : "bubble-hidden"}>
        <div className="bubble-box-climate1-linegraph">
          <p>{t("Climate1_Bubble.2")}</p>
          <button
            className="bubble-button"
            onClick={() => setShowBubble({ globe: false, linegraph: true })}>
            <p>
              {t("Climate1_Button.2")}{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="bubble-button-arrow-linegraph"
                viewBox="0 0 511.995 511.995">
                <path
                  d="M381.039,248.62L146.373,3.287c-4.083-4.229-10.833-4.417-15.083-0.333c-4.25,4.073-4.396,10.823-0.333,15.083
                  L358.56,255.995L130.956,493.954c-4.063,4.26-3.917,11.01,0.333,15.083c2.063,1.979,4.729,2.958,7.375,2.958
                  c2.813,0,5.604-1.104,7.708-3.292L381.039,263.37C384.977,259.245,384.977,252.745,381.039,248.62z"
                />
              </svg>
            </p>
          </button>
        </div>
        <svg
          className="bubble-arrow-climate1-linegraph"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 42.5L44 2V85.5L1 42.5Z" />
        </svg>
      </div>
    )
  }

  return (
    <React.Fragment>
      {createBubbleGlobe()}
      {createBubbleLineGraph()}
      <h1 className="climate-1-title"> {t("Climate1_Title.1")}</h1>
      <World />
    </React.Fragment>
  )
}

export default Climate1
