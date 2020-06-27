import React, { useState, useEffect } from "react"
import { db, auth } from "../util/firebase"
import * as firebase from "firebase"
import Countdown from "react-countdown"
import axios from "axios"
import { useHistory } from "react-router-dom"
import letterValues from "../util/letterValues"

// Material UI
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"

import { AiFillLock, AiFillUnlock } from "react-icons/ai"
import { MdBackspace } from "react-icons/md"

export default function Game(props) {
  const history = useHistory()

  const [letters, setLetters] = useState([])
  const [userWord, setUserWord] = useState("")
  const [roundNumber, setRoundNumber] = useState(0)
  const [roundEndTime, setRoundEndTime] = useState(0)
  const [lockedIn, setLockedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState(0)
  const [wordValue, setWordValue] = useState(0)

  const lobbyID = props.match.params.code
  const roundID = props.match.params.roundID
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
    console.log("Locked in")
    setLockedIn(true)
    setTimeLeft(Math.round((roundEndTime - Date.now()) / 1000))
  }

  const handleComplete = () => {
    console.log("TIME UP")
    setLoading(true)
    let points = 0
    let message = ""

    axios
      .get(`https://wagon-dictionary.herokuapp.com/${userWord}`)
      .then((res) => {
        if (res.data.found) {
          message = "Good Job!"
          points += Math.round(timeLeft / 2)
          userWord
            .toUpperCase()
            .split("")
            .forEach((letter) => {
              if (letters.includes(letter)) {
                points += letterValues[letter]
                letters.splice(letters.lastIndexOf(letter), 1)
              } else {
                points = 0
                message = "You used a letter that was not available"
              }
            })
        } else if (userWord.length === 0) {
          message = "You did not input a word!"
          points = 0
        } else {
          message = "Your word is not valid!"
          points = 0
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        let totalPoints
        db.doc(`lobbies/${lobbyID}/users/${auth.currentUser.uid}`)
          // Updating total points
          .update({
            points: firebase.firestore.FieldValue.increment(points),
          })
          .then(() => {
            db.doc(`lobbies/${lobbyID}/users/${auth.currentUser.uid}`)
              //Fetching total points
              .get()
              .then((res) => {
                totalPoints = res.data().points
                db.doc(`lobbies/${lobbyID}/rounds/${roundID}`)
                  // updating user results
                  .update({
                    ["userWords." + auth.currentUser.uid]: {
                      name: auth.currentUser.displayName,
                      word: userWord,
                      points: points,
                      totalPoints: totalPoints,
                      message: message,
                    },
                  })
                  .then(() => {
                    history.push(`${window.location.pathname}/results`)
                  })
              })
          })
          .catch((err) => console.error(err))
      })
  }

  const handleBackspace = () => {
    if (lockedIn === false) {
      let wordBackspaced = userWord.substring(0, userWord.length - 1)
      setUserWord(wordBackspaced)
      updateWordValue(wordBackspaced)
    }
  }

  const handleChange = (e) => {
    setUserWord(e.target.value)
    updateWordValue(e.target.value)
  }

  const updateWordValue = (letters) => {
    let sum = 0
    letters.split("").forEach((letter) => {
      sum += parseInt(letterValues[letter.toUpperCase()])
    })
    setWordValue(sum)
  }

  return (
    <Grid container justify="center" style={{ marginTop: "16px" }}>
      {!loading ? (
        <>
          <Grid container justify="center" alignItems="center">
            <Paper>
              <Typography variant="h1">Round {roundNumber}</Typography>
            </Paper>
          </Grid>
          <Grid container alignItems="center" justify="center">
            {letters.map((letter) => (
              <Paper
                key={letter + Math.round(Math.random() * 1000000)}
                style={{ padding: "16px", margin: "16px", minWidth: "42px" }}
                onClick={() => {
                  if (lockedIn === false) {
                    setUserWord(userWord + letter)
                    updateWordValue(userWord + letter)
                  }
                }}
              >
                <Grid
                  container
                  justify="center"
                  direction="column"
                  alignItems="center"
                >
                  <Typography variant="h3">{letter}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {letterValues[letter]}
                  </Typography>
                </Grid>
              </Paper>
            ))}
          </Grid>
          <Box display={{ xs: "block", md: "none" }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleBackspace}
            >
              <MdBackspace />
            </Button>
          </Box>

          <Grid container alignItems="center" justify="center" item xs={12}>
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
                  onChange={handleChange}
                  value={userWord}
                  disabled={lockedIn}
                  autoComplete="false"
                  autoFocus={window.innerWidth < 700 ? false : true}
                  fullWidth
                />
                <Grid
                  container
                  alignItems="center"
                  justify="space-around"
                  style={{ marginTop: "8px" }}
                >
                  <Typography variant="h6" style={{ margin: 8 }}>
                    <b>Value: {wordValue}</b>
                  </Typography>
                  <Typography variant="h6" style={{ margin: 8 }}>
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
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={lockedIn}
                    style={{ margin: 8, minWidth: 250 }}
                  >
                    {lockedIn ? (
                      <>
                        <AiFillLock /> Locked!
                      </>
                    ) : (
                      <>
                        <AiFillUnlock /> Lock In
                      </>
                    )}
                  </Button>
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
