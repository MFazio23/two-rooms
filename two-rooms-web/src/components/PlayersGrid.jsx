import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({

}));

//TODO: Get this from Firebase
const players = [
    "Michael",
    "Emily",
    "Tim",
    "Hazel",
    "Ken",
    "Pablo",
    "Anna",
    "Justin",
    "Amanda",
    "Craig"
];

export default function PlayersGrid(props) {

    const playerItem = (player) => {

        return (<Grid item md={3} xs={6} key={player}>
            <Typography variant="body1">{player}</Typography>
            {/* Color the roles for the given teams. */}
            {props.showRole && <Typography variant="subtitle2">{player}</Typography>}
        </Grid>)
    };

    return (
        <Grid container spacing={3}>
            {players.map(player => playerItem(player))}
        </Grid>
    )
}