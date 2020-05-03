import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import blue from "@material-ui/core/colors/blue";
import red from "@material-ui/core/colors/red";
import PlayersGrid from "../components/PlayersGrid";
import {green} from "@material-ui/core/colors";

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

    return (
        <div className={classes.container}>
            <div className={classes.container}>
                <Card className={classes.card}>
                    <CardHeader title="Two Rooms and a Boom" subheader={`Game Over: [${props.gameId}]`}/>
                    <CardContent className={classes.roles}>
                        {/* TODO: Allow leader to select the winning team?  How to handle Gray/Green and multiple winning teams? */}
                    </CardContent>
                </Card>

                <Card className={classes.card}>
                    <CardHeader subheader="Current Players"/>
                    <CardContent>
                        <PlayersGrid showRole={true}/>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}