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
import LeaveGameDialog from "../components/LeaveGameDialog";
import Button from "@material-ui/core/Button";
import {cancelGame} from '../api';
import Collapse from "@material-ui/core/Collapse";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
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
    const [dialogOpen, setDialogOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const currentPlayer = props.currentPlayers?.find(p => p.uid === props.currentUser.uid) || {};

    const isOwner = currentPlayer.uid === props.currentGame.owner;

    const role = gameRoles?.find(role => role.id === currentPlayer.role) || {};

    const swapCount = calculateSwapCount(props.currentPlayers?.length || 0, props.currentGame.roundNumber)

    const closeDialog = () => setDialogOpen(false)

    const logOutIfValid = (result) => {
        if (result?.error) {
            props.displaySnackbar(result.error);
        } else {
            if(isOwner) {
                cancelGame(props.currentGame.gameCode);
            }
            props.logOut()
        }
    }

    const handleExpandClick = () => setExpanded(!expanded);

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
                    <CardActions>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>{role.description}</Typography>
                        </CardContent>
                    </Collapse>
                </Card>
                <Button variant="contained" size="large" classes={{root: classes.leaveGameButton}}
                        onClick={() => setDialogOpen(true)}>
                    Leave This Game?
                </Button>
            </div>

            <LeaveGameDialog open={dialogOpen} onClose={closeDialog} logOutIfValid={logOutIfValid}
                             currentGame={props.currentGame}/>
        </div>
    ) || <div/>
}