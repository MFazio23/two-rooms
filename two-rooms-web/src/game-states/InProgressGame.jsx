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

    const role = gameRoles.find(role => role.id === "president");

    const getTeamClass = (team) => {
        let teamClass = 'grayTeam';

        if(team === 'blue') teamClass = 'blueTeam';
        else if (team === 'red') teamClass = 'redTeam';
        else if (team === 'green') teamClass = 'greenTeam';

        return classes[teamClass];
    }

    return (
        <div className={classes.container}>
            <div className={classes.container}>
                <Card className={classes.card}>
                    <CardHeader title="Two Rooms and a Boom" subheader={`Game in Progress: [${props.gameId}]`}/>
                    <CardContent className={classes.roles}>
                        <Typography>Round {props.roundInfo.roundNumber}</Typography>
                        {/*TODO: End should come from Firebase.*/}
                        <RoundTimer endDateTime="2020-05-03T17:47:44.123"/>
                        <Typography>Swap {props.roundInfo.swapCount} {props.roundInfo.swapCount === 1 ? 'person' : 'people'}</Typography>
                    </CardContent>
                </Card>

                <Card className={`${classes.card} ${getTeamClass(role.team)}`}>
                    <CardHeader title={role.text} subheader={`${role.team} Team`}/>
                    <CardContent>
                        {role.shortDescription}
                    </CardContent>
                    {/*TODO: Add full description in a expandable panel.*/}
                </Card>
            </div>
        </div>
    )
}