import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import home from "./components/home"
import "./App.css"

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={home} />
        {/* <Route exact path="/lobbies/:code" component={lobby} /> */}
      </Switch>
    </Router>
  )
}

export default App
