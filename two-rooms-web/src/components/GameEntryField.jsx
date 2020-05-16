import React from 'react';
import TextField from "@material-ui/core/TextField";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

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
    gameEntryField: {
        margin: 5
    },
    gameEntryInput: {
        fontSize: 54
    }
}));

export default function GameEntryField(props) {

    const classes = useStyles();
    const inputClassName = clsx(classes.gameEntryInput, props.inputClasses);

    return (
        <TextField
            className={classes.gameEntryField}
            id={props.id}
            inputProps={props.inputProps}
            InputProps={{
                classes: {
                    input: inputClassName
                }
            }}
            label={props.label}
            variant="outlined"
            value={props.value}
            onChange={props.onChange}/>
    )
}