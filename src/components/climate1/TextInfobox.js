import React from "react"
import { useTranslation } from "react-i18next"

/**
 * Creates TextInfobox
 * @param {@TODO} props.text @TODO
 */
const TextInfobox = props => {
  const { t } = useTranslation()

  return (
    <div className="info-box">
      <p className="infobox-paragraph">{t(props.text + ".2")}</p>
      <h6>{t(props.source)}</h6>
    </div>
  )
}

export default TextInfobox
