import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
    currentUser: {
        fontWeight: 'bold'
    }
}));

export default function PlayersGrid(props) {
    const classes = useStyles();
    const playerItem = (player) => {
        const isCurrentUser = props.currentUser.uid === player.uid;
        return (<Grid item md={3} xs={6} key={player.uid}>
            <Typography variant="body1" className={isCurrentUser ? classes.currentUser : ''}
                        color={isCurrentUser ? 'secondary' : 'initial'}>{player.name}</Typography>
            {/* Color the roles for the given teams. */}
            {props.showRole && <Typography variant="subtitle2">{player.name}</Typography>}
        </Grid>)
    };

    return props.currentPlayers ? (
        <Grid container spacing={3}>
            {props.currentPlayers.map(player => playerItem(player))}
        </Grid>
    ) : <div/>
}