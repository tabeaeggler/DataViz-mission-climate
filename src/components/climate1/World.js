import React, { useState, useEffect, useRef } from "react"
import { scaleSequential, interpolateYlOrRd, csv } from "d3"
import { useTranslation } from "react-i18next"
import Globe from "react-globe.gl"
import OpenSans from "../../assets/font/OpenSansRegular.json"
import TemperatureLineGraph from "./TemperatureLineGraph"
import LocationButton from "../../assets/img/location.svg"
import climateDataPath from "../../assets/data_climate1/climate_change_cleaned.csv"
import globalDataPath from "../../assets/data_climate1/climate_change_global_cleaned.csv"
import { CSSTransition } from "react-transition-group"
import ButtonRight from "../../assets/img/buttonRight.svg"
import history from '../../routing/history';

/**
 * Creates a interactive globe to show climate warming
 * and renders TemperatureLineGraph for selected country.
 */
const World = () => {
  const { t } = useTranslation()
  const globeElement = useRef()
  const [countries, setCountries] = useState({
    features: [],
  })
  const [climateData, setClimateData] = useState([])
  const [clickedCountry, setClickedCountry] = useState({
    country: undefined,
    filteredCountry: [],
  })
  const [globalData, setGlobalData] = useState()
  const currentLocationMarker = [
    {
      text: t("Climate1_Location"),
      latitude: 46.85048,
      longitude: 8.20635,
      coutry: "Switzerland",
    },
  ]
  const colorScaleGlobe = scaleSequential(interpolateYlOrRd).domain([0, 3])
  const getVal = feat => feat.properties.TEMP
  const [showInitialBubble, setShowInitialBubble] = useState(true)

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
      <Globe
        //global config
        ref={globeElement}
        showGraticules={true}
        backgroundColor={"#141416"}
        showAtmosphere={false}
        width={window.innerWidth / 2}
        //country config
        polygonsData={countries.features}
        polygonAltitude={d => (d === clickedCountry.country ? 0.12 : 0.06)}
        polygonCapColor={d => colorScaleGlobe(getVal(d))}
        polygonSideColor={d =>
          d === clickedCountry.country ? "rgba(0, 0, 0, 1)" : "rgba(0, 0, 0, 0)"
        }
        polygonStrokeColor={() => "rgba(0, 0, 0, 0.2)"}
        polygonLabel={({ properties: d }) => `
        <b>${eval(t("Climate1_TooltipTemperature.3"))}</b> <br />
        ${t("Climate1_TooltipTemperature.1")}: ${
          d.TEMP === "NO_DATA" || d.TEMP === "nan"
            ? t("Climate1_TooltipTemperature.2")
            : Number(d.TEMP).toFixed(1) + "°C"
        }<br/>
      `}
        onPolygonClick={d => updateCountry(d)}
        polygonsTransitionDuration={300}
        //position-marker config
        labelTypeFace={OpenSans}
        labelsData={currentLocationMarker}
        labelLat={d => d.latitude}
        labelLng={d => d.longitude}
        labelText={d => d.text}
        labelAltitude={d => {
          if (clickedCountry.country !== undefined) {
            return clickedCountry.country.properties.ADMIN === d.coutry
              ? 0.12
              : 0.06
          }
          return 0.06
        }}
        labelSize={1}
        labelDotRadius={0.5}
        labelColor={() => "rgba(187, 185, 185, 1)"}
        labelResolution={6}
      />
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
        altitude: 2.7,
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
        o =>
          o.country_code.toLowerCase() ===
          country.properties.ISO_A2.toLowerCase()
      ),
    })
    setShowInitialBubble(false)
  }

  /**
   * Adds Speach Bubble with text for Globe
   */
  function createBubbleGlobe() {
    return (
      <CSSTransition
        in={showInitialBubble}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
        <div className="bubble-box bubble-box-climate1-globe">
          <p className="bubble-box-text">{t("Climate1_Bubble.1")}</p>
          <button
            id="next-button"
            onClick={() =>
              setShowInitialBubble(false)
            }>
            <img src={ButtonRight} alt="continue"></img>
          </button>
        </div>
      </CSSTransition>
    )
  }

  /**
   * Adds Speach Bubble with text for Linegraph
   */
  function createBubbleLineGraph() {
    return (
      <CSSTransition
        in={!showInitialBubble}
        timeout={4000}
        classNames="bubble-fade"
        unmountOnExit
        appear>
          <div className="bubble-box bubble-box-climate1-linegraph">
            <p className="bubble-box-text">{t("Climate1_Bubble.2")}</p>
            <button
            id="next-button"
            onClick={() => {
              history.push('/Climate2')
            }
              }>
            <img src={ButtonRight} alt="continue"></img>
            </button>
          </div>
      </CSSTransition>
    )
  }

  function createLinegraph() {
    return (
      <CSSTransition
        in={true}
        timeout={200000}
        classNames="fade"
        unmountOnExit
        appear>
        <div className="linegraph-container">
          <div className="linegraph-text-container">
            {globalData === undefined ? null : (
              <TemperatureLineGraph
                selectedCountry={clickedCountry.country}
                climateData={clickedCountry.filteredCountry}
                globalData={globalData}
              />
            )}
            <div className="info-box-linegraph">
              <h6>{t("Climate1_Source")}</h6>
              {createBubbleLineGraph()}
            </div>
          </div>
        </div>
      </CSSTransition>
    )
  }

  /**
   * React Lifecycle -> Renders only once
   */
  useEffect(() => {
    loadData()
    handleZoom()
  }, [])

  return (
    <React.Fragment>
      <div className="globe-container">
        {createGlobe()}
        {createBubbleGlobe()}
        <div className="location-button">
          <button onClick={handleZoom}>
            <img src={LocationButton} alt="location"></img>
            {t("Climate1_Location")}
          </button>
        </div>
      </div>
      {createLinegraph()}
    </React.Fragment>
  )
}
export default World
