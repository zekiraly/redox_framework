import React from 'react'
import Paper from "@material-ui/core/Paper";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import {connect} from "react-redux";
import {doGetTrainingProgress, doStartTraining, doUpdateTrainingForm} from "../action/training";
import AddIcon from '@material-ui/icons/AddCircle';
import PaperSection from "../component/common/PaperSection";
import {ActiveTrainingTable, FinishedTrainingTable} from "../component/training/TrainingTable";
import CreateTrainingDialog from "../component/training/CreateTrainingDialog";
import {isLoaded} from "../reducer/loader";
import NoDataPlaceHolder from "../component/common/NoDataPlaceholder";

const useStyles = makeStyles({
})

function TrainingListView(props) {
    const classes = useStyles();
    const {onStartTraining, activeTrainings, finishedTrainings, formLoaded, onOpenCreateForm} = props;
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const onCreateClick = () => {
        onOpenCreateForm();
        setDialogOpen(true);
    }

    return (
        <React.Fragment>
            <PaperSection
                title={"Active trainings"}
                button={
                    <Button variant="contained" color="primary" onClick={onCreateClick} startIcon={<AddIcon/>}>
                        New Training
                    </Button>
                }
            >
                {activeTrainings.count() === 0
                    ? <NoDataPlaceHolder text={"There are no active trainings"}/>
                    : <ActiveTrainingTable trainings={activeTrainings}/>
                }
            </PaperSection>
            <div style={{height: 30}}></div>
            <PaperSection
                title={"Finished trainings"}
            >
                {finishedTrainings.count() === 0
                    ? <NoDataPlaceHolder text={"There are no finished trainings yet"}/>
                    : <FinishedTrainingTable trainings={finishedTrainings}/>
                }
            </PaperSection>
            {formLoaded && dialogOpen && <CreateTrainingDialog onClose={() => setDialogOpen(false)}/>}
        </React.Fragment>
    )
}

const ACTIVE_STATES = ['PENDING', 'IN_PROGRESS'];
const FINISHED_STATES = ['ERROR', 'FINISHED'];

function mapStateToProps(state, props) {

    let activeTrainings = state.training.list.valueSeq().filter(t => ACTIVE_STATES.includes(t.get('status')));
    let finishedTrainings = state.training.list.valueSeq().filter(t => FINISHED_STATES.includes(t.get('status')));

    return {
        activeTrainings: activeTrainings,
        finishedTrainings: finishedTrainings,
        formLoaded: isLoaded(state,'create_training_form')
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        onStartTraining: (trainingData) => {
            dispatch(doStartTraining(trainingData));
        },
        onOpenCreateForm: () => {
            dispatch(doUpdateTrainingForm());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TrainingListView);