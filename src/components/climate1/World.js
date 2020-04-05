import Globe from "react-globe.gl"
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { scaleSequential, interpolateYlOrRd } from "d3"

const World = () => {
  // const { t, i18n } = useTranslation()
  // function handleClick(lang) {
  //   i18n.changeLanguage(lang)
  // }

  const [countries, setCountries] = useState({ features: [] })
  const [clickedCountry, setClickedCountry] = useState()
  const currentLocationMarker = [
    {
      text: "You are here",
      latitude: 46.85048,
      longitude: 8.20635,
      coutry: "Switzerland"
    }
  ]

  useEffect(() => {
    // load data
    fetch(
      "https://raw.githubusercontent.com/tabeaeggler/geojson/master/geojson_temperature.geojson"
    )
      .then(res => res.json())
      .then(setCountries)
  }, [])

  const colorScale = scaleSequential(interpolateYlOrRd).domain([0, 3])

  //temperature values
  const getVal = feat => feat.properties.TEMP

  console.log()

  return (
    <Globe
      showGraticules={true}
      polygonsData={countries.features}
      polygonAltitude={d => (d === clickedCountry ? 0.12 : 0.06)}
      polygonCapColor={d => colorScale(getVal(d))}
      polygonSideColor={() => "rgba(0, 0, 0, 0.2)"}
      polygonStrokeColor={() => "#111"}
      polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN}:</b> <br />
        TEMP: <i>${d.TEMP}</i><br/>
      `}
      onPolygonClick={setClickedCountry}
      polygonsTransitionDuration={300}
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
      labelSize={1}
      labelDotRadius={0.4}
      labelColor={() => "rgba(255, 165, 0, 0.75)"}
      labelResolution={6}
    />
  )
}
export default World
