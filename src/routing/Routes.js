import React, { Component } from "react"
import { Router, Switch, Route } from "react-router-dom"

import Snowline from "../components/climate2/Climate2"
import Climate1 from "../components/climate1/Climate1"
import Glacier from "../components/climate2/GlacierOverview"
import Glacier2 from "../components/climate2/GlacierOverview"
import Cause from "../components/climate3/Climate3"
import history from "./history"

export default class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Climate1} />
          <Route path="/Snowline" component={Snowline} />
          <Route path="/Glacier" component={Glacier} />
          <Route path="/Glacier2" component={Glacier2} />
          <Route path="/Cause" component={Cause} />
        </Switch>
      </Router>
    )
  }
}
