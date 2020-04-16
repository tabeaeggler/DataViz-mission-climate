import Globe from "react-globe.gl"
import React, { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { scaleSequential, interpolateYlOrRd, select, csv } from "d3"
import { legendColor } from "d3-svg-legend"
import TemperatureLineGraph from "./TemperatureLineGraph"
import climateDataPath from "../../assets/data_climate1/climate_change_cleaned.csv"
import globalDataPath from "../../assets/data_climate1/climate_change_global_cleaned.csv"
import InfoboxNavigation from "./InfoboxNavigation"
import OpenSans from "../../assets/font/OpenSansRegular.json"

const World = () => {
  const { t } = useTranslation()
  const globeElement = useRef()
  const svgRef = useRef()
  const [countries, setCountries] = useState({ features: [] })
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
  const colorScale = scaleSequential(interpolateYlOrRd).domain([0, 3])
  const getVal = feat => feat.properties.TEMP

  useEffect(() => {
    // load geojson-data 2019
    fetch(
      "https://raw.githubusercontent.com/tabeaeggler/geojson/master/geojson_temp_translations.geojson"
    )
      .then(res => res.json())
      .then(setCountries)

    //fetch climate data
    csv(climateDataPath).then(data => {
      setClimateData(data)
    })

    //Fetch global climate data
    csv(globalDataPath).then(function (d) {
      setGlobalData(d)
    })

    //initial zoom on europe
    handleZoom()

    //create Legend
    const svg = select(svgRef.current)
    // var title = t("Climate1_TooltipTemperature.1")
    var legend = legendColor()
      .title(t("Climate1_TooltipTemperature.1"))
      .scale(colorScale)
      .cells(8)
      .orient("horizontal")
      .shapeWidth(30)
      .shapePadding(0)
      .shapeHeight(10)
    svg.call(legend)
  }, [])

  //zoom to Switzerland
  function handleZoom() {
    globeElement.current.pointOfView(
      {
        lat: 30,
        lng: 10,
        altitude: 1,
      },
      5000
    )
  }

  //update selected country and filter data
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

  return (
    <React.Fragment>
      <button className="location-button" onClick={handleZoom}>
        {t("Climate1_BackToLocation")}
      </button>

      <Globe
        //global config
        ref={globeElement}
        showGraticules={true}
        backgroundColor={"#141416"}
        showAtmosphere={false}
        //country config
        polygonsData={countries.features}
        polygonAltitude={d => (d === clickedCountry.country ? 0.12 : 0.06)}
        polygonCapColor={d => colorScale(getVal(d))}
        polygonSideColor={d =>
          d === clickedCountry.country
            ? "rgba(0, 0, 0, 1)"
            : "rgba(0, 0, 0, 0)"
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
        labelSize={0.7}
        labelDotRadius={0.4}
        labelColor={() => "rgba(255, 165, 0, 1)"}
        labelResolution={6}
      />
      <svg className="legend-world" ref={svgRef}></svg>
      <div className="linegraph-text-container">
        {clickedCountry.country === undefined ? null : (
          <div>
            <TemperatureLineGraph
              selectedCountry={clickedCountry.country}
              climateData={clickedCountry.filteredCountry}
              globalData={globalData}
            />
            <InfoboxNavigation
              upperLimit={3}
              textIdentifier={"Climate1_Textbox."}
            />
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
export default World
