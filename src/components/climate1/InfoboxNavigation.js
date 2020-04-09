import React, { useState } from "react"
import TextInfobox from "./TextInfobox"

const InfoboxNavigation = props => {
  var [counter, setCounter] = useState(1)

  function handleClick(e) {
    console.log(counter)
    e.target.id === "next-button"
      ? setCounter(++counter)
      : setCounter(--counter)
  }

  return (
    <div>
      {counter < props.upperLimit ? (
        <button onClick={e => handleClick(e)} id="next-button">
          Weiter
        </button>
      ) : null}
      <TextInfobox text={"Climate1_Textbox" + counter} />
      {counter > 1 ? (
        <button onClick={handleClick} id="back-button">
          Zurück
        </button>
      ) : null}
    </div>
  )
}

export default InfoboxNavigation
