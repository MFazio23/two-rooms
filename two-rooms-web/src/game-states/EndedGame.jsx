import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import PlayersGrid from "../components/PlayersGrid";
import {green} from "@material-ui/core/colors";
import WinningTeamBadges from "../components/WinningTeamBadges";
import Typography from "@material-ui/core/Typography";
import WinningTeamDialog from "../components/WinningTeamDialog";
import Button from "@material-ui/core/Button";

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
    winningTeamSection: {
        marginBottom: 10
    },
    winningTeamLabel: {
        textTransform: "uppercase"
    },
    blueTeam: {
        color: 'white',
        backgroundColor: blue[500]
    },
    redTeam: {
        color: 'white',
        backgroundColor: red[500]
    },
    greenTeam: {
        color: 'white',
        backgroundColor: green[500]
    },
    grayTeam: {
        color: 'black',
        backgroundColor: 'gray'
    }
}));

export default function EndedGame(props) {
    const classes = useStyles();

    const [winningTeam, setWinningTeam] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const closeDialog = () => {
        setDialogOpen(false)
    }

    const winningTeamSelected = (team) => {
        setWinningTeam(team);
        setDialogOpen(false);
    }

    return (
        <div className={classes.container}>
            <div className={classes.container}>
                <Card className={classes.card}>
                    <CardHeader title="Two Rooms and a Boom" subheader={`Game Over: [${props.gameId}]`}/>
                    <CardContent className={classes.roles}>
                        <div className={classes.winningTeamSection}>
                            <Typography variant="h6" component="span">Winning Team: </Typography>
                            <Typography className={classes.winningTeamLabel} variant="h4"
                                        component="span">{winningTeam || "???"}</Typography>
                        </div>
                        {props.currentUser.isOwner &&
                        <Button color="primary" size="large" variant="contained" onClick={() => setDialogOpen(true)}>
                            Pick Winners
                        </Button>}
                        {/* TODO: Allow leader to select the winning team?  How to handle Gray/Green and multiple winning teams? */}
                        <WinningTeamBadges winner={winningTeam}/>
                    </CardContent>
                </Card>

                <Card className={classes.card}>
                    <CardHeader subheader="Current Players"/>
                    <CardContent>
                        <PlayersGrid showRole={true}/>
                    </CardContent>
                </Card>
            </div>
            <WinningTeamDialog dialogOpen={dialogOpen} onClose={closeDialog} winningTeamSelected={winningTeamSelected}/>
        </div>
    )
}