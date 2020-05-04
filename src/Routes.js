import React, { Component } from "react"
import { Router, Switch, Route } from "react-router-dom"

import Climate2 from "./components/climate2/Climate2"
import Climate1 from "./components/climate1/Climate1"
import history from "./history"

export default class Routes extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <Route path="/" exact component={Climate1} />
          <Route path="/Climate2" component={Climate2} />
        </Switch>
      </Router>
    )
  }
}
