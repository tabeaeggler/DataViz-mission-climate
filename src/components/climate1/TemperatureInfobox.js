import React from "react"
import { useTranslation } from "react-i18next"

function TemperatureInfobox() {
  const { t } = useTranslation()
  return (
      <div className="info-box">
          <h3>Die Welt wird wärmer! </h3>
      <p>
              Laut den Daten des Institutes für «Space Studies»
              der NASA, steigt die globale Temperatur stetig seit 1961. Im Jahr 2019
              war die globale Temperatur knapp 1.5°C höher als die mittlere globale
              Temperatur von 1950 - 81. Was denkst du welche Länder am meisten von der
              Klimaerwärmung betroffen sind? <button>Weiter</button>
      </p>
    </div>
  )
}

export default TemperatureInfobox
