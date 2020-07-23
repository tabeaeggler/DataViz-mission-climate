import React, { useEffect, useState } from "react"
import history from "../routing/history"
import { Modal } from "react-bootstrap"

/**
 * Rendering of components with specific path
 * @param {function} props.setPageNr setter for navigation page
 * @param {function} props.globalNavState indicates the current selected page
 */
const TimeoutPopup = props => {
  const goToStartTime = 1000 * 60 * 2
  const warningTime = 1000 * 60 * (2 - 1 / 6)
  var warnTimeout
  var goToStartTimeout

  //bootstrap modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const modalWidth = window.innerWidth / 2

  function warn() {
    console.log("here", props.globalNavState)
    if (props.globalNavState !== 0) handleShow()
  }
  function goToStart() {
    handleClose()
    history.push("/")
    props.setPageNr(0)
  }

  function setTimeouts() {
    warnTimeout = setTimeout(warn, warningTime)
    goToStartTimeout = setTimeout(goToStart, goToStartTime)
  }

  function clearTimeouts() {
    if (warnTimeout) clearTimeout(warnTimeout)
    if (goToStartTimeout) clearTimeout(goToStartTimeout)
  }

  useEffect(() => {
    const events = ["load", "mousemove", "mousedown", "click", "scroll", "touchstart"]

    function resetTimeout() {
      clearTimeouts()
      setTimeouts()
    }

    for (let i in events) {
      window.addEventListener(events[i], resetTimeout)
    }

    setTimeouts()
    return () => {
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout)
        clearTimeouts()
      }
    }
  }, [])

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        keyboard={false}
        style={{
          marginLeft: -(modalWidth / 2),
        }}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body
          style={{
            width: modalWidth,
          }}
          className="timeout-text">
          Aufgrund von Inaktivität wirst du in 10 Sekunden wieder auf die Startseite gelangen.
          <br></br>
          <button
            onClick={() => {
              handleClose()
            }}
            className="stay-button">
            Auf der momentanen Seite bleiben
          </button>
        </Modal.Body>
      </Modal>
    </div>
  )
}
export default TimeoutPopup
