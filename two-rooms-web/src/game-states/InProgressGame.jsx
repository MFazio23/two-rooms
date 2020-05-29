import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import gameRoles from "../gameRoles.json";
import RoundTimer from "../components/RoundTimer";
import Typography from "@material-ui/core/Typography";
import {blue, green, red} from "@material-ui/core/colors";
import {endGame, nextRound, startRound} from "../api";
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
    blueTeam: {
        color: 'white',
        backgroundColor: blue[500]
    },
    redTeam: {
        color: 'white',
        backgroundColor: red[500]
    },
    greenTeam: {
        color: 'white',
        backgroundColor: green[500]
    },
    grayTeam: {
        color: 'black',
        backgroundColor: 'gray'
    },
    roundAction: {
        marginTop: 10
    }
}));

const calculateSwapCount = (playerCount, roundNumber) => {
    // I miss `when` blocks
    if (playerCount <= 10) return 1;
    if (playerCount <= 21) return roundNumber === 1 ? 2 : 1;
    return 4 - roundNumber;
}

export default function InProgressGame(props) {
    const classes = useStyles();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const currentPlayer = props.currentPlayers?.find(p => p.uid === props.currentUser.uid) || {};

    const isOwner = currentPlayer.uid === props.currentGame.owner;

    const role = gameRoles?.find(role => role.id === currentPlayer.role) || {};

    const swapCount = calculateSwapCount(props.currentPlayers?.length || 0, props.currentGame.roundNumber)

    const getTeamClass = (team) => {
        let teamClass = 'grayTeam';

        if (team === 'Blue') teamClass = 'blueTeam';
        else if (team === 'Red') teamClass = 'redTeam';
        else if (team === 'Green') teamClass = 'greenTeam';

        return classes[teamClass];
    }

    const [displayRoundActionButton, setDisplayRoundActionButton] = useState(!props.currentGame.roundEndDateTime)

    const roundActionText = !props.currentGame.roundEndDateTime ? 'Start Round' :
        props.currentGame.roundNumber < 3 ? 'Next Round' : 'Pick Winners';

    const roundAction = async () => {
        setLoading(true);
        if (!props.currentGame.roundEndDateTime) {
            await startRound(props.currentGame.gameCode, props.currentGame.roundNumber);
        } else if (props.currentGame.roundNumber < 3) {
            await nextRound(props.currentGame.gameCode, props.currentGame.roundNumber);
        } else {
            await endGame(props.currentGame.gameCode);
        }
        setLoading(false);
        setSuccess(true);

        setDisplayRoundActionButton(false);
    }

    return props.currentGame && (
        <div className={classes.container}>
            <div className={classes.container}>
                <Card className={classes.card}>
                    <CardHeader title="Two Rooms and a Boom"
                                subheader={`Game in Progress: [${props.currentGame.gameCode}]`}/>
                    <CardContent className={classes.roles}>
                        <Typography>Round {props.currentGame.roundNumber}</Typography>
                        <RoundTimer endDateTime={props.currentGame.roundEndDateTime}
                                    onRoundEnd={(roundOver) => setDisplayRoundActionButton(roundOver)}/>
                        <Typography>Swap {swapCount} {swapCount === 1 ? 'person' : 'people'} after round</Typography>
                        {isOwner && displayRoundActionButton &&
                        <SpinnerButton buttonClicked={roundAction} loading={loading} success={success}
                                       disabled={props.currentPlayers?.length < 6} buttonColor="secondary"
                                       text={roundActionText}/>}
                    </CardContent>
                </Card>

                <Card className={`${classes.card} ${getTeamClass(currentPlayer.team)}`}>
                    <CardHeader title={role.text} subheader={`${currentPlayer.team} Team`}/>
                    <CardContent>
                        {role.shortDescription}
                    </CardContent>
                    {/*TODO: Add full description in a expandable panel.*/}
                </Card>
            </div>
        </div>
    ) || <div/>
}