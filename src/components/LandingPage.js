import React, { useState, useEffect } from "react"
import history from "../routing/history"
import Screens from "../assets/img/screens.svg"
import ClimateScreen from "../assets/img/climate_screen.svg"
import WeatherScreen from "../assets/img/weather_screen.svg"
import climateVideo from "../assets/video/climate.mov"
import weatherVideo from "../assets/video/weather.mov"
import buttonDown from "../assets/img/buttonDown.svg"
import { Modal } from "react-bootstrap"
import "../App.css"

/**
 * creates landing page
 * @param {function} props.setIsLandingPage setter indicating if landing page should be shown
 */
const LandingPage = props => {
  //bootstrap modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const [popUpMsg, setPopUpMsg] = useState()
  const [popUpSubtitle, setPopUpSubtitle] = useState()
  const [isMobile, setIsMobile] = useState()
  const [clickedClimateScreen, setClickedClimateScreen] = useState()

  /**
   * handles screen click
   * @param {string} id
   */
  function handleClick(id) {
    const clickedClimateApp = id === "climate"
    setClickedClimateScreen(clickedClimateApp)
    if (isChrome() && isCorrectWindowSize()) {
      if (clickedClimateApp) {
        props.setIsLandingPage(false)
        history.push(process.env.PUBLIC_URL + "/start")
      } else {
        window.open("http://iit.cs.technik.fhnw.ch/mission-erde/wetter/", "_blank")
      }
    } else {
      createPopUpMsg()
    }
  }

  function createPopUpMsg() {
    if (!isCorrectWindowSize()) {
      setPopUpMsg("Oops... Your screen is too small - the applications are optimized for large screens only (minimum: 850px x 1700px)")
      setPopUpSubtitle("Watch a video of the application instead!")
    } else if (!isChrome()) {
      setPopUpMsg("Oops... Unfortunately, the applications can only be opened with Chrome!")
      setPopUpSubtitle("Download the Chrome browser or watch videos of the applications!")
    }

    handleShow()
  }

  function isChrome() {
    return navigator.userAgent.toLowerCase().indexOf("chrome") > -1 && navigator.vendor.toLowerCase().indexOf("google") > -1
  }

  function isCorrectWindowSize() {
    return window.outerHeight >= 1000 && window.outerWidth >= 1500
  }

  function scrollToVideos() {
    document.getElementById("video-wrapper").scrollIntoView({ behavior: "smooth" })
  }

  /**
   * react lifecycle
   */
  useEffect(() => {
    const isMobile = window.outerWidth <= 880
    setIsMobile(isMobile)
  })

  return (
    <div className="landing-page">
      <div className="landing-page-wrapper">
        <h1 className="landing-page-title">Mission Weather and Climate</h1>
        <p className="project-description">
          Visual processing of weather data for the Museum of Transport in Lucerne: "Mission Weather" and "Mission Climate" are two interactive web applications
          that were designed and implemented for two 49-inch touch screens as part of the exhibition "Mission Earth" at the Museum of Transport in Lucerne.
          Through interactive and personalized visualizations, visitors are introduced to the meaning of weather, the difference between weather and climate,
          and the problems of climate change. The goal of the project is to reduce the complexity of the topics and make them accessible to young people. The
          focus of the work is on interactivity and personalization of the visualizations as well as user experience design.
        </p>
        <div id="landing-page-screens">
          <div className="click-area click-area-left screen-setup" onClick={() => handleClick("weather")}></div>
          <div className="click-area click-area-right screen-setup" onClick={() => handleClick("climate")}></div>
          <img className="screen-setup" src={Screens} alt="screens" />
          <img className="single-screen" src={ClimateScreen} alt="screens" onClick={() => handleClick("climate")} />
          <img className="single-screen" src={WeatherScreen} alt="screens" onClick={() => handleClick("weather")} />
        </div>
        <Modal centered show={show} onHide={handleClose} keyboard={false}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body className="landing-page-modal-body">
            {popUpMsg}
            <p className="landing-page-modal-subtitle">{popUpSubtitle}</p>
            <br></br>
            {isMobile ? (
              <video
                controls="controls"
                width="100%"
                height="auto"
                name="weather application"
                src={clickedClimateScreen ? climateVideo + "#t=0.5" : weatherVideo}></video>
            ) : (
              <button
                onClick={() => {
                  handleClose()
                  scrollToVideos()
                }}
                className="landing-page-modal-button">
                Go to videos
                <img src={buttonDown}></img>
              </button>
            )}
          </Modal.Body>
        </Modal>
      </div>
      {!isMobile ? (
        <div id="video-wrapper">
          <div className="video-container">
            <h2 className="video-title">Weather application</h2>
            <video controls="controls" width="100%" height="auto" name="weather application" src={weatherVideo}></video>
          </div>
          <div className="climate-video video-container">
            <h2 className="video-title">Climate application</h2>
            <video preload="metadata" controls="controls" width="100%" height="auto" name="climate application" src={climateVideo + "#t=0.5"}></video>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default LandingPage
