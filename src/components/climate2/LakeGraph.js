import React from "react"
import { useTranslation } from "react-i18next"
import Lake from "../../assets/img/lakeOfLucern.svg"

const LakeGraph = props => {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <div className="lake-graph-container">
        <div
          className="original-lake">
          <img
            width={window.innerWidth / 6}
            height={window.innerHeight / 6}
            src={Lake}></img>
        </div>
      </div>
    </React.Fragment>
  )
}

export default LakeGraph
