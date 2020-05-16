import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import gameRoles from "../gameRoles.json";
import RoundTimer from "../components/RoundTimer";
import Typography from "@material-ui/core/Typography";
import {blue, red, green} from "@material-ui/core/colors";

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
    leaveGameButtons: {
        justifyContent: "center"
    },
    leaveGameButton: {
        backgroundColor: red
    },
    leaveGameDialog: {
        textAlign: "center"
    }
}));

export default function InProgressGame(props) {
    const classes = useStyles();

    const currentPlayer = props.currentPlayers?.find(p => p.uid === props.currentUser.uid) || {};

    const role = gameRoles?.find(role => role.id === currentPlayer.role) || {};

    const getTeamClass = (team) => {
        let teamClass = 'grayTeam';

        if(team === 'Blue') teamClass = 'blueTeam';
        else if (team === 'Red') teamClass = 'redTeam';
        else if (team === 'Green') teamClass = 'greenTeam';

        return classes[teamClass];
    }

    return props.currentGame && (
        <div className={classes.container}>
            <div className={classes.container}>
                <Card className={classes.card}>
                    <CardHeader title="Two Rooms and a Boom" subheader={`Game in Progress: [${props.currentGame.gameCode}]`}/>
                    <CardContent className={classes.roles}>
                        <Typography>Round {props.currentGame.roundNumber}</Typography>
                        <RoundTimer endDateTime={props.currentGame.roundEndTime}/>
                        <Typography>Swap {props.currentGame.swapCount} {props.currentGame.swapCount === 1 ? 'person' : 'people'}</Typography>
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