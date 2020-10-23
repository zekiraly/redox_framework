import React from 'react';
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Link, withRouter} from "react-router-dom";

const useStyles = makeStyles( {
    toolbar: {
        maxWidth: 1280,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    link: {
        color: 'inherit',
        textDecoration: 'none'
    }
})

const tabs = [
    {label: 'Training', url: '/training'},
    {label: 'Evaluation', url: '/evaluation'},
    {label: 'Datasets', url: '/dataset'},
]

const activeIndex = (path) => {
    let activeIndex = 0;
    for (let i = 0; i < tabs.length; i++) {
        if (!!path && path.startsWith(tabs[i].url)) {
            activeIndex = i;
            break;
        }
    }
    return activeIndex;
}

function Navbar(props) {

    const classes = useStyles();
    const activeTab = activeIndex(props.location.pathname);
    const handleCallToRouter = (url) => {
        props.history.push(url);
    }

    return (
        <AppBar position="static">
            <Toolbar classes={{root: classes.toolbar}} variant="dense">
                <nav>
                    <Tabs value={activeTab} onChange={handleCallToRouter}>
                        {tabs.map((tab, idx) =>
                            <Tab key={`tab_${idx}`} label={tab.label} onClick={() => handleCallToRouter(tab.url)}/>
                        )}
                    </Tabs>
                </nav>
                <Button color="inherit" href={"/logout"}>Log out</Button>
            </Toolbar>
        </AppBar>
    )
}

export default withRouter(Navbar);