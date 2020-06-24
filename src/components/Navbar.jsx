import React, { useState } from "react"
import { Link } from "react-router-dom"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* <Link to="/"> */}
          <h1>Longest Word Game</h1>
          {/* </Link> */}
          <Button
            color="inherit"
            style={{ marginLeft: "auto" }}
            onClick={() => setOpen(true)}
          >
            Rules
          </Button>
        </Toolbar>
      </AppBar>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <DialogContent>
          <DialogContentText variant="h4" color="textPrimary">
            Rules
          </DialogContentText>
          <DialogContentText variant="body1">
            Each round you will see a list of letters, which you must try to
            find the highest scoring word before the time runs out.
          </DialogContentText>
          <DialogContentText variant="h5" color="textPrimary">
            Scoring
          </DialogContentText>
          <DialogContentText>
            Each letter of your word will have a different value; rarer letters
            are worth more. We use the same letter scoring system as Scrabble.
          </DialogContentText>
          <DialogContentText>
            <ul>
              <li>(1 point) -A, E, I, O, U, L, N, S, T, R.</li>
              <li>(2 points) -D, G.</li>
              <li>(3 points) -B, C, M, P. </li>
              <li>(4 points) -F, H, V, W, Y.</li>
              <li>(5 points) -K.</li>
              <li>(8 points) -J, X.</li>
              <li>(10 points) -Q, Z.</li>
            </ul>
          </DialogContentText>
          <DialogContentText>
            You will also get a bonus for finding a word before the timer is up.
            For every 2 seconds left on the timer when you lock in, you will
            earn an additional point.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            color="primary"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
