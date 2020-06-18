import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import Lobby from "./components/Lobby"
import "./App.css"

function App() {
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/lobbies/:code" component={Lobby} />
      </Switch>
    </Router>
  )
}

export default App
