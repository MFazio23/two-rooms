import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {joinGame} from "../api"
import GameEntryField from "../components/GameEntryField";
import SpinnerButton from "../components/SpinnerButton";

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
    joinGameCodeInput: {
        textTransform: "uppercase"
    },
    joinGameButtons: {
        justifyContent: "space-around",
        flexDirection: "row-reverse"
    },
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    buttonSuccess: {
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
        },
    },
}));

const twoRoomsPlayerName = "twoRoomsPlayerName";

export default function JoinGame(props) {
    const classes = useStyles();
    const [gameCode, setGameCode] = useState("")
    const [playerName, setPlayerName] = useState(localStorage.getItem(twoRoomsPlayerName) || "");
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const clearForm = () => {
        setGameCode("")
        setPlayerName("")
        localStorage.setItem(twoRoomsPlayerName, "");
    }

    const joinGameClicked = async () => {
        //TODO: Form validation
        if (gameCode && playerName) {
            localStorage.setItem(twoRoomsPlayerName, playerName);
            setLoading(true);
            try {
                await joinGame(gameCode.toUpperCase(), playerName);
                setLoading(false);
                setSuccess(true);
            } catch (e) {
                console.error(e);
                setSuccess(false);
            }
        }
    }

    return (
        <div className={classes.container}>
            <Card className={classes.card}>
                <CardHeader
                    title="Two Rooms and a Boom"
                    subheader="Join a Game"
                />
                <CardContent>
                    <div>
                        <GameEntryField
                            id="gameCode"
                            inputProps={{
                                maxLength: 6,
                                autoComplete: "off",
                                pattern: "[A-Za-z]{6}",
                                required: true
                            }}
                            inputClasses={classes.joinGameCodeInput}
                            label="Game Code"
                            value={gameCode}
                            onChange={e => setGameCode(e.target.value)}
                        />
                    </div>
                    <div>
                        <GameEntryField
                            id="playerName"
                            inputProps={{
                                autoComplete: "off",
                                required: true
                            }}
                            inputClasses={classes.joinGameNameInput}
                            name="playerName"
                            label="Player Name"
                            variant="outlined"
                            value={playerName}
                            onChange={e => setPlayerName(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardActions className={classes.joinGameButtons}>
                    <SpinnerButton buttonClicked={joinGameClicked} loading={loading} success={success}
                                   text="Join Game"/>
                    <Button variant="contained" size="large" color="default"
                            onClick={clearForm}>
                        Clear Form
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