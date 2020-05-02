import React from 'react';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {

    }
}))

export default function CreateGame() {
    const classes = useStyles();

    return (
        <h1>Create Game</h1>
    )
}