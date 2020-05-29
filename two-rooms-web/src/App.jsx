import React, {useEffect, useState} from 'react';
import './App.css';
import JoinGame from "./game-states/JoinGame";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {blue, teal} from "@material-ui/core/colors";
import CreateGame from "./game-states/CreateGame";
import UpcomingGame from "./game-states/UpcomingGame";
import gameRoles from "./gameRoles.json";
import InProgressGame from "./game-states/InProgressGame";
import EndedGame from "./game-states/EndedGame";
import {auth, db, logOut} from "./firebase"
import Default from "./game-states/Default";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import {DateTime} from "luxon";

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: teal
    },
    typography: {
        fontFamily: [
            'JetBrains Mono',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(',')
    }
});

function App() {
    const [currentGame, setCurrentGame] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [flow, setFlow] = useState(null);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    let currentGameListener = null;
    let currentPlayersListener = null;

    const updateFlow = (flow) => setFlow(flow);

    const setFlowFromStatus = (status) => {
        switch (status) {
            case "Created":
                setFlow("upcoming");
                break;
            case "Started":
                setFlow("inProgress");
                break;
            case "Ended":
                setFlow("ended");
                break;
            default:
                setFlow("join");
                break;
        }
    }

    useEffect(() => {
        auth().onAuthStateChanged(async (user) => {
            if (user) {
                await setCurrentUserRecord(user);
            } else {
                console.error("User not found");
                if (!flow) setFlow("join");
            }
        })
    })

    const setCurrentUserRecord = async (firebaseUser) => {
        if (firebaseUser && currentUser?.uid !== firebaseUser.uid) {
            window.firebaseUser = firebaseUser;
            setCurrentUser({
                name: firebaseUser.displayName,
                uid: firebaseUser.uid
            });

            await updateGameData(firebaseUser);
        }
    }

    const updateGameData = async (firebaseUser) => {
        try {
            const tokenResult = await firebaseUser.getIdTokenResult();

            if (tokenResult?.claims?.gameCode && tokenResult?.claims?.gameCode !== currentGame?.gameCode) {
                if (currentGameListener) currentGameListener();

                const gameDoc = db.collection(`games`).doc(tokenResult.claims.gameCode);
                currentGameListener = gameDoc.onSnapshot(snapshot => {
                    const data = snapshot.data()

                    if (data) {
                        const currentGameRoles =
                            gameRoles.reduce((obj, role) => (obj[role.id] = data.roles.includes(role.id), obj), {});

                        setCurrentGame({
                            gameCode: data.gameCode,
                            status: data.status,
                            roles: currentGameRoles,
                            owner: data.ownerUID,
                            roundNumber: data.roundNumber,
                            roundEndDateTime: data.roundEndDateTime ? DateTime.fromISO(data.roundEndDateTime) : null,
                            winningTeams: data.winners
                        });

                        setFlowFromStatus(data.status);
                    }
                }, (error) => console.error("Error with current game listener", error))

                if (currentPlayersListener) currentPlayersListener();
                currentPlayersListener = gameDoc.collection("players").onSnapshot(snapshot => {
                    setCurrentPlayers(snapshot.docs.map(doc => doc.data()).map(player => ({
                        name: player.name,
                        uid: player.uid,
                        role: player.role,
                        team: player.team
                    })));
                }, (error) => console.error("Error with current players listener", error))

            } else {
                console.error("No game code was found for the user.");
            }
        } catch (ex) {
            console.error(ex);
        }
    };

    const removeListenersAndLogOut = async () => {
        if (currentGameListener) currentGameListener();
        if (currentPlayersListener) currentPlayersListener();

        await logOut();

        setCurrentGame(null)
        setCurrentUser(null)
        setCurrentPlayers([]);
        setFlow('join');

        displaySnackbar("You have been removed from your game.");
    };

    const handleSnackbarClose = () => {
        setShowSnackbar(false);
    }

    const displaySnackbar = (message) => {
        setSnackbarMessage(message)
        setShowSnackbar(true)
    }

    let flowComponent = <JoinGame updateFlow={updateFlow}/>

    if (!flow) {
        flowComponent = <Default removeListenersAndLogOut={removeListenersAndLogOut}/>
    } else if (flow === 'create') {
        flowComponent = <CreateGame updateFlow={updateFlow}/>;
    } else if (flow === 'upcoming') {
        flowComponent =
            <UpcomingGame updateFlow={updateFlow} currentUser={currentUser} currentGame={currentGame}
                          currentPlayers={currentPlayers} logOut={removeListenersAndLogOut}
                          displaySnackbar={displaySnackbar}/>;
    } else if (flow === 'inProgress') {
        flowComponent = <InProgressGame updateFlow={updateFlow} currentGame={currentGame} currentUser={currentUser}
                                        currentPlayers={currentPlayers}/>
    } else if (flow === 'ended') {
        flowComponent = <EndedGame currentUser={currentUser} currentPlayers={currentPlayers} currentGame={currentGame}
                                   updateFlow={updateFlow}/>
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                {flowComponent}
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left'
                    }}
                    open={showSnackbar}
                    autoHideDuration={5000}
                    onClose={handleSnackbarClose}
                    message={snackbarMessage}
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackbarClose}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }/>
            </div>
        </ThemeProvider>
    );
}

export default App;
