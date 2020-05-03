import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import RulesGrid from "../components/RulesGrid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import gameRoles from "../gameRoles.json";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import red from "@material-ui/core/colors/red";

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
    leaveGameButton: {
        backgroundColor: red
    }
}))

export default function UpcomingGame(props) {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <div className={classes.container}>
                <Card className={classes.card}>
                    <CardHeader title="Two Rooms and a Boom" subheader={`Upcoming Game: [${props.gameId}]`}/>
                    <CardContent className={classes.roles}>
                        <RulesGrid gameInfo={props.gameInfo} gameRoles={props.gameRoles} readOnly={true}/>
                    </CardContent>
                </Card>

                <Card className={classes.card}>
                    <CardHeader subheader="Current Players"/>
                    <CardContent>

                    </CardContent>
                    <CardActions className={classes.createGameButtons}>
                        <Button variant="contained" size="large" classes={{root: classes.leaveGameButton}}
                                onClick={() => props.updateFlow('join')}>
                            Leave This Game?
                        </Button>
                    </CardActions>
                </Card>
            </div>
        </div>
    )
}