import React, { useState } from "react"
import TextInfobox from "./TextInfobox"
import ButtonUp from "../../assets/img/buttonUp.svg"
import ButtonDown from "../../assets/img/buttonDown.svg"
import { CSSTransition } from "react-transition-group"

const InfoboxNavigation = props => {
  var [counter, setCounter] = useState(1)
  const [showText, setShowText] = useState(false);

  //set navigation postition and initiate transition
  function handleClick(e) {
    e.target.id === "next-button"
      ? setCounter(++counter)
      : setCounter(--counter)
      setShowText(!showText)
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
      <CSSTransition in={showText} timeout={400} classNames="infobox">
          <TextInfobox text={"Climate1_Textbox" + counter} />
      </CSSTransition>
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
