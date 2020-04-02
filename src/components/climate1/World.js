import Globe from "react-globe.gl"
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { scaleSequentialSqrt, interpolateYlOrRd } from "d3"

const World = () => {
  // const { t, i18n } = useTranslation()
  // function handleClick(lang) {
  //   i18n.changeLanguage(lang)
  // }

  const [countries, setCountries] = useState({ features: [] })
  const [hoverD, setHoverD] = useState()

  useEffect(() => {
    // load data
    fetch(
      "https://raw.githubusercontent.com/tabeaeggler/geojson/master/geojson_temperature_str.geojson"
    )
      .then(res => res.json())
      .then(setCountries)
  }, [])

  const colorScale = scaleSequentialSqrt(interpolateYlOrRd).domain([0, 3])

  //temperature values
  const getVal = feat => feat.properties.TEMP

  return (
    <Globe
      polygonsData={countries.features}
      polygonAltitude={d => (d === hoverD ? 0.12 : 0.06)}
      polygonCapColor={d =>
        d === hoverD ? "steelblue" : colorScale(getVal(d))
      }
      polygonSideColor={() => "rgba(0, 100, 0, 0.15)"}
      polygonStrokeColor={() => "#111"}
      polygonLabel={({ properties: d }) => `
        <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
        TEMP: <i>${d.TEMP}</i> M$<br/>
      `}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    />
  )
}
export default World
