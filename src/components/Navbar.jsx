import React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        {/* <Link to="/"> */}
        <h1>Longest Word Game</h1>
        {/* </Link> */}
      </Toolbar>
    </AppBar>
  )
}
