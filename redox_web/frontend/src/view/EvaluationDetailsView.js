import React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PaperSection from "../component/common/PaperSection";

const useStyles = makeStyles({

})

function EvaluationDetailsView(props) {
    return <PaperSection title={"Evaluation #12"}>
        <div>

        </div>
    </PaperSection>
}

function mapStateToProps(state, props) {
    return {

    }
}

function mapDispatchToProps(dispatch, props) {
    return {

    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EvaluationDetailsView);