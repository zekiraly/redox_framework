import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import Paper from "@material-ui/core/Paper";
import React from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        height: 60,
        paddingLeft: 15,
        paddingRight: 15,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4,
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold'
    },
    content: {
        minHeight: 90,
        padding: 15,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
});

export default function PaperSection(props) {
    const classes = useStyles();
    return <Paper>
        <div className={classes.header}>
            <div className={classes.title}>{props.title}</div>
            {props.button && <div>
                {props.button}
            </div>}
        </div>
        <div className={classes.content}>
            {props.children}
        </div>
    </Paper>
}
