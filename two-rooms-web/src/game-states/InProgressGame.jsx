import React from 'react';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    root: {

    }
}))

export default function InProgressGame() {
    const classes = useStyles();

    return (
        <h1>In Progress Game</h1>
    )
}