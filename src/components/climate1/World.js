import React, { useState, useEffect, useRef } from "react"
import { scaleSequential, interpolateYlOrRd, interpolateRdYlBu, select, csv } from "d3"
import { legendColor } from "d3-svg-legend"
import { useTranslation } from "react-i18next"
import Globe from "react-globe.gl"
import OpenSans from "../../assets/font/OpenSansRegular.json"
import TemperatureLineGraph from "./TemperatureLineGraph"
import InfoboxNavigation from "./InfoboxNavigation"
import LocationButton from "../../assets/img/location.svg"
import climateDataPath from "../../assets/data_climate1/climate_change_cleaned.csv"
import globalDataPath from "../../assets/data_climate1/climate_change_global_cleaned.csv"

/**
 * Creates a interactive globe to show climate warming
 * and renders TemperatureLineGraph for selected country.
 */
const World = () => {
  const { t } = useTranslation()
  const globeElement = useRef()
  const svgRef = useRef()
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
  const colorScaleLegend = scaleSequential(interpolateRdYlBu).domain([3, -3])
  const getVal = feat => feat.properties.TEMP

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
        labelDotRadius={0.4}
        labelColor={() => "rgba(255, 165, 0, 1)"}
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
      5000
    )
  }

  /**
   * Creates color-scale legend for globe
   */
  function createLegend() {
    const svg = select(svgRef.current).attr("transform", "translate(0,20)")
    var legend = legendColor()
      .scale(colorScaleLegend)
      .cells(8)
      .orient("vertical")
      .shapeWidth(5)
      .shapePadding(-2)
      .shapeHeight(35)
      // .title(t("Climate1_TooltipTemperature.1") + " °C")

    svg.call(legend)
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
  }

  /**
   * React Lifecycle -> Updates when ever legend changes
   */
  useEffect(() => {
    createLegend()
  })

  /**
   * React Lifecycle -> Renders only once
   */
  useEffect(() => {
    loadData()
    handleZoom()
  }, [])

  return (
    <React.Fragment>
      <div className="wrapper-container"></div>
      <div className="globe-container">
        {createGlobe()}
        <div className="location-button">
          <button onClick={handleZoom}> <img src={LocationButton}></img></button>
          <span>{t("Climate1_BackToLocation")}</span>
        </div>
      </div>
      <svg className="legend-world">
        <g ref={svgRef}></g>
      </svg>

      <div className="linegraph-container">
        <div className="linegraph-text-container">
          {globalData === undefined ? null : (
              <TemperatureLineGraph
                selectedCountry={clickedCountry.country}
                climateData={clickedCountry.filteredCountry}
                globalData={globalData}
              />
            )}
           <InfoboxNavigation
               upperLimit={3}
               textIdentifier={"Climate1_Textbox."}
             />
        </div>
      </div>
    </React.Fragment>
  )
}
export default World
