import React from "react"
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Home from "./components/Home"
import Navbar from "./components/Navbar"
import Lobby from "./components/Lobby"
import "./App.css"
import { auth, db } from "./util/firebase"

function App() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log(`LOGGED IN as ${user.displayName} (${user.uid}) `)

      db.collectionGroup("users")
        .get()
        .then((res) => {
          let lobbyID = res.docs.find((doc) => doc.id === user.uid).ref.parent
            .parent.id

          if (window.location.pathname !== `/lobbies/${lobbyID}`) {
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
        <Route exact path="/" component={Home} />
        <Route exact path="/lobbies/:code" component={Lobby} />
      </Switch>
    </Router>
  )
}

export default App
