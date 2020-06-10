import React, { useState, useEffect, useRef } from "react"
import { scaleSequential, interpolateYlOrRd, csv, interpolateRdYlBu, select } from "d3"
import { useTranslation } from "react-i18next"
import Globe from "react-globe.gl"
import OpenSans from "../../assets/font/OpenSansRegular.json"
import TemperatureLineGraph from "./TemperatureLineGraph"
import LocationButton from "../../assets/img/location.svg"
import climateDataPath from "../../assets/data_climate1/climate_change_cleaned.csv"
import globalDataPath from "../../assets/data_climate1/climate_change_global_cleaned.csv"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonNavRight.svg"
import ButtonLeft from "../../assets/img/buttonNavLeft.svg"
import history from "../../routing/history"
import { Modal } from "react-bootstrap"
import { legendColor } from "d3-svg-legend"

/**
 * Creates a interactive globe to show climate warming
 * and renders TemperatureLineGraph for selected country.
 */
const World = () => {
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

  //speech bubbles
  const [showInitialBubble, setShowInitialBubble] = useState(true)
  //bootstrap modal
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  /**
   * Loads the data for the globe and TemperatureLineGraph
   */
  function loadData() {
    //fetch geojson data
    fetch("../../../geojson_temp_translations.geojson")
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
   * Creates a Globe with react-globe.gl
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
        <b>${eval(t("Climate1_TooltipTemperature.3"))}</b> <br />
        ${t("Climate1_TooltipTemperature.1")}: ${
            d.TEMP === "NO_DATA" || d.TEMP === "nan"
              ? t("Climate1_TooltipTemperature.2")
              : Number(d.TEMP).toFixed(1) + "°C"
          }<br/>
      `}
          onPolygonClick={function (d) {
            updateCountry(d)
            handleShow()
          }}
          polygonsTransitionDuration={300}
          //position-marker config
          labelTypeFace={OpenSans}
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
        {createModal()}
        <div className="location-button">
          <button onClick={handleZoom}>
            <img src={LocationButton} alt="location"></img>
            <br></br>
            {t("Climate1_Location")}
          </button>
        </div>
      </div>
    )
  }

  function createModal() {
    return (
      <Modal show={show} onHide={handleClose} keyboard={false} centered={true}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {createLinegraph()}
        </Modal.Body>
        <Modal.Footer>
        {t("Climate1_Title.2")}
        </Modal.Footer>
      </Modal>
    )
  }

  /**
   * Initial zoom on Europe/Swittzeland
   */
  function handleZoom() {
    globeElement.current.pointOfView(
      {
        lat: 30,
        lng: 10,
        altitude: 3,
      },
      2500
    )
  }

  /**
   * Updates selected country and filter climate data for selected country
   * @param {country object} country
   */
  function updateCountry(country) {
    setClickedCountry({
      country: country,
      filteredCountry: climateData.filter(
        o => o.country_code.toLowerCase() === country.properties.ISO_A2.toLowerCase()
      ),
    })
    setShowInitialBubble(false)
  }

  /**
   * Adds next navigation button
   * @returns dom element with arrow button right
   */
  function navigationNext() {
    return (
      <CSSTransition in={true} timeout={2000} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-next-button">
          <button
            onClick={() => {
              history.push("/Snowline")
            }}>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Adds back navigation button
   * @returns dom element with arrow button left
   */
  function navigationBack() {
    return (
      <CSSTransition in={true} timeout={2000} classNames="show-button" unmountOnExit appear>
        <div className="navigation-button navigation-back-button">
          <button
            onClick={() => {
              console.log("Go to start page")
            }}>
            <img src={ButtonLeft} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Creates linegraph
   * @returns dom element linegraph
   */
  function createLinegraph() {
    return (
      <CSSTransition in={true} timeout={200000} classNames="fade" unmountOnExit appear>
        <div>
          {globalData === undefined ? null : (
            <TemperatureLineGraph
              selectedCountry={clickedCountry.country}
              climateData={clickedCountry.filteredCountry}
              globalData={globalData}
            />
          )}
        </div>
      </CSSTransition>
    )
  }

  /**
   * Creates color-scale legend for globe
   */
  function createLegend() {
    const colorScaleLegend = scaleSequential(interpolateRdYlBu).domain([3, -3])
    const svg = select(svgRefLegend.current)
    var legend = legendColor()
      .title("Temperaturabweichungen")
      .scale(colorScaleLegend)
      .cells(8)
      .orient("horizontal")
      .shapeWidth(33)
      .shapePadding(0)
      .shapeHeight(5)
    svg.call(legend)
  }

  /**
   * React Lifecycle -> Renders only once
   */
  useEffect(() => {
    createLegend()
    loadData()
    handleZoom()
  }, [])

  return (
    <React.Fragment>
      {createGlobe()}
      {navigationNext()}
      {navigationBack()}
      <svg className="legend-world">
        <g ref={svgRefLegend}></g>
      </svg>
    </React.Fragment>
  )
}
export default World
