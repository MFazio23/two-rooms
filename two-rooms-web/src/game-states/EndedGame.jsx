import React from 'react';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {

    }
}))

export default function EndedGame() {
    const classes = useStyles();

    return (
        <h1>Ended Game</h1>
    )
}