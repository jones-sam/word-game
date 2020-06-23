import React, { useEffect, useState } from "react"
import { db, auth } from "../util/firebase"
import { useHistory } from "react-router-dom"
import _ from "lodash"
import { generateLetters } from "../util/generateLetters"

// Material UI
import { makeStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import Table from "@material-ui/core/Table"
import TableHead from "@material-ui/core/TableHead"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableRow from "@material-ui/core/TableRow"
import CircularProgress from "@material-ui/core/CircularProgress"
import Button from "@material-ui/core/Button"
import Dialog from "@material-ui/core/Dialog"
import DialogActions from "@material-ui/core/DialogActions"
import DialogTitle from "@material-ui/core/DialogTitle"
const useStyles = makeStyles({
  header: {
    fontSize: 16,
    fontWeight: "bold",
  },
})

export default function GameResults(props) {
  const [userWords, setUserWords] = useState({})
  const [letters, setLetters] = useState([])
  const [loading, setLoading] = useState(true)
  const [isHost, setIsHost] = useState(false)
  const [open, setOpen] = useState(false)

  const classes = useStyles()
  const history = useHistory()

  const lobbyID = props.match.params.code
  const roundID = props.match.params.roundID

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        //   Checking if current user is the host
        db.doc(`lobbies/${lobbyID}/users/${auth.currentUser.uid}`)
          .get()
          .then((doc) => {
            if (doc.exists && doc.data().host === true) {
              setIsHost(true)
            } else {
              setIsHost(false)
            }
          })
      }
    })

    let unSubRounds = db.doc(`lobbies/${lobbyID}/rounds/${roundID}`).onSnapshot(
      (doc) => {
        if (doc.exists) {
          console.log(doc.data())
          let sortedWordsByScore = _.sortBy(
            doc.data().userWords,
            "points",
            _.values
          ).reverse()

          setUserWords(sortedWordsByScore)
          setLetters(doc.data().letters)

          if (doc.data().status === "finished") {
            history.push(`/lobbies/${lobbyID}/rounds/${parseInt(roundID) + 1}`)
          }
          setLoading(false)
        }
      },
      (err) => {
        console.error(err)
      }
    )

    let unSubLobby = db.doc(`/lobbies/${lobbyID}`).onSnapshot((doc) => {
      console.log("subbed to lobby")
      if (doc.exists && doc.data().status === "finished") {
        auth.signOut()
        history.push("/")
      }
    })
    return () => {
      unSubRounds()
      unSubLobby()
    }
  }, [])

  const handleNextRound = () => {
    setLoading(true)
    db.doc(`lobbies/${lobbyID}/rounds/${roundID}`)
      .update({
        status: "finished",
      })
      .then(() => {
        let seconds = 20
        db.collection(`lobbies/${lobbyID}/rounds`)
          .doc((parseInt(roundID) + 1).toString())
          .set({
            roundEndTime: Date.now() + seconds * 1000,
            letters: generateLetters(8),
            status: "active",
          })
          .then(() => {
            history.push(`/lobbies/${lobbyID}/rounds/${parseInt(roundID) + 1}`)
          })
          .catch((err) => console.error(err))
      })
      .catch((err) => console.error(err))
  }

  const handleEndGame = () => {
    setLoading(true)
    console.log("ending game")
    db.doc(`lobbies/${lobbyID}`)
      .update({
        status: "finished",
      })
      .then(() => {
        auth.signOut()
        history.push("/")
      })
      .catch((err) => console.error(err))
  }

  return (
    <Grid container justify="center" style={{ marginTop: "16px" }}>
      {!loading ? (
        <>
          <Grid container justify="center">
            <Paper style={{ padding: 16 }}>
              <Typography variant="h1">Round {roundID} Results</Typography>
              <Grid container justify="space-around" alignItems="center">
                {letters.map((letter) => (
                  <Typography
                    key={letter + Math.round(Math.random() * 1000000)}
                    variant="h5"
                  >
                    <em>{letter}</em>
                  </Typography>
                ))}
              </Grid>
            </Paper>
          </Grid>
          <Grid container item style={{ marginTop: 32 }} xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className={classes.header}>Player</TableCell>
                    <TableCell className={classes.header}>Word</TableCell>
                    <TableCell className={classes.header}>Points</TableCell>
                    <TableCell className={classes.header}></TableCell>
                    <TableCell className={classes.header}>
                      Total Points
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userWords.map((user, index) => (
                    <TableRow key={Math.round(Math.random() * 1000000)}>
                      <TableCell>{index + 1}.</TableCell>
                      <TableCell style={{ fontSize: 24 }}>
                        {user.name}
                      </TableCell>
                      <TableCell
                        style={{ fontSize: 20, fontStyle: "italic" }}
                      >{`"${user.word}"`}</TableCell>
                      <TableCell>{user.points}</TableCell>
                      <TableCell>
                        {index === 0 ? "You Win!" : user.message}
                      </TableCell>
                      <TableCell>{user.totalPoints}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Paper style={{ padding: 16, width: "100%" }}>
              <Grid container justify="space-evenly">
                {isHost ? (
                  <>
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={() => setOpen(true)}
                    >
                      End Game
                    </Button>
                    <Button
                      color="primary"
                      variant="contained"
                      onClick={handleNextRound}
                    >
                      Next Round
                    </Button>
                  </>
                ) : (
                  <Typography variant="subtitle1">
                    Waiting for the host to start the next round...
                  </Typography>
                )}
              </Grid>
            </Paper>
          </Grid>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Are you sure you want to end the game?</DialogTitle>
            <DialogActions>
              <Button onClick={() => setOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleEndGame} color="secondary">
                End Game
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <CircularProgress />
      )}
    </Grid>
  )
}
