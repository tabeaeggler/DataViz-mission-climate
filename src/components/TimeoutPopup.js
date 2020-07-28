import React, { useEffect, useState } from "react"
import history from "../routing/history"
import { Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"

/**
 * Rendering of components with specific path
 * @param {function} props.setPageNr setter for navigation page
 * @param {function} props.globalNavState indicates the current selected page
 */
const TimeoutPopup = props => {
  //timing variables: 2 min until changing to homepage --> user gets warned 10s before
  const goToStartTime = 2000 * 60 * 2
  const warningTime = 1000 * 60 * (2 - 1 / 6)
  var warnTimeout
  var goToStartTimeout

  //translation
  const { t } = useTranslation()

  //bootstrap modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  function warn() {
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
      handleClose()
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
  })

  return (
    <div>
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body className="timeout-text">
          {t("Timeout_Popup.1")}
          <br></br>
          <button
            onClick={() => {
              handleClose()
            }}
            className="stay-button">
            {t("Timeout_Popup.2")}
          </button>
        </Modal.Body>
      </Modal>
    </div>
  )
}
export default TimeoutPopup
