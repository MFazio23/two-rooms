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
import Spinner from "./components/Spinner";
import "./spinner.css";

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
    //TODO: This comes from FB.
    const roundInfo = {
        roundNumber: 2,
        swapCount: 2
    };

    const [currentGame, setCurrentGame] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [flow, setFlow] = useState(null);

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
                if(!flow) setFlow("join");
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
                            owner: data.ownerUID
                        });

                        setFlowFromStatus(data.status);
                    }
                }, (error) => console.error("Error with current game listener", error))

                if (currentPlayersListener) currentPlayersListener();
                currentPlayersListener = gameDoc.collection("players").onSnapshot(snapshot => {
                    setCurrentPlayers(snapshot.docs.map(doc => doc.data()).map(player => ({
                        name: player.name,
                        uid: player.uid
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
    };

    let flowComponent = <JoinGame updateFlow={updateFlow}/>

    if (!flow) {
        flowComponent = <Default removeListenersAndLogOut={removeListenersAndLogOut}/>
    } else if (flow === 'create') {
        flowComponent = <CreateGame updateFlow={updateFlow}/>;
    } else if (flow === 'upcoming') {
        flowComponent =
            <UpcomingGame updateFlow={updateFlow} currentUser={currentUser} currentGame={currentGame}
                          currentPlayers={currentPlayers} logOut={removeListenersAndLogOut}/>;
    } else if (flow === 'inProgress') {
        flowComponent = <InProgressGame updateFlow={updateFlow} currentGame={currentGame} roundInfo={roundInfo}/>
    } else if (flow === 'ended') {
        flowComponent = <EndedGame currentUser={currentUser} updateFlow={updateFlow} currentGame={currentGame}/>
    }

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                {flowComponent}
            </div>
        </ThemeProvider>
    );
}

export default App;
