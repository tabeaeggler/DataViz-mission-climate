import React, { useState } from "react"
import TextInfobox from "./TextInfobox"
import ButtonUp from "../../assets/img/buttonUp.svg"
import ButtonDown from "../../assets/img/buttonDown.svg"

const InfoboxNavigation = props => {
  var [counter, setCounter] = useState(1)

  //set navigation postition
  function handleClick(e) {
    console.log(counter)
    e.target.id === "next-button"
      ? setCounter(++counter)
      : setCounter(--counter)
  }

  return (
    <div className="infobox-container">
      <div className="infobox-button-container">
        {counter > 1 ? (
          <button onClick={e => handleClick(e)}>
            <img src={ButtonUp} id="back-button" alt=""></img>
          </button>
        ) : null}
      </div>
      <TextInfobox text={"Climate1_Textbox" + counter} />
      <div className="infobox-button-container">
        {counter < props.upperLimit ? (
          <button onClick={e => handleClick(e)}>
            <img src={ButtonDown} id="next-button" alt=""></img>
          </button>
        ) : null}
      </div>
    </div>
  )
}

export default InfoboxNavigation
