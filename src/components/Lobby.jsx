import React, { useEffect, useState } from "react"
import * as firebase from "firebase"

import { db, auth, myFirebase } from "../util/firebase"
import _ from "lodash"

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
  const [data, setData] = useState({})
  const [isReady, setIsReady] = useState(false)
  const [allReady, setAllReady] = useState(false)
  const [isHost, setIsHost] = useState(false)

  const lobbyID = props.match.params.code
  console.log(lobbyID)

  useEffect(() => {
    let unSub = db.doc(`/lobbies/${lobbyID}`).onSnapshot(
      (doc) => {
        if (doc.exists) {
          setData(doc.data())

          if (doc.data().users[auth.currentUser.uid].host === true) {
            setIsHost(true)
          } else {
            setIsHost(false)
          }

          let allReady = _.every(doc.data().users, (user) => user.isReady)
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
    return () => {
      unSub()
      console.log("Unsubbed")
    }
  }, [])

  const handleReady = () => {
    console.log("ready button")
    let uid = auth.currentUser.uid
    db.doc(`/lobbies/${lobbyID}`)
      .update({
        ["users." + uid + ".isReady"]: !isReady,
      })
      .then(() => {
        setIsReady(!isReady)
      })
  }

  const handleLeave = () => {
    console.log("leaving")
    db.collection("lobbies")
      .doc(lobbyID)
      .update({
        users: {
          [auth.currentUser.uid]: firebase.firestore.FieldValue.delete(),
        },
      })
      .then(() => {
        auth.signOut().then(() => {
          window.location = "/"
        })
      })
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
            {!allReady && (
              <Typography variant="caption" color="secondary">{`${
                _.filter(data.users, (user) => user.isReady === false).length
              } users need to ready up`}</Typography>
            )}
          </Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {Object.keys(data.users)
                  .sort()
                  //TODO:   sort by joined date
                  .map((userID) => (
                    <TableRow key={userID}>
                      <TableCell style={{ fontSize: 32, width: "75%" }}>
                        {data.users[userID].name}
                      </TableCell>
                      <TableCell>
                        {data.users[userID].isReady ? "Ready!" : "Not Ready"}
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
