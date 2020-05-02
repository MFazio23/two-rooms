import React, {useState} from 'react';
import './App.css';
import JoinGame from "./game-states/JoinGame";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import {blue, teal} from "@material-ui/core/colors";
import CreateGame from "./game-states/CreateGame";

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
    const [flow, setFlow] = useState("create");

    const updateFlow = (flow) => setFlow(flow);

    let flowComponent = <JoinGame updateFlow={updateFlow}/>

    if (flow === 'create') flowComponent = <CreateGame updateFlow={updateFlow}/>;

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                {flowComponent}
            </div>
        </ThemeProvider>
    );
}

export default App;
