import React, {useState} from 'react';
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
    },
    winningTeamList: {
        marginBottom: 5
    },
    actions: {
        display: "flex",
        justifyContent: "center",
        marginBottom: 10
    }
}));

export default function WinningTeamDialog(props) {
    const classes = useStyles();
    const [winningTeams, setWinningTeams] = useState(props.winningTeams || []);

    const toggleWinningTeam = (team) => {
        if (winningTeams.includes(team)) {
            setWinningTeams(winningTeams.filter(t => t !== team));
        } else {
            setWinningTeams(winningTeams.concat([team]))
        }
    }

    return (
        <Dialog open={props.dialogOpen} onClose={props.onClose} className={classes.winningTeamDialog}>
            <DialogTitle>
                <Typography component="div" variant="h4">Select Winning Team(s)</Typography>
            </DialogTitle>
            <Card>
                <CardContent>
                    <Typography className={classes.winningTeamList} component="div"
                                variant="h6">{winningTeams?.join(", ")}</Typography>

                    <Typography>Please select the winning team(s) from the list below.</Typography>

                    <WinningTeamBadges winners={winningTeams} toggleWinningTeam={toggleWinningTeam}/>
                </CardContent>
                <CardActions className={classes.actions}>
                    <Button color="primary" size="large" variant="contained"
                            onClick={() => props.winningTeamsSelected(winningTeams)}>Select Winners</Button>
                </CardActions>
            </Card>
        </Dialog>
    )
}