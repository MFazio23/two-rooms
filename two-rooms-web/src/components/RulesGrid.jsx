import React from 'react';
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {makeStyles} from "@material-ui/core/styles";
import orange from "@material-ui/core/colors/orange";

const useStyles = makeStyles(theme => ({
    disabledSwitch: {
        backgroundColor: "blue",
        thumbOnColor: "yellow"
    }
}));

export default function RulesGrid(props) {
    const classes = useStyles();

    const roleItem = (role) => {
        const isLong = role.text.length > 10;
        return (
            <Grid item key={role.id} xs={isLong ? 12 : 6} md={isLong ? 6 : 3}>
                <FormControlLabel
                    control={
                        <Switch color={role.required ? 'secondary' : 'primary'} checked={props.gameInfo[role.id]}
                                name={role.id} classes={{ disabled: classes.disabledSwitch }} disabled={role.required}/>}
                    label={role.text}
                />
            </Grid>
        );
    };

    return (
        <Grid container spacing={3}>
            {props.gameRoles.map(role => roleItem(role))}
        </Grid>
    )

}