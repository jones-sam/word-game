import React, { useState } from "react"
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
  const [openJoin, setOpenJoin] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)

  const handleJoinSubmit = (e) => {
    e.preventDefault()
    console.log("Submitted")
  }

  const handleCreateSubmit = (e) => {
    e.preventDefault()
    console.log("Submitted")
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
            <DialogContentText>Connect with your friend!</DialogContentText>
            <TextField
              autoFocus
              id="name"
              label="Name"
              type="text"
              fullWidth
              required
            />
            <TextField
              id="code"
              label="Access Code"
              type="text"
              fullWidth
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenJoin(false)} color="secondary">
              Cancel
            </Button>
            <Button type="submit" color="primary" variant="contained">
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
            <DialogContentText>Create a game</DialogContentText>
            <TextField
              autoFocus
              id="name"
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
            <Button type="submit" color="primary" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default Home
