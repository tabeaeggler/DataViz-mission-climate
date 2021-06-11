import React, { useState, useEffect, useRef, useCallback } from "react"
import { scaleSequential, interpolateYlOrRd, csv, interpolateRdYlBu, select } from "d3"
import { useTranslation } from "react-i18next"
import Globe from "react-globe.gl"
import Gudea from "../../assets/font/Gudea_Regular.json"
import TemperatureLineGraph from "./TemperatureLineGraph"
import LocationButton from "../../assets/img/buttonLocation.svg"
import climateDataPath from "../../assets/data_climate1/climate_change_cleaned.csv"
import globalDataPath from "../../assets/data_climate1/climate_change_global_cleaned.csv"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonNavRight.svg"
import ButtonLeft from "../../assets/img/buttonNavLeft.svg"
import history from "../../routing/history"
import { Modal } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import { legendColor } from "d3-svg-legend"

/**
 * creates a interactive globe to show climate warming
 * and renders TemperatureLineGraph for selected country.
 * @param {function} props.setPageNr setter for navigation 
 */
const World = props => {
  //translation
  const { t } = useTranslation()
  //globe
  const globeElement = useRef()
  const currentLocationMarker = [
    {
      text: t("Climate1_Location"),
      latitude: 46.85048,
      longitude: 8.20635,
      coutry: "Switzerland",
    },
  ]
  //data
  const [countries, setCountries] = useState({
    features: [],
  })
  const [climateData, setClimateData] = useState([])
  const [clickedCountry, setClickedCountry] = useState({
    country: undefined,
    filteredCountry: [],
  })
  const [globalData, setGlobalData] = useState()
  //color scale
  const colorScaleGlobe = scaleSequential(interpolateYlOrRd).domain([0, 3])
  const getVal = feat => feat.properties.TEMP
  const svgRefLegend = useRef()
  //bootstrap modal
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  //animation
  const [timeoutIds, setTimeoutIds] = useState([])

  /**
   * Loads the data for the globe and TemperatureLineGraph
   */
  function loadData() {
    //fetch geojson data
    fetch("geojson_temp_translations.geojson")
      .then(res => res.json())
      .then(setCountries)

    //fetch country climate data
    csv(climateDataPath).then(data => {
      setClimateData(data)
    })

    //fetch global climate data
    csv(globalDataPath).then(function (d) {
      setGlobalData(d)
    })
  }

  /**
   * handles the initial animation of the globe
   */
  const handleInitialAnimation = useCallback(() => {
    var timeoutIds = []

    timeoutIds.push(zoom(30, 10, 3, 1500, 0))
    timeoutIds.push(zoom(30, 30, 3, 1500, 1))
    timeoutIds.push(zoom(30, -10, 3, 1500, 2))
    timeoutIds.push(zoom(30, 10, 3, 1500, 3))
    timeoutIds.push(zoom(30, 10, 2, 1500, 4))
    timeoutIds.push(zoom(30, 10, 3, 1500, 5))

    setTimeoutIds([...timeoutIds])
    return timeoutIds
  }, [])

  /**
   * animation helper, zooms to specified location
   */
  function zoom(lat, long, alt, time, order) {
    //save all scheduled functions
    return setTimeout(() => {
      globeElement.current.pointOfView(
        {
          lat: lat,
          lng: long,
          altitude: alt,
        },
        time
      )
    }, time * order)
  }

  /**
   * updates selected country and filter climate data for selected country
   * @param {country object} country
   */
  function updateCountry(country) {
    setClickedCountry({
      country: country,
      filteredCountry: climateData.filter(o => o.country_code.toLowerCase() === country.properties.ISO_A2.toLowerCase()),
    })
  }

  /**
   * creates a globe with react-globe.gl
   * @returns dom element with globe
   */
  function createGlobe() {
    return (
      <div className="globe-container">
        <Globe
          //global config
          ref={globeElement}
          showGraticules={true}
          backgroundColor={"#141416"}
          showAtmosphere={false}
          width={window.innerWidth}
          //country config
          polygonsData={countries.features}
          polygonAltitude={d => (d === clickedCountry.country ? 0.12 : 0.06)}
          polygonCapColor={d => colorScaleGlobe(getVal(d))}
          polygonSideColor={d => (d === clickedCountry.country ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0)")}
          polygonStrokeColor={() => "rgba(0, 0, 0, 0.2)"}
          polygonLabel={({ properties: d }) => `
          
        <b>${/* eslint-disable no-eval */ eval(t("Climate1_TooltipTemperature.3"))}</b> <br />
        ${t("Climate1_TooltipTemperature.1")}: ${
            d.TEMP === "NO_DATA" || d.TEMP === "nan" ? t("Climate1_TooltipTemperature.2") : Number(d.TEMP).toFixed(1) + "°C"
          }<br/>
      `}
          onPolygonClick={function (d) {
            //handle countries with no data
            if (d.properties.TEMP === "NO_DATA" || d.properties.TEMP === "nan") return
            //let country rise, then show modal
            setTimeout(() => {
              handleShow()
            }, 600)

            updateCountry(d)
            clearScheduledAnimations(timeoutIds)
          }}
          polygonsTransitionDuration={300}
          //position-marker config
          labelTypeFace={Gudea}
          labelsData={currentLocationMarker}
          labelLat={d => d.latitude}
          labelLng={d => d.longitude}
          labelText={d => d.text}
          labelAltitude={d => {
            if (clickedCountry.country !== undefined) {
              return clickedCountry.country.properties.ADMIN === d.coutry ? 0.12 : 0.06
            }
            return 0.06
          }}
          labelSize={1}
          labelDotRadius={0.5}
          labelColor={() => "rgba(187, 185, 185, 1)"}
          labelResolution={6}
        />
      </div>
    )
  }

  /**
   * clears all scheduled functions calls for the initial animation
   *  @param {array} ids array with all timout ids
   */
  function clearScheduledAnimations(ids) {
    //clear excecution of all triggered functions
    ids.forEach(id => {
      clearTimeout(id)
    })
  }

  /**
   * creates the button center the globe on the current location of the user
   * @returns dom element with location button
   */
  function createLocationButton() {
    return (
      <div className="location-button">
        <button onClick={() => zoom(30, 10, 3, 2000, 0)}>
          <img src={LocationButton} alt="location"></img>
          <br></br>
          {t("Climate1_Location")}
        </button>
      </div>
    )
  }

  /**
   * creates a modal with additional information of the clicked country
   * @returns dom element with modal
   */
  function createModal() {
    return (
      <Modal show={show} onHide={handleClose} keyboard={false}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>{createLinegraph()}</Modal.Body>
        <Modal.Footer>
          {t("Climate1_Bubble.1")}
          <b>{t("Climate1_Bubble.2")}</b>
          {t("Climate1_Bubble.3")}
        </Modal.Footer>
      </Modal>
    )
  }

  /**
   * creates linegraph
   * @returns dom element with linegraph
   */
  function createLinegraph() {
    return (
      <div>
        {globalData === undefined ? null : ( //only show linegraph when clickevent occured
          <TemperatureLineGraph selectedCountry={clickedCountry.country} climateData={clickedCountry.filteredCountry} globalData={globalData} />
        )}
      </div>
    )
  }

  /**
   * adds next navigation button
   * @returns dom element with arrow button right
   */
  function navigationNext() {
    return (
      <CSSTransition in={true} timeout={2000} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-next-button">
          <button
            onClick={() => {
              props.setPageNr(2)
              history.push(process.env.PUBLIC_URL + "/snowline")
            }}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * adds back navigation button
   * @returns dom element with arrow button left
   */
  function navigationBack() {
    return (
      <CSSTransition in={true} timeout={2000} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-back-button">
          <button
            onClick={() => {
              props.setPageNr(0)
              history.push(process.env.PUBLIC_URL)
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * appends legend for globe to svg
   */
  const createLegend = useCallback(() => {
    const colorScaleLegend = scaleSequential(interpolateRdYlBu).domain([3, -3])
    const svg = select(svgRefLegend.current)

    var legend = legendColor().title(t("Climate1_Legend")).scale(colorScaleLegend).cells(8).orient("horizontal").shapeWidth(42.5).shapePadding(0).shapeHeight(5)
    svg.call(legend)
  }, [t])

  /**
   * react lifecycle
   */
  useEffect(() => {
    props.setPageNr(1)
    createLegend()
    loadData()

    const ids = handleInitialAnimation()
    return () => {
      clearScheduledAnimations(ids)
    }
  }, [props, createLegend, handleInitialAnimation])

  return (
    <React.Fragment>
      {createGlobe()}
      {createLocationButton()}
      {createModal()}
      {navigationNext()}
      {navigationBack()}
      <svg className="legend-world">
        <g ref={svgRefLegend}></g>
      </svg>
    </React.Fragment>
  )
}
export default World
