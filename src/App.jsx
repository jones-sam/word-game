import React, { useState } from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import Lobby from "./components/Lobby"
import Game from "./components/Game"
import GameResults from "./components/GameResults"
import "./App.css"
import { auth, db } from "./util/firebase"

function App() {
  const [ongoingGame, setongoingGame] = useState(null)
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log(`LOGGED IN as ${user.displayName} (${user.uid}) `)

      db.collectionGroup("users")
        .get()
        .then((res) => {
          let lobbyID = res.docs.find((doc) => doc.id === user.uid).ref.parent
            .parent.id
          if (lobbyID) {
            setongoingGame(lobbyID)
          }

          if (window.location.pathname === "/") {
            console.info("Redirecting to lobby " + lobbyID)
            window.location = `/lobbies/${lobbyID}`
          }
        })
    } else {
      console.log("NOT LOGGED IN")
      if (window.location.pathname !== "/") {
        window.location = "/"
      }
    }
  })

  return (
    <Router>
      <Navbar />
      <Switch>
        <Route
          exact
          path="/"
          render={(props) => <Home {...props} ongoingGame={ongoingGame} />}
        />
        <Route
          exact
          path="/lobbies/:code"
          render={(props) => <Lobby {...props} ongoingGame={ongoingGame} />}
        />
        <Route exact path="/lobbies/:code/rounds/:roundID" component={Game} />
        <Route
          exact
          path="/lobbies/:code/rounds/:roundID/results"
          component={GameResults}
        />
      </Switch>
    </Router>
  )
}

export default App
