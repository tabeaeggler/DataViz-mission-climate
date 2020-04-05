import Globe from "react-globe.gl"
import React, { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import {
  scaleSequential,
  interpolateYlOrRd,
  interpolateRdBu,
  interpolateRdYlBu,
  interpolateOranges,
  interpolateTurbo
} from "d3"

const World = () => {
  const { t } = useTranslation()
  const globeEl = useRef()
  const [countries, setCountries] = useState({ features: [] })
  const [clickedCountry, setClickedCountry] = useState()
  const currentLocationMarker = [
    {
      text: t("Standort"),
      latitude: 46.85048,
      longitude: 8.20635,
      coutry: "Switzerland"
    }
  ]

  const colorScale = scaleSequential(interpolateYlOrRd).domain([0, 3])
  // const colorScale = scaleSequential(interpolateYlOrRd).domain([-1, 4])
  // const colorScale = scaleSequential(interpolateRdBu).domain([3, -3])
  // const colorScale = scaleSequential(interpolateRdYlBu).domain([3, -3])
  // const colorScale = scaleSequential(interpolateOranges).domain([0, 3])
  // const colorScale = scaleSequential(interpolateTurbo).domain([-5, 3])

  const getVal = feat => feat.properties.TEMP

  useEffect(() => {
    // load data
    fetch(
      "https://raw.githubusercontent.com/tabeaeggler/geojson/master/geojson_temperature.geojson"
    )
      .then(res => res.json())
      .then(setCountries)

    //initial zoom on europe
    globeEl.current.pointOfView(
      {
        lat: 30,
        lng: 10,
        altitude: 1
      },
      6000
    )
  }, [])

  return (
    <Globe
      //global config
      ref={globeEl}
      showGraticules={true}
      backgroundColor={"#4D4D50"}
      showAtmosphere={false}
      //country config
      polygonsData={countries.features}
      polygonAltitude={d => (d === clickedCountry ? 0.12 : 0.06)}
      polygonCapColor={d => colorScale(getVal(d))}
      polygonSideColor={d =>
        d === clickedCountry ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
      }
      polygonStrokeColor={() => "rgba(0, 0, 0, 0.2)"}
      polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN}</b> <br />
        ${t("TooltipTemperatur.1")}: ${
        d.TEMP === "NO_DATA" || d.TEMP === "nan"
          ? t("TooltipTemperatur.2")
          : Number(d.TEMP).toFixed(1) + "°C"
      }<br/>
      `}
      onPolygonClick={setClickedCountry}
      polygonsTransitionDuration={300}
      //position-marker config
      labelsData={currentLocationMarker}
      labelLat={d => d.latitude}
      labelLng={d => d.longitude}
      labelText={d => d.text}
      labelAltitude={d => {
        if (clickedCountry !== undefined) {
          return clickedCountry.properties.ADMIN === d.coutry ? 0.12 : 0.06
        }
        return 0.06
      }}
      labelSize={0.7}
      labelDotRadius={0.4}
      labelColor={() => "rgba(255, 165, 0, 1)"}
      labelResolution={6}
    />
  )
}
export default World
