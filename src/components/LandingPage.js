import React, { useState } from "react"
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

  /**
   * handles screen click
   * @param {string} id
   */
  function handleClick(id) {
    if (isChrome() && isCorrectWindowSize()) {
      if (id === "climate") {
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
      setPopUpMsg("Uups... Dein Screen ist zu klein - die Applikationen sind nur für grosse Screens optimiert (Minimum: 850px x 1700px)")
      setPopUpSubtitle("")
    } else if (!isChrome()) {
      setPopUpMsg("Uups... Leider können die Applikationen nur mit Chrome geöffnet werden!")
      setPopUpSubtitle("Lade den Chrome Browser herunter oder schaue dir Videos der Applikationen an!")
    }
    handleShow()
  }

  function isChrome() {
    return navigator.userAgent.toLowerCase().indexOf("chrome") > -1 && navigator.vendor.toLowerCase().indexOf("google") > -1
  }

  function isCorrectWindowSize() {
    console.log(window.outerHeight)
    console.log(window.outerWidth)
    return window.outerHeight >= 1000 && window.outerWidth >= 1500
  }

  function scrollToVideos() {
    document.getElementById("video-wrapper").scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="landing-page">
      <div className="landing-page-wrapper">
        <h1 className="landing-page-title">Mission Wetter und Klima</h1>
        <p className="project-description">
          Visuelle Aufbereitung von Wetterdaten fürs Verkehrshaus Luzern: «Mission Wetter» und «Mission Klima» sind zwei interaktive Web-Applikationen, welche
          für zwei 49 Zoll Touch-Bildschirme, im Rahmen der Ausstellung «Mission Erde» des Verkehrshaus Luzern, konzipiert und implementiert wurden. Anhand von
          interaktiven und personalisierten Visualisierungen wird den Besuchenden die Bedeutung des Wetters, der Unterschied zwischen Wetter und Klima und die
          Problematik des Klimawandels nähergebracht. Ziel des Projekts ist es, die Komplexität der Themen zu reduzieren und sie für Jugendliche zugänglich zu
          machen. Die Schwerpunkte der Arbeit liegen auf der Interaktivität und der Personalisierung der Visualisierungen sowie dem User Experience Design.
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
            <button
              onClick={() => {
                handleClose()
                scrollToVideos()
              }}
              className="landing-page-modal-button">
              Zu den Videos
              <img src={buttonDown}></img>
            </button>
          </Modal.Body>
        </Modal>
      </div>
      <div id="video-wrapper">
        <div className="climate-video video-container">
          <h2>Mission Klima</h2>
          <video preload="metadata" controls="controls" width="100%" height="auto" name="climate application" src={climateVideo + "#t=0.5"}></video>
        </div>
        <div className="video-container">
          <h2>Mission Wetter</h2>
          <video controls="controls" width="100%" height="auto" name="weather application" src={weatherVideo}></video>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
