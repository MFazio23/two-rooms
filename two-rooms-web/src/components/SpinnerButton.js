import React from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    wrapper: {
        margin: theme.spacing(1),
        position: 'relative',
    },
    buttonProgress: {
        color: theme.palette.secondary.main,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    buttonSuccessPrimary: {
        backgroundColor: theme.palette.primary.main,
        '&:hover': {
            backgroundColor: theme.palette.primary.dark,
        },
        color: 'white'
    },
    buttonSuccessSecondary: {
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
        },
        color: 'black'
    }
}));

export default function SpinnerButton(props) {

    const classes = useStyles();

    const joinGameButtonClassname = clsx({
        [classes.buttonSuccessPrimary]: props.success && props.buttonColor === 'secondary',
        [classes.buttonSuccessSecondary]: props.success && (props.buttonColor === 'primary' || !props.buttonColor)
    });

    return (
        <div className={classes.wrapper}>
            <Button variant="contained" type="submit" size="large" color={props.buttonColor || 'primary'}
                    className={joinGameButtonClassname} onClick={props.buttonClicked}
                    disabled={props.loading || props.disabled}>
                {props.text}
            </Button>
            {props.loading && <CircularProgress size={24} className={classes.buttonProgress}/>}
        </div>
    )
}