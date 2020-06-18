import React, { useEffect, useState } from "react"
import { db, auth } from "../util/firebase"
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
  const user = auth.currentUser

  const lobbyID = props.match.params.code
  console.log(lobbyID)

  useEffect(() => {
    let unSub = db.doc(`/lobbies/${lobbyID}`).onSnapshot(
      (doc) => {
        if (doc.exists) {
          console.log(doc.data())
          setData(doc.data())
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
    let uid = user.uid
    db.doc(`/lobbies/${lobbyID}`)
      .update({
        ["users." + uid + ".isReady"]: !isReady,
      })
      .then(() => {
        setIsReady(!isReady)
      })
  }

  return (
    <Grid container justify="center" style={{ marginTop: "16px" }}>
      {!loading ? (
        <Grid item style={{ minWidth: "50vw" }}>
          <Paper style={{ padding: "16px", marginBottom: "16px" }}>
            <Typography variant="h3">Lobby</Typography>
            <Typography variant="h4">{`Code: ${lobbyID}`}</Typography>
            {/* <Typography variant="caption" color="secondary">{`${
              data.users.filter((user) => user.isReady === false).length
            } users need to ready up`}</Typography> */}
          </Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {console.log(data.users)}
                {Object.keys(data.users)
                  .sort()
                  //TODO:   sort by joined date
                  .map((userID) => (
                    <TableRow key={userID}>
                      <TableCell style={{ fontSize: 32, width: "75%" }}>
                        {console.log(user)}
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
              <Button variant="contained" color="primary" size="large">
                Start
              </Button>
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
