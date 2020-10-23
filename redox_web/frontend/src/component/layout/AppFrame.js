import React from "react";
import Navbar from "./Navbar";
import Container from '@material-ui/core/Container';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    container: {
        marginTop: 30
    }
})

export default function AppFrame({ children }) {
    const classes = useStyles();
    return (
        <React.Fragment>
            <Navbar/>
            <main>
                <Container maxWidth="lg" classes={{root: classes.container}}>
                    {children}
                </Container>
            </main>
        </React.Fragment >
    );
}