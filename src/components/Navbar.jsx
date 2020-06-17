import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <h1>Longest Word Game</h1>
      </Toolbar>
    </AppBar>
  )
}
