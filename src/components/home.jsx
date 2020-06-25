import React, { useState, useEffect } from "react"
import { db, auth } from "../util/firebase"
import keygen from "keygenerator"
import { useHistory } from "react-router-dom"

// Material UI
import Grid from "@material-ui/core/Grid"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogContent from "@material-ui/core/DialogContent"
import DialogContentText from "@material-ui/core/DialogContentText"
import DialogTitle from "@material-ui/core/DialogTitle"
import Paper from "@material-ui/core/Paper"

function Home() {
  const history = useHistory()

  const [openJoin, setOpenJoin] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [joinError, setJoinError] = useState(false)

  const handleJoinSubmit = (e) => {
    e.preventDefault()
    db.doc(`lobbies/${code}`)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          setJoinError(true)
        } else {
          auth.signInAnonymously().then(() => {
            auth.currentUser
              .updateProfile({
                displayName: name,
              })
              .then(() => {
                db.collection(`lobbies/${code}/users`)
                  .doc(auth.currentUser.uid)
                  .set({
                    name: auth.currentUser.displayName,
                    points: 0,
                    isReady: false,
                    joined: Date.now(),
                    host: false,
                  })
                  .then(() => {
                    history.push(`/lobbies/${code}`)
                  })
                  .catch((err) => console.error(err))
              })
          })
        }
      })
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    console.log("Submitted")
    auth.signInAnonymously().then(() => {
      auth.currentUser
        .updateProfile({
          displayName: name,
        })
        .then(() => {
          console.log(auth.currentUser)
          let lobbyID = keygen._({
            forceUppercase: true,
            length: 5,
            numbers: false,
          })
          console.log(lobbyID)
          db.collection("lobbies")
            .doc(lobbyID)
            .set({
              status: "in lobby",
              numberOfLetters: 8,
              numberOfSeconds: 20,
            })
            .then(() => {
              db.collection(`lobbies/${lobbyID}/users`)
                .doc(auth.currentUser.uid)
                .set({
                  name: auth.currentUser.displayName,
                  points: 0,
                  isReady: false,
                  joined: Date.now(),
                  host: true,
                })
                .catch((err) => console.error(err))

              setLoading(false)
            })
            .then(() => {
              history.push(`/lobbies/${lobbyID}`)
            })
        })
    })
  }

  return (
    <>
      <Grid
        container
        justify="center"
        direction="column"
        alignItems="center"
        style={{ marginTop: "25vh" }}
      >
        <Paper elevation={3}>
          <Grid
            container
            justify="space-around"
            direction="column"
            alignItems="stretch"
            style={{ padding: "5rem" }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setOpenJoin(true)}
            >
              Join Game
            </Button>
            <br />
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => setOpenCreate(true)}
            >
              Create Game
            </Button>
          </Grid>
        </Paper>
      </Grid>
      {/* Join lobby dialog */}
      <Dialog open={openJoin} onClose={() => setOpenJoin(false)} fullWidth>
        <DialogTitle>Join Game</DialogTitle>
        <form onSubmit={handleJoinSubmit}>
          <DialogContent>
            <DialogContentText>Connect with your friends!</DialogContentText>
            <TextField
              autoFocus
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
              type="text"
              fullWidth
              required
            />
            <TextField
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              label="Access Code"
              type="text"
              error={joinError}
              helperText={joinError && "Lobby not found"}
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenJoin(false)} color="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      {/* New lobby dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth>
        <DialogTitle>Create Game</DialogTitle>
        <form onSubmit={handleCreateSubmit}>
          <DialogContent>
            <DialogContentText>
              Create a game and play with friends!
            </DialogContentText>
            <TextField
              autoFocus
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
              type="text"
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreate(false)} color="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default Home
