import React, { useEffect, useState } from "react"
import history from "../routing/history"
import { Modal } from "react-bootstrap"
import { useTranslation } from "react-i18next"

/**
 * creates pop-up when user is inactive
 * @param {function} props.setPageNr setter for navigation
 * @param {function} props.globalNavState indicates the current selected page
 */
const TimeoutPopup = props => {
  //timing variables: 2 min until switching to homepage --> user gets warned 10s before
  const goToStartTime = 1000 * 60 * 2
  const warningTime = 1000 * 60 * (2 - 1 / 6)
  var warnTimeout
  var goToStartTimeout

  //translation
  const { t } = useTranslation()

  //bootstrap modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  /**
   * warns user when warntime is over
   */
  function warn() {
    if (props.globalNavState !== 0) handleShow()
  }

  /**
   * handles the switch to the startpage when time is up
   */
  function goToStart() {
    handleClose()
    history.push(process.env.PUBLIC_URL)
    props.setPageNr(0)
  }

  /**
   * sets timeouts for warning and going back to the start page
   */
  function setTimeouts() {
    warnTimeout = setTimeout(warn, warningTime)
    goToStartTimeout = setTimeout(goToStart, goToStartTime)
  }

  /**
   * clears all timeouts
   */
  function clearTimeouts() {
    clearTimeout(warnTimeout)
    clearTimeout(goToStartTimeout)
  }

  /**
   * react lifecycle
   */
  useEffect(() => {
    //possible events that trigger the reset of the timeouts
    const events = ["load", "mousemove", "mousedown", "click", "scroll", "touchstart"]

    /**
     * resets current timeouts and sets new timeouts
     */
    function resetTimeout() {
      //close modal when user starts interacting again
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
  }, [])

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
