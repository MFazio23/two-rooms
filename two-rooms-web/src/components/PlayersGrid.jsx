import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import gameRoles from "../gameRoles.json";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import green from "@material-ui/core/colors/green";

const useStyles = makeStyles(theme => ({
    currentUserOrOwner: {
        fontWeight: 'bold'
    },
    blue: {
        color: blue[500]
    },
    red: {
        color: red[500]
    },
    green: {
        color: green[500]
    },
    gray: {
        color: 'gray'
    }
}));

export default function PlayersGrid(props) {
    const classes = useStyles();
    const playerItem = (player) => {
        const isCurrentUser = props.currentUser.uid === player.uid;
        const playerRole = gameRoles?.find(role => role.id === player.role) || {};
        const isOwner = props.currentGame?.owner === player.uid;

        return (<Grid item md={3} xs={6} key={player.uid}>
            <Typography variant="body1" className={isCurrentUser || isOwner ? classes.currentUserOrOwner : ''}
                        color={isCurrentUser ? 'secondary' : 'initial'}>{player.name}</Typography>
            {props.showRole &&
            <Typography variant="subtitle2"
                        classes={{root: classes[player.team.toLowerCase()]}}>{playerRole.text}</Typography>}
        </Grid>)
    };

    return props.currentPlayers ? (
        <Grid container spacing={3}>
            {props.currentPlayers.map(player => playerItem(player))}
        </Grid>
    ) : <div/>
}