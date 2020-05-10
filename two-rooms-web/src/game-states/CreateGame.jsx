import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import gameRoles from "../gameRoles.json";
import RulesGrid from "../components/RulesGrid";

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


export default function CreateGame(props) {
    const classes = useStyles();

    const [currentGame, setCurrentGame] = useState(
        Object.assign({
            roles: gameRoles.reduce((obj, role) => (obj[role.id] = role.required, obj), {})
        })
    );

    const handleSwitchChange = (event) => {
        const newRoles = Object.assign(currentGame?.roles || {}, {[event.target.name]: event.target.checked});
        setCurrentGame({
            roles: newRoles
        })
    }

    const createGame = () => {
        console.log("Create a game", JSON.stringify(currentGame));
    };

    return (
        <div className={classes.container}>
            <Card className={classes.card}>
                <CardHeader title="Two Rooms and a Boom" subheader="Create a Game"/>
                <CardContent className={classes.roles}>
                    <RulesGrid currentGame={currentGame} handleSwitchChange={handleSwitchChange} />
                </CardContent>
                <CardActions className={classes.createGameButtons}>
                    <Button variant="contained" size="large" color="secondary"
                            onClick={createGame}>
                        Create Game
                    </Button>
                </CardActions>
            </Card>

            <Card className={classes.card}>
                <CardHeader subheader="Want to join a game instead?"/>
                <CardContent>

                </CardContent>
                <CardActions className={classes.createGameButtons}>
                    <Button variant="contained" size="large" color="primary" onClick={() => props.updateFlow('join')}>
                        Join Game
                    </Button>
                </CardActions>
            </Card>
        </div>
    )
}