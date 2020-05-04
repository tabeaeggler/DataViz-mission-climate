import React from "react"
import SnowLineOverview from "./SnowLineOverview"
import { useTranslation } from "react-i18next"
import Snow from "react-snowstorm"
import { CSSTransition } from "react-transition-group"
import "./climate2.css"

function Climate2() {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <CSSTransition
        in={true}
        timeout={100000}
        classNames="fade"
        unmountOnExit
        appear>
        <div>
          <h1 className="climate2-title"> {t("Climate2_Title.1")}</h1>
          <h2 className="climate2-subtitle">{t("Climate2_Title.2")}</h2>
          <SnowLineOverview />
        </div>
      </CSSTransition>
      <Snow
        animationInterval={50}
        followMouse={false}
        vMaxY={1.5}
        vMaxX={3}
        flakesMaxActive={90}
        flakesMax={150}></Snow>
    </React.Fragment>
  )
}

export default Climate2
