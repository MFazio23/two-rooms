import React from 'react';
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {makeStyles} from "@material-ui/core/styles";
import WinningTeamBadges from "./WinningTeamBadges";

const useStyles = makeStyles(theme => ({
    winningTeamDialog: {
        textAlign: "center"
    }
}));

export default function WinningTeamDialog(props) {
    const classes = useStyles();

    return (
        <Dialog open={props.dialogOpen} onClose={props.onClose} className={classes.winningTeamDialog}>
            <DialogTitle>
                <Typography component="div" variant="h4">Select Winning Team</Typography>
            </DialogTitle>
            <Card>
                <CardContent>Please select the winning team from the list below.</CardContent>
                <CardActions>
                    <WinningTeamBadges iconClicked={props.winningTeamSelected}/>
                </CardActions>
            </Card>
        </Dialog>
    )
}