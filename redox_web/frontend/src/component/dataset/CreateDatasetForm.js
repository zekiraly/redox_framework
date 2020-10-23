import React from 'react';
import formValueSelector from "redux-form/lib/immutable/formValueSelector";
import {connect} from "react-redux";
import {Field, reduxForm} from "redux-form/lib/immutable";
import {RenderTextField} from "../form/FormInput";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {doCreateDataset} from "../../action/dataset";

const useStyles = makeStyles({
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    }
})

function CreateDatasetForm(props) {
    const classes = useStyles();
    const {onCancel, handleSubmit} = props;

    return(<div>
        <Field name="name" label="Name" type="text" component={RenderTextField}/>
        <Field name="description" multiline rows={4} label="Description" type="textarea" component={RenderTextField}/>
        <div className={classes.buttonContainer}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button onClick={handleSubmit}>Create</Button>
        </div>
    </div>)
}

const selector = formValueSelector('create-dataset')

function mapStateToProps(state, props) {
    return {
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        onSubmit: (dataset) => {
            dispatch(doCreateDataset(dataset))
        }
    }
}

const CreateDatasetReduxForm = reduxForm({
    form: 'create-dataset'
})(CreateDatasetForm)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateDatasetReduxForm);