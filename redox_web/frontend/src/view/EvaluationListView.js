import React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PaperSection from "../component/common/PaperSection";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import {isLoaded} from "../reducer/loader";
import {doStartEvaluation, doUpdateEvaluationForm} from "../action/evaluation";
import CreateEvaluationDialog from "../component/evaluation/CreateEvaluationDialog";
import {ActiveEvaluationTable, FinishedEvaluationTable} from "../component/evaluation/EvaluationTable";
import NoDataPlaceHolder from "../component/common/NoDataPlaceholder";
import {ActiveTrainingTable} from "../component/training/TrainingTable";

const useStyles = makeStyles({

})

function EvaluationListView(props) {
    const classes = useStyles();
    const {onStartEvaluation, activeEvaluations, finishedEvaluations, formLoaded, onOpenCreateForm} = props;
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const onCreateClick = () => {
        onOpenCreateForm();
        setDialogOpen(true);
    }

    return (
        <React.Fragment>
            <PaperSection
                title={"Active evaluations"}
                button={
                    <Button variant="contained" color="primary" onClick={onCreateClick} startIcon={<AddIcon/>}>
                        New Evaluation
                    </Button>
                }
            >
                {activeEvaluations.count() === 0
                    ? <NoDataPlaceHolder text={"There are no active evaluations"}/>
                    : <ActiveEvaluationTable evaluations={activeEvaluations}/>
                }
            </PaperSection>
            <div style={{height: 30}}></div>
            <PaperSection
                title={"Finished evaluations"}
            >
                {finishedEvaluations.count() === 0
                    ? <NoDataPlaceHolder text={"There are no finished evaluations yet"}/>
                    : <FinishedEvaluationTable evaluations={finishedEvaluations}/>
                }
            </PaperSection>
            {formLoaded && dialogOpen && <CreateEvaluationDialog onClose={() => setDialogOpen(false)}/>}
        </React.Fragment>
    )
}

const ACTIVE_STATES = ['PENDING', 'IN_PROGRESS'];
const FINISHED_STATES = ['ERROR', 'FINISHED'];

function mapStateToProps(state, props) {

    let activeEvaluations = state.evaluation.list.valueSeq().filter(e => ACTIVE_STATES.includes(e.get('status')));
    let finishedEvaluations = state.evaluation.list.valueSeq().filter(e => FINISHED_STATES.includes(e.get('status')));

    return {
        activeEvaluations: activeEvaluations,
        finishedEvaluations: finishedEvaluations,
        formLoaded: isLoaded(state,'create_evaluation_form_datasets')
            && isLoaded(state, 'create_evaluation_form_trainings')
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        onStartEvaluation: (evaluationData) => {
            dispatch(doStartEvaluation(evaluationData));
        },
        onOpenCreateForm: () => {
            dispatch(doUpdateEvaluationForm());
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EvaluationListView);