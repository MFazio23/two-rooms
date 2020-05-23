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
    const iconClicked = typeof props.toggleWinningTeam === 'function' ? props.toggleWinningTeam : (() => false);

    return (
        <div className={classes.badges}>
            <StarIcon onClick={() => iconClicked('Blue')} fontSize="large"
                      htmlColor={props.winners?.includes('Blue') ? blue[500] : loserColor}/>

            <Icon onClick={() => iconClicked('Red')} path={mdiBomb} title="Red Team" size={1.5}
                  color={props.winners?.includes('Red')  ? red[500] : loserColor}/>

            <HelpIcon onClick={() => iconClicked('Gray')} fontSize="large"
                      htmlColor={props.winners?.includes('Gray')  ? 'gray' : loserColor}/>

            <HelpIcon onClick={() => iconClicked('Green')} fontSize="large"
                      htmlColor={props.winners?.includes('Green')  ? green[500] : loserColor}/>
        </div>
    )
}

