import React from "react"
import Lake from "../../assets/img/lakeOfLucern.svg"
import filledLake from "../../assets/img/lakeOfLucernFilled.svg"

const LakeGraph = props => {
  return (
    <React.Fragment>
      <div className="lake-graph-container">
        <div className="original-lake">
          <img
            width={window.innerWidth / 6}
            height={window.innerHeight / 6}
            src={Lake}></img>
        </div>
        <div className="scaled-lake">
          <img
            width={window.innerWidth / 6 * props.scaleFactor}
            height={window.innerHeight / 6 * props.scaleFactor}
            src={filledLake}></img>
        </div>
      </div>
    </React.Fragment>
  )
}

export default LakeGraph
