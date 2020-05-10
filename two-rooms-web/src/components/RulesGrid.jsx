import React from 'react';
import Grid from "@material-ui/core/Grid";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import {makeStyles} from "@material-ui/core/styles";
import gameRoles from "../gameRoles.json";

const useStyles = makeStyles(theme => ({
    gridItem: {
        textAlign: "start"
    }
}));

export default function RulesGrid(props) {
    const classes = useStyles();

    const roleItem = (role) => {
        const isLong = role.text.length > 10;
        return (
            <Grid item key={role.id} xs={isLong ? 12 : 6} sm={isLong ? 8 : 4} md={isLong ? 6 : 3}
                  className={classes.gridItem}>
                <FormControlLabel
                    control={
                        <Switch color={role.required ? 'secondary' : 'primary'}
                                checked={role.required || props.currentGame.roles[role.id]}
                                name={role.id} onChange={props.readOnly ? () => false : props.handleSwitchChange}/>}
                    label={role.text}
                />
            </Grid>
        );
    };

    return props.currentGame?.roles ? (
        <Grid container spacing={3}>
            {gameRoles.map(role => roleItem(role))}
        </Grid>
    ) : (<div/>)

}