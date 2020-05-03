import React from 'react';
import {blue, red, green} from "@material-ui/core/colors";
import HelpIcon from '@material-ui/icons/Help';
import StarIcon from '@material-ui/icons/Star';
import Icon from '@mdi/react';
import {mdiBomb} from '@mdi/js'
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
    badges: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        margin: 10
    }
}));

const loserColor = 'darkgray';

export default function WinningTeamBadges(props) {
    const classes = useStyles();
    const iconClicked = typeof props.iconClicked === 'function' ? props.iconClicked : (() => false);

    return (
        <div className={classes.badges}>
            <StarIcon onClick={() => iconClicked('blue')} fontSize="large"
                      htmlColor={!props.winner || props.winner === 'blue' ? blue[500] : loserColor}/>

            <Icon onClick={() => iconClicked('red')} path={mdiBomb} title="Red Team" size={1.5}
                  color={!props.winner || props.winner === 'red' ? red[500] : loserColor}/>

            <HelpIcon onClick={() => iconClicked('gray')} fontSize="large"
                      htmlColor={!props.winner || props.winner === 'gray' ? 'gray' : loserColor}/>

            <HelpIcon onClick={() => iconClicked('green')} fontSize="large"
                      htmlColor={!props.winner || props.winner === 'green' ? green[500] : loserColor}/>
        </div>
    )
}

