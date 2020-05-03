import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    leaveGameDialog: {
        textAlign: "center"
    },
    leaveGameDialogButtons: {
        justifyContent: "space-around"
    },
    leaveGameDialogButton: {}
}));

export default function LeaveGameDialog(props) {
    const classes = useStyles();

    const signOutOfGame = () => {
        //TODO: Sign the user out.
        console.log("This will sign you out.");
    }

    return (
        <Dialog open={props.open} onClose={props.onClose} className={classes.leaveGameDialog}>
            <DialogTitle>
                <Typography component="div" variant="h4">Leave This Game?</Typography>
            </DialogTitle>
            <Card>
                <CardContent>Are you sure you want to leave the game?</CardContent>
                <CardActions className={classes.leaveGameDialogButtons}>
                    <Button variant="contained" size="large" color="default"
                            className={classes.leaveGameDialogButton}
                            onClick={props.onClose}>
                        No
                    </Button>
                    <Button variant="contained" size="large" color="primary"
                            className={classes.leaveGameDialogButton}
                            onClick={signOutOfGame}>
                        Yes
                    </Button>
                </CardActions>
            </Card>
        </Dialog>
    )
}