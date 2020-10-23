import React from 'react';
import {connect} from "react-redux";
import makeStyles from "@material-ui/core/styles/makeStyles";
import PaperSection from "../component/common/PaperSection";

const useStyles = makeStyles({

})

function TrainingDetailsView(props) {
    return <PaperSection title={"3DGCN #2"}>
        <div>
            <div>Metadata</div>
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
)(TrainingDetailsView);