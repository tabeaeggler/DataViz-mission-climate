import React, { Component } from "react"
import { Router, Switch, Route } from "react-router-dom"

import Snowline from "../components/climate2/SnowLineOverview"
import Climate1 from "../components/climate1/Climate1"
import Glacier from "../components/climate2/GlacierMeltOverview"
import history from "./history"

export default class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Climate1} />
          <Route path="/Snowline" component={Snowline} />
          <Route path="/Glacier" component={Glacier} />
        </Switch>
      </Router>
    )
  }
}
