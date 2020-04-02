import React from 'react';
import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import {AccountMultiple, Bomb, CardsOutline} from 'mdi-material-ui'
import {makeStyles} from '@material-ui/core/styles';
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import GameCode from "./GameCode";

const useStyles = makeStyles({
    root: {
        width: 500,
    },
    stickToBottom: {
        width: '100%',
        position: 'sticky',
        bottom: 0
    },
    mainContainer: {
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
    },
    mainView: {
        padding: '10px',
        flex: 1
    }
});

export default function App() {
    const classes = useStyles();
    const [navValue, setNavValue] = React.useState(0);

    return (
        <Router>
            <div className={classes.mainContainer}>
                <div className={classes.mainView}>
                    {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
                    <Switch>
                        <Route path="/game-info">
                            <GameInfo/>
                        </Route>
                        <Route path="/card-info">
                            <CardInfo/>
                        </Route>
                        <Route path="/">
                            <GameCode/>
                        </Route>
                    </Switch>
                </div>
                <BottomNavigation
                    value={navValue}
                    onChange={(event, newValue) => {
                        setNavValue(newValue);
                    }}
                    showLabels
                    className={classes.stickToBottom}>
                    <BottomNavigationAction component={Link} to={"/"} label="Current Game"
                                            icon={<AccountMultiple/>}/>
                    <BottomNavigationAction component={Link} to={"/game-info"} label="Game Info" icon={<Bomb/>}/>
                    <BottomNavigationAction component={Link} to={"/card-info"} label="Card Info"
                                            icon={<CardsOutline/>}/>
                </BottomNavigation>
            </div>
        </Router>
    );
}


function CurrentGame() {
    return <h2>CurrentGame</h2>;
}

function GameInfo() {
    return <h2>GameInfo</h2>;
}

function CardInfo() {
    return <h2>CardInfo</h2>;
}
