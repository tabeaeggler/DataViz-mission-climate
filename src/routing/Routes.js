import React from "react"
import { Router, Switch, Route } from "react-router-dom"
import Snowline from "../components/climate2/Climate2"
import Climate1 from "../components/climate1/Climate1"
import Cause from "../components/climate3/Climate3"
import history from "./history"

/**
 * Rendering of components with specific path
 * @param {function} props.setPageNr setter for navigation page
 */
const Routes = props => {
  return (
    <div>
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={() => <Climate1 setPageNr={props.setPageNr} />} />
          <Route path="/Snowline" component={() => <Snowline setPageNr={props.setPageNr} />} />
          <Route path="/Cause" component={() => <Cause setPageNr={props.setPageNr} />} />
        </Switch>
      </Router>
    </div>
  )
}

export default Routes
