import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    card: {
        width: "100%",
        maxWidth: 750,
        paddingBottom: 10,
        margin: 10
    },
    joinGameField: {
        fontSize: 24,
        margin: 5
    },
    joinGameInput: {
        fontSize: 54,
        textTransform: "uppercase"
    },
    joinGameButtons: {
        justifyContent: "space-around"
    },
    clearFormButton: {},
    joinGameButton: {}
}))

export default function JoinGame(props) {
    const classes = useStyles();
    const [gameId, setGameId] = useState("")
    const [playerName, setPlayerName] = useState("")

    const clearForm = () => {
        setGameId("")
        setPlayerName("")
    }

    const joinGame = () => {
        console.log(`Join game ${gameId} as player ${playerName}`)
    }

    return (
        <div className={classes.container}>
            <Card className={classes.card}>
                <CardHeader
                    title="Two Rooms and a Boom"
                    subheader="Join a Game"
                />
                <CardContent>
                    <form>
                        <div>
                            <TextField
                                className={classes.joinGameField}
                                id="gameId"
                                inputProps={{
                                    maxLength: 6,
                                    autoComplete: "off",
                                    pattern: "[A-Za-z]{6}",
                                    required: true
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.joinGameInput
                                    }
                                }}
                                maxLength="3"
                                label="Game ID"
                                variant="outlined"
                                value={gameId}
                                onChange={e => setGameId(e.target.value)}
                            />
                        </div>
                        <div>
                            <TextField
                                className={classes.joinGameField}
                                id="playerName"
                                inputProps={{
                                    autoComplete: "off",
                                    required: true
                                }}
                                InputProps={{
                                    classes: {
                                        input: classes.joinGameInput
                                    }
                                }}
                                name="playerName"
                                label="Player Name"
                                variant="outlined"
                                value={playerName}
                                onChange={e => setPlayerName(e.target.value)}
                            />
                        </div>
                    </form>
                </CardContent>
                <CardActions className={classes.joinGameButtons}>
                    <Button variant="contained" size="large" color="default" className={classes.clearFormButton}
                            onClick={clearForm}>
                        Clear Form
                    </Button>
                    <Button variant="contained" size="large" color="primary" className={classes.joinGameButton}
                            onClick={joinGame}>
                        Join Game
                    </Button>
                </CardActions>
            </Card>
            <Card className={classes.card}>
                <CardHeader subheader="Want to create your own game?"/>
                <CardContent>
                    <Button variant="contained" size="large" color="secondary"
                            onClick={() => props.updateFlow('create')}>
                        Create Game
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}