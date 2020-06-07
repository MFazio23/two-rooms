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
import {selectWinners} from "../api";
import {logOut} from "../firebase";

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

    const [dialogOpen, setDialogOpen] = useState(false);

    const closeDialog = () => {
        setDialogOpen(false)
    }

    const winningTeamsSelected = async (winners) => {
        await selectWinners(props.currentGame.gameCode, winners);
        setDialogOpen(false);
    }

    const newGame = async () => {
        await logOut();
    }

    const statusHeader = `${props.isCanceled ? 'Game Canceled' : 'Game Over'}: [${props.currentGame.gameCode}]`;

    const winningTeamText = props.isCanceled ? "Canceled" : (props.currentGame.winningTeams?.join(", ") || "???");

    return (
        <div className={classes.container}>
            <div className={classes.container}>
                <Card className={classes.card}>
                    <CardHeader title="Two Rooms and a Boom" subheader={statusHeader}/>
                    <CardContent className={classes.roles}>
                        <div className={classes.winningTeamSection}>
                            <Typography variant="h6" component="span">Winning
                                Team{props.currentGame.winningTeams?.length > 1 ? 's' : ''}: </Typography>
                            <Typography className={classes.winningTeamLabel} variant="h4"
                                        component="span">{winningTeamText}</Typography>
                        </div>
                        {(props.currentUser.uid === props.currentGame.owner) && !props.isCanceled &&
                        <Button color="primary" size="large" variant="contained" onClick={() => setDialogOpen(true)}>
                            Select Winners
                        </Button>}
                        {!props.isCanceled && <WinningTeamBadges winners={props.currentGame.winningTeams}
                                           currentPlayers={props.currentPlayers}/>}
                        <Button color="secondary" size="large" variant="contained" onClick={newGame}>
                            New Game?
                        </Button>
                    </CardContent>
                </Card>

                <Card className={classes.card}>
                    <CardHeader subheader="Current Players"/>
                    <CardContent>
                        <PlayersGrid currentUser={props.currentUser} currentGame={props.currentGame}
                                     currentPlayers={props.currentPlayers}
                                     showRole={props.isCanceled || props.currentGame.winningTeams?.length > 0}/>
                    </CardContent>
                </Card>
            </div>
            <WinningTeamDialog dialogOpen={dialogOpen} onClose={closeDialog} currentPlayers={props.currentPlayers}
                               winningTeams={props.currentGame.winningTeams}
                               winningTeamsSelected={winningTeamsSelected}/>
        </div>
    )
}