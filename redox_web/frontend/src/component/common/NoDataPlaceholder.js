import React from 'react';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    container: {
        fontWeight: 'bold',
        color: 'grey'
    }
});

export default function NoDataPlaceHolder(props) {
    const classes = useStyles();
    return (<div className={classes.container}>
        {props.text}
    </div>)
}