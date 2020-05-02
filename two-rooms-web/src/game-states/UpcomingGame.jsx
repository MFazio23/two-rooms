import React from 'react';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {

    }
}))

export default function UpcomingGame() {
    const classes = useStyles();

    return (
        <h1>Upcoming Game</h1>
    )
}