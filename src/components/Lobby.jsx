import React, { useEffect, useState } from "react"
import * as firebase from "firebase"
import keygen from "keygenerator"
import { db, auth, myFirebase } from "../util/firebase"
import _ from "lodash"
import dayjs from "dayjs"

// Material UI
import Grid from "@material-ui/core/Grid"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TableRow from "@material-ui/core/TableRow"
import Paper from "@material-ui/core/Paper"
import Typography from "@material-ui/core/Typography"
import CircularProgress from "@material-ui/core/CircularProgress"
import { Button } from "@material-ui/core"

function Lobby(props) {
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState([])
  //   const [currentUser, setCurrentUser] = useState({})
  const [isReady, setIsReady] = useState(false)
  const [allReady, setAllReady] = useState(false)
  const [isHost, setIsHost] = useState(false)

  const lobbyID = props.match.params.code

  useEffect(() => {
    let unSubUsers = db
      .collection("lobbies")
      .doc(lobbyID)
      .collection("users")
      .orderBy("joined", "asc")
      .onSnapshot(
        (res) => {
          if (!res.empty) {
            let userData = []
            res.docs.forEach((doc) =>
              userData.push({ ...doc.data(), userID: doc.id })
            )
            setUserData(userData)

            let user = res.docs.find((user) => user.id === auth.currentUser.uid)
            // setCurrentUser(user.data())

            if (user.data().host === true) {
              setIsHost(true)
            } else {
              setIsHost(false)
            }

            if (user.data().isReady === true) {
              setIsReady(true)
            } else {
              setIsReady(false)
            }

            let allReady =
              _.every(res.docs, (user) => user.data().isReady) &&
              res.docs.length >= 2
            if (allReady) {
              setAllReady(true)
            } else {
              setAllReady(false)
            }
            setLoading(false)
          } else {
            console.log("Lobby not found")
          }
        },
        (err) => {
          console.error(err)
        }
      )

    let unSubLobby = db.doc(`lobbies/${lobbyID}`).onSnapshot((res) => {
      if (res.exists && res.data().status === "in game") {
        console.log("game started, redirecting")
        window.location = window.location.pathname + `/rounds/1`
      } else {
        console.log("lobby in waiting mode")
      }
    })
    return () => {
      unSubUsers()
      unSubLobby()
      console.log("Unsubbed")
    }
  }, [])

  const handleReady = () => {
    console.log("ready button")
    db.doc(`/lobbies/${lobbyID}/users/${auth.currentUser.uid}`)
      .update({
        isReady: !isReady,
      })
      .then(() => {
        setIsReady(!isReady)
      })
  }

  const handleLeave = () => {
    console.log("leaving")
    db.doc(`lobbies/${lobbyID}/users/${auth.currentUser.uid}`)
      .delete()
      .then(() => {
        auth.signOut()

        window.location = "/"
      })
      .catch((err) => console.error(err))
  }

  const generateLetters = (numOfLetters) => {
    return keygen
      ._({
        forceUppercase: true,
        length: numOfLetters,
        numbers: false,
      })
      .split("")
  }

  const handleStart = () => {
    console.log("starting")
    setLoading(true)
    let seconds = 10
    db.collection(`lobbies/${lobbyID}/rounds`)
      .doc("1")
      .set({
        roundEndTime: Date.now() + seconds * 1000,
        letters: generateLetters(8),
      })
      .then(() => {
        db.doc(`lobbies/${lobbyID}`)
          .set({ status: "in game" })
          .then(() => {
            window.location = window.location.pathname + `/rounds/1`
          })
          .catch((err) => console.error(err))
      })
      .catch((err) => console.error(err))
  }

  return (
    <Grid container justify="center" style={{ marginTop: "16px" }}>
      {!loading ? (
        <Grid item style={{ minWidth: "50vw" }}>
          <Paper style={{ padding: "16px", marginBottom: "16px" }}>
            <Grid container justify="space-between" alignItems="center">
              <Typography variant="h3">Lobby</Typography>
              <Button variant="contained" color="primary" onClick={handleLeave}>
                Leave
              </Button>
            </Grid>
            <Typography variant="h4">{`Code: ${lobbyID}`}</Typography>
            {!(userData.length >= 2) ? (
              <Typography variant="caption" color="secondary">
                2 players are required to start
              </Typography>
            ) : !allReady ? (
              <Typography variant="caption" color="secondary">{`${
                _.filter(userData, (user) => user.isReady === false).length
              } user(s) need to ready up`}</Typography>
            ) : null}
          </Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {userData.map((user) => (
                  <TableRow key={user.userID}>
                    <TableCell style={{ fontSize: 32, width: "75%" }}>
                      {user.name}
                    </TableCell>
                    <TableCell>
                      {user.isReady ? "Ready!" : "Not Ready"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Paper style={{ padding: 16 }}>
            <Grid container justify="space-evenly">
              <Button
                variant="contained"
                style={isReady ? { backgroundColor: "green" } : null}
                color="secondary"
                size="large"
                onClick={handleReady}
              >
                {!isReady ? "Ready?" : "Ready!"}
              </Button>
              {isHost && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={!allReady}
                  onClick={handleStart}
                >
                  Start
                </Button>
              )}
            </Grid>
          </Paper>
        </Grid>
      ) : (
        <CircularProgress />
      )}
    </Grid>
  )
}

export default Lobby
