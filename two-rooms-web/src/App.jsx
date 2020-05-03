import React, {useState} from 'react';
import './App.css';
import JoinGame from "./game-states/JoinGame";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {blue, teal} from "@material-ui/core/colors";
import CreateGame from "./game-states/CreateGame";
import UpcomingGame from "./game-states/UpcomingGame";
import gameRoles from "./gameRoles.json";
import InProgressGame from "./game-states/InProgressGame";
import EndedGame from "./game-states/EndedGame";

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

const getSelectedGameInfo = () => {
    //TODO: Map the selected game roles with what's in here.

    return Object.assign({}, ...gameRoles.map(role => ({[role.id]: role.required || role.text === 'Clown' || role.text === 'Angel/Demon'})));
}

function App() {
    //TODO: Get the game ID from somewhere.
    const currentGameId = "FAZTST";

    const gameInfo = getSelectedGameInfo();

    //TODO: This comes from FB.
    const roundInfo = {
        roundNumber: 2,
        swapCount: 2
    };

    const [flow, setFlow] = useState("ended");

    const updateFlow = (flow) => setFlow(flow);

    let flowComponent = <JoinGame updateFlow={updateFlow}/>

    if (flow === 'create') {
        flowComponent = <CreateGame updateFlow={updateFlow}/>;
    } else if (flow === 'upcoming') {
        flowComponent =
            <UpcomingGame updateFlow={updateFlow} gameRoles={gameRoles} gameInfo={gameInfo} gameId={currentGameId}/>;
    } else if (flow === 'inProgress') {
        flowComponent = <InProgressGame updateFlow={updateFlow} gameId={currentGameId} roundInfo={roundInfo}/>
    } else if (flow === 'ended') {
        flowComponent = <EndedGame updateFlow={updateFlow} gameId={currentGameId}/>
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
