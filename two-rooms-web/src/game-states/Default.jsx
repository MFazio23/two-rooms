import React from 'react';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

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
    roles: {
        textAlign: "left"
    },
    signOutButton: {
        justifyContent: "center"
    }
}));

export default function Default(props) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <Card className={classes.card}>
                <CardHeader title="Two Rooms and a Boom"/>
                <CardContent>
                    <Typography variant="h4" component="div">How to Play</Typography>
                    <Typography>
                        In Two Rooms and a Boom there are 2 teams and 2 rooms. The 2 teams are the Blue Team and the Red
                        Team. The Blue Team has a President. The Red Team has a Bomber. Players are first equally
                        distributed between 2 separate playing areas (usually
                        2 separate rooms) and then each player is randomly dealt a facedown character card.
                    </Typography>
                    <br />
                    <Typography>
                        Players play the game by saying what they want in order to select a leader for their room. The
                        leader chooses hostages (players who will be sent to the other room at the end of the round).
                    </Typography>
                    <br />
                    <Typography>
                        The game consists of 3 timed rounds. Each round is shorter than the previous round. At the end
                        of each round, the hostages selected by the leaders will be traded into opposing rooms.
                    </Typography>
                    <br />
                    <Typography>
                        The game ends after the last hostage exchange.
                    </Typography>
                    <br />
                    <Typography>
                        Everyone reveals their card. If Red Team’s Bomber is in the same room as the President, then the
                        Red Team wins. Otherwise the Blue Team wins.
                    </Typography>
                </CardContent>
                <CardActions className={classes.signOutButton}>
                    <Typography variant="subtitle2" component="div">You probably shouldn't be here, try signing out.</Typography>
                    <Button variant="contained" size="large" onClick={props.removeListenersAndLogOut}>Sign Out</Button>
                </CardActions>
            </Card>
        </div>
    );
}