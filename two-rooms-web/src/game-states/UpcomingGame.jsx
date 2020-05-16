import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import RulesGrid from "../components/RulesGrid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import red from "@material-ui/core/colors/red";
import PlayersGrid from "../components/PlayersGrid";
import LeaveGameDialog from "../components/LeaveGameDialog";

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
    leaveGameButtons: {
        justifyContent: "space-around"
    },
    leaveGameButton: {
        backgroundColor: red
    },
    leaveGameDialog: {
        textAlign: "center"
    }
}));

const startGame = () => {
    //TODO: Fill this in.
    console.log("This will start the game.");
}

export default function UpcomingGame(props) {
    const classes = useStyles();
    const [dialogOpen, setDialogOpen] = useState(false);

    const closeDialog = () => setDialogOpen(false)

    const logOutIfValid = (result) => {
        if(result?.error) {
            props.displaySnackbar(result.error);
        } else {
            props.logOut()
        }
    }

    return props.currentGame ? (
        <div className={classes.container}>
            <div className={classes.container}>
                <Card className={classes.card}>
                    <CardHeader title="Two Rooms and a Boom"
                                subheader={`Upcoming Game: [${props.currentGame.gameCode}]`}/>
                    <CardContent className={classes.roles}>
                        <RulesGrid currentGame={props.currentGame} readOnly={true}/>
                    </CardContent>
                </Card>

                <Card className={classes.card}>
                    <CardHeader subheader="Current Players"/>
                    <CardContent>
                        <PlayersGrid currentUser={props.currentUser} currentPlayers={props.currentPlayers}/>
                    </CardContent>
                    <CardActions className={classes.leaveGameButtons}>
                        <Button variant="contained" size="large" classes={{root: classes.leaveGameButton}}
                                onClick={() => setDialogOpen(true)}>
                            Leave This Game?
                        </Button>
                        {
                            (props.currentGame.owner === props.currentUser.uid) &&
                            <Button variant="contained" color="secondary" size="large"
                                    classes={{root: classes.leaveGameButton}}
                                    onClick={startGame}>
                                Start Game
                            </Button>
                        }
                    </CardActions>
                </Card>
            </div>
            <LeaveGameDialog open={dialogOpen} onClose={closeDialog} logOutIfValid={logOutIfValid}
                             currentGame={props.currentGame}/>
        </div>
    ) : <div />
}