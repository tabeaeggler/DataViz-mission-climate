import React from "react"
import { Router, Switch, Route } from "react-router-dom"
import Snowline from "../components/climate2/Climate2"
import Climate1 from "../components/climate1/Climate1"
import Cause from "../components/climate3/Climate3"
import history from "./history"
import Start from "../components/Start"
import End from "../components/End"

/**
 * Rendering of components with specific path
 * @param {function} props.setPageNr setter for navigation
 */
const Routes = props => {
  return (
    <div>
      <Router history={history}>
        <Switch>
          <Route path={process.env.PUBLIC_URL} exact component={() => <Start setPageNr={props.setPageNr}/>} />
          <Route path={process.env.PUBLIC_URL + "/globe"} exact component={() => <Climate1 setPageNr={props.setPageNr} />} />
          <Route path={process.env.PUBLIC_URL + "/snowline"} component={() => <Snowline setPageNr={props.setPageNr} />} />
          <Route path={process.env.PUBLIC_URL + "/cause"} component={() => <Cause setPageNr={props.setPageNr} />} />
          <Route path={process.env.PUBLIC_URL + "/end"} component={() => <End setPageNr={props.setPageNr} />} />
        </Switch>
      </Router>
    </div>
  )
}

export default Routes
