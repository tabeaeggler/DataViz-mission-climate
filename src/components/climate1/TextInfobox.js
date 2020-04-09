import React from "react"
import { useTranslation } from "react-i18next"

const TextInfobox = props => {
  const { t } = useTranslation()

  return (
    <div className="info-box">
      <h3>{t(props.text + ".1")} </h3>
      <p>{t(props.text + ".2")}</p>
    </div>
  )
}

export default TextInfobox
