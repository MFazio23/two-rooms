import React from 'react';
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import RulesGrid from "../components/RulesGrid";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Icon from "@mdi/react";
import {mdiBomb} from "@mdi/js";
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
    createGameButtons: {
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
                    <Typography>
                        Something will go here at some point.
                    </Typography>
                </CardContent>
                <CardActions>
                    <Button onClick={props.removeListenersAndLogOut}>Sign Out</Button>
                </CardActions>
            </Card>
        </div>
    );
}