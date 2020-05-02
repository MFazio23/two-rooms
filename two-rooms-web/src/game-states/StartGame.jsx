import React from 'react';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {

    }
}))

export default function StartGame() {
    const classes = useStyles();

    return (
        <h1>Start Game</h1>
    )
}