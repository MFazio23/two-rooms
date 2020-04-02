import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {Card, TextField} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import {withStyles} from '@material-ui/core/styles';
import Button from "@material-ui/core/Button";

const styles = {
    root: {
        backgroundColor: 'red',
    },
};

const useStyles = makeStyles({
    root: {
        minWidth: 275,
        maxWidth: 800,
        margin: '0 auto'
    },
    title: {
        fontSize: 42,
        color: 'orange',
        textAlign: 'center'
    },
    form: {
        textAlign: 'center'
    },
    inputField: {
        margin: 10
    },
    input: {
        fontSize: 32
    },
    gameCode: {
        textTransform: 'uppercase'
    }
});

function GameCode() {
    const classes = useStyles();

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Join Two Room and a Boom
                </Typography>
                <form noValidate autoComplete="off" className={classes.form}>
                    <div>
                        <TextField id="game-code" label="Game Code" variant="outlined" className={classes.inputField}
                                   inputProps={{maxLength: 6}}
                                   InputProps={{className: classes.input, classes: {input: classes.gameCode}}}
                                   required/>
                        <br/>
                        <TextField id="player-name" label="Player Name" variant="outlined"
                                   className={classes.inputField} InputProps={{className: classes.input}} required/>
                    </div>
                    <Button variant="contained" color="primary" size='large'>Join Game</Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default withStyles(styles)(GameCode);