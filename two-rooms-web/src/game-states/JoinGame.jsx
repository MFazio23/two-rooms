import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {joinGame} from "../api"
import CircularProgress from "@material-ui/core/CircularProgress";
import clsx from "clsx";

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

export default function JoinGame(props) {
    const classes = useStyles();
    const [gameCode, setGameCode] = useState("")
    const [playerName, setPlayerName] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const joinGameButtonClassname = clsx({
        [classes.buttonSuccess]: success,
    });

    const clearForm = () => {
        setGameCode("")
        setPlayerName("")
    }

    const joinGameClicked = async () => {
        //TODO: Form validation
        if (gameCode && playerName) {

            setLoading(true);
            try {
                const joinGameResult = await joinGame(gameCode, playerName);
                setLoading(false);
                setSuccess(true);

                console.log(joinGameResult)
            } catch(e) {
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
                                value={gameCode}
                                onChange={e => setGameCode(e.target.value)}
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
                    <div className={classes.wrapper}>
                        <Button variant="contained" size="large" color="primary" className={classes.joinGameButton}
                                onClick={joinGameClicked} disabled={loading}>
                            Join Game
                        </Button>
                        {loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
                    </div>
                </CardActions>
            </Card>
            <Card className={classes.card}>
                <CardHeader subheader="Want to create your own game?"/>
                <CardContent>
                    <Button variant="contained" size="large" color="secondary" className={joinGameButtonClassname}
                            onClick={() => props.updateFlow('create')}>
                        Create Game
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}