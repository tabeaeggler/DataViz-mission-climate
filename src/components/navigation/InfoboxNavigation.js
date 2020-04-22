import React, { useState } from "react"
import TextInfobox from "./TextInfobox"
import ButtonLeft from "../../assets/img/buttonLeft.svg"
import ButtonRight from "../../assets/img/buttonRight.svg"
import { CSSTransition } from "react-transition-group"

/**
 * Creates Infobox Navigation
 * @param {@TODO} props.upperLimit @TODO
 * @param {@TODO} props.textIdentifier @TODO
 */
const InfoboxNavigation = props => {
  var [counter, setCounter] = useState(1)
  const [showText, setShowText] = useState(false)

  /**
   * Set navigation postition and initiate transition
   * @param {string} different behave for next-button or back-button
   */
  function handleClick(e) {
    e.target.id === "next-button"
      ? setCounter(++counter)
      : setCounter(--counter)
    setShowText(!showText)
  }

  return (
    <div className="infobox-container">
      {counter > 1 ? (
        <button onClick={e => handleClick(e)}>
          <img src={ButtonLeft} id="back-button" alt=""></img>
        </button>
      ) : null}
      <CSSTransition in={showText} timeout={400} classNames="infobox">
        <TextInfobox text={"Climate1_Textbox" + counter} source={"Climate1_Source"} />
      </CSSTransition>
      {counter < props.upperLimit ? (
        <button onClick={e => handleClick(e)}>
          <img src={ButtonRight} id="next-button" alt=""></img>
        </button>
      ) : null}
    </div>
  )
}

export default InfoboxNavigation
