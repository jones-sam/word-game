import React, { useState, useEffect } from "react"
import { db, auth } from "../util/firebase"
import dayjs from "dayjs"
import Countdown from "react-countdown"
import axios from "axios"

// Material UI
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"

export default function Game(props) {
  const [letters, setLetters] = useState([])
  const [userWord, setUserWord] = useState("")
  const [roundNumber, setRoundNumber] = useState(0)
  const [roundEndTime, setRoundEndTime] = useState(0)
  const [loading, setLoading] = useState(true)

  const lobbyID = props.match.params.code
  const roundID = props.match.params.roundID

  console.log(`lobby: ${lobbyID}`)
  console.log(`round: ${roundID}`)

  useEffect(() => {
    let unSubRounds = db.doc(`lobbies/${lobbyID}/rounds/${roundID}`).onSnapshot(
      (doc) => {
        if (doc.exists) {
          console.log("Subbed to " + roundID)
          setLetters(doc.data().letters)
          setRoundNumber(doc.id)
          setRoundEndTime(doc.data().roundEndTime)
          setLoading(false)
        } else {
          console.log("Could not find " + roundID)
        }
      },
      (err) => {
        console.error(err)
      }
    )
    return () => {
      unSubRounds()
    }
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Submitted")
  }

  const handleComplete = () => {
    console.log("TIME UP")
    setLoading(true)
    let points = 0
    let status = false

    console.log(userWord.length)

    axios
      .get(`https://wagon-dictionary.herokuapp.com/${userWord}`)
      .then((res) => {
        console.log(res)
        if (res.data.found) {
          points = res.data.length * 1000
          status = true
        } else {
          status = false
        }
      })
      .finally(() => {
        db.doc(`lobbies/${lobbyID}/rounds/${roundID}`).update({
          ["userWords." + auth.currentUser.uid]: {
            word: userWord,
            points: points,
            status: status,
          },
        })
      })
  }

  return (
    <Grid container justify="center" style={{ marginTop: "16px" }}>
      {!loading ? (
        <>
          <Grid
            container
            justify="center"
            alignItems="center"
            // style={{ marginTop: "3rem" }}
          >
            <Paper>
              <Typography variant="h1">Round {roundNumber}</Typography>
            </Paper>
          </Grid>
          <Grid container alignItems="center" justify="center">
            {letters.map((letter) => (
              <Paper
                key={letter + Math.round(Math.random() * 1000000)}
                style={{ padding: "16px", margin: "16px", minWidth: "42px" }}
              >
                <Grid container justify="center">
                  <Typography variant="h3">{letter}</Typography>
                </Grid>
              </Paper>
            ))}
          </Grid>
          <Grid container alignItems="center" justify="center">
            <Paper
              style={{
                minWidth: "60%",
                padding: "8px",
                marginTop: "5%",
              }}
            >
              <form onSubmit={handleSubmit}>
                <TextField
                  id="player-word"
                  label="Longest Word"
                  variant="outlined"
                  onChange={(e) => setUserWord(e.target.value)}
                  fullWidth
                />
                <Grid
                  container
                  alignItems="center"
                  justify="space-around"
                  style={{ marginTop: "8px" }}
                >
                  <Typography variant="h6">
                    <b>Length: {userWord.length}</b>
                  </Typography>
                  <Typography variant="h6">
                    <Countdown
                      date={roundEndTime}
                      onComplete={handleComplete}
                      renderer={(props) => (
                        <div>
                          <b>Time Left:</b> {props.total / 1000}s
                        </div>
                      )}
                    />
                  </Typography>
                  {/* <Button variant="contained" color="primary" type="submit">
                    Submit
                  </Button> */}
                </Grid>
              </form>
            </Paper>
          </Grid>
        </>
      ) : (
        <CircularProgress />
      )}
    </Grid>
  )
}
