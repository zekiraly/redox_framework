import React from 'react';
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppFrame from "./component/layout/AppFrame";
import {MuiThemeProvider} from "@material-ui/core";

import {
    BrowserRouter,
    Switch,
    Route
} from 'react-router-dom'
import TrainingListView from "./view/TrainingListView";
import TrainingDetailsView from "./view/TrainingDetailsView";
import EvaluationListView from "./view/EvaluationListView";
import EvaluationDetailsView from "./view/EvaluationDetailsView";
import {doGetTrainingProgress, doLoadTrainings, doStartTraining, doSubscribeToTrainings} from "./action/training";
import {connect} from "react-redux";
import DatasetListView from "./view/DatasetListView";
import DatasetDetailsView from "./view/DatasetDetailsView";
import {doLoadDatasets} from "./action/dataset";
import {doLoadEvaluations, doSubscribeToEvaluations} from "./action/evaluation";

const theme = createMuiTheme({
    overrides: {
    },
    palette: {
        background: {
            default: '#eaeff1'
        }
    }
});

function App(props) {
    const {subscribeToTrainings} = props;
    React.useEffect(() => {
        props.loadDatasets();
        props.loadEvaluations();
        props.loadTrainings();
        props.subscribeToTrainings();
        props.subscribeToEvaluations();
    })

    return (
        <MuiThemeProvider theme={theme}>
            <BrowserRouter>
                <React.Fragment>
                    <CssBaseline />
                    <AppFrame>
                        <Switch>
                            <Route path="/evaluation/:task_id" component={EvaluationDetailsView}/>
                            <Route path="/evaluation" component={EvaluationListView}/>
                            <Route path="/dataset/:dataset_id" component={DatasetDetailsView}/>
                            <Route exact path="/dataset" component={DatasetListView}/>
                            <Route path="/training/:task_id" component={TrainingDetailsView}/>
                            <Route path="*" component={TrainingListView}/>
                        </Switch>
                    </AppFrame>
                </React.Fragment>
            </BrowserRouter>
        </MuiThemeProvider>
    );
}

function mapStateToProps(state, props) {
    return {

    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        subscribeToTrainings: () => dispatch(doSubscribeToTrainings()),
        subscribeToEvaluations: () => dispatch(doSubscribeToEvaluations()),
        loadDatasets: () => dispatch(doLoadDatasets()),
        loadEvaluations: () => dispatch(doLoadEvaluations()),
        loadTrainings: () => dispatch(doLoadTrainings()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);