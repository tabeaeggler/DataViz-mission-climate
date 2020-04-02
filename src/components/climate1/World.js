import Globe from "react-globe.gl"
import ReactDOM from "react-dom"
import React, { useState, useEffect, useMemo } from "react"
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
    fetch("../../assets/data climate1/geojson_temperature_added.geojson")
      .then(res => res.json())
      .then(setCountries)
  }, [])

  console.log(countries.features)
  const colorScale = scaleSequentialSqrt(interpolateYlOrRd)

  // GDP per capita (avoiding countries with small pop)
  const getVal = feat =>
    feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST)

  const maxVal = useMemo(() => Math.max(...countries.features.map(getVal)), [
    countries
  ])
  colorScale.domain([0, maxVal])

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
        GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
        Population: <i>${d.POP_EST}</i>
      `}
      onPolygonHover={setHoverD}
      polygonsTransitionDuration={300}
    />
  )
}

ReactDOM.render(<World />, document.getElementById("globeViz"))

export default World
