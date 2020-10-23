import React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PaperSection from "../component/common/PaperSection";
import {DatasetTable} from "../component/dataset/DatasetTable";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/AddCircle";
import CreateDatasetDialog from "../component/dataset/CreateDatasetDialog";
import NoDataPlaceHolder from "../component/common/NoDataPlaceholder";
import {ActiveEvaluationTable} from "../component/evaluation/EvaluationTable";

const useStyles = makeStyles({

})

const datasets = [
    {name: 'ESOL', description: '', numberOfFiles: 3},
    {name: 'FreeSolv', description: '', numberOfFiles: 3},
    {name: 'Lipophilicity', description: '', numberOfFiles: 3},
    {name: 'pyr2580', description: '', numberOfFiles: 3},
    {name: 'pyr1800', description: '', numberOfFiles: 3},
    {name: 'roth', description: '', numberOfFiles: 3}
]


function DatasetListView(props) {
    const {datasets} = props;
    const [dialogOpen, setDialogOpen] = React.useState(false);
    return <React.Fragment>
        <PaperSection
            title={"Datasets"}
            button={
                <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)} startIcon={<AddIcon/>}>
                    New Dataset
                </Button>
            }
        >
            {datasets.size === 0
                ? <NoDataPlaceHolder text={"There are no datasets yet"}/>
                : <DatasetTable datasets={datasets}/>
            }
        </PaperSection>
        {dialogOpen && <CreateDatasetDialog onClose={() => setDialogOpen(false)}/>}
    </React.Fragment>
}

function mapStateToProps(state, props) {
    return {
        datasets: state.dataset.list.valueSeq()
    }
}

function mapDispatchToProps(dispatch, props) {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetListView);