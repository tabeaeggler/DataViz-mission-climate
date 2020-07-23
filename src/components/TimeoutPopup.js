import React, { useEffect, useState } from "react"
import history from "../routing/history"
import { Modal } from "react-bootstrap"

const TimeoutPopup = () => {
  const goToStartTime = 150000000
  const warningTime = 3000
  var warnTimeout
  var goToStartTimeout

  //bootstrap modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const modalWidth = window.innerWidth / 2

  function warn() {
    handleShow()
  }
  function goToStart() {
    handleClose()
    history.push("/")
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
    const events = ["load", "mousemove", "mousedown", "click", "scroll", "keypress"]

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
