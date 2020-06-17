import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import "./App.css"

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        {/* <Route exact path="/lobbies/:code" component={lobby} /> */}
      </Switch>
    </Router>
  )
}

export default App
