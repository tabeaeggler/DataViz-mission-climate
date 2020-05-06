import React from "react"
import Lake from "../../assets/img/lakeOfLucern.svg"
import FilledLake from "../../assets/img/filledLakeOfLucern.svg"

const LakeGraph = props => {
  const originalScale = 6
  const screenWidth = window.innerWidth
    const screenHeight = window.innerHeight
    
  return (
    <React.Fragment>
      <div className="lake-graph-container">
        <div className="original-lake">
          <img
            width={screenWidth / originalScale}
            height={screenHeight / originalScale}
            src={Lake}
            alt="original lake"></img>
        </div>
        <div className="scaled-lake">
          <img
            width={(screenWidth / originalScale) * props.scaleFactor}
            height={(screenHeight / originalScale) * props.scaleFactor}
            src={FilledLake}
            alt="scaled lake"></img>
        </div>
      </div>
    </React.Fragment>
  )
}

export default LakeGraph
