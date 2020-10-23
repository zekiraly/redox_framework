import React, {useEffect, useRef} from 'react';

import renderFormInput, {
    RenderButtonInput,
    RenderGroupSelectInput,
    RenderModelInput,
    RenderSelectInput
} from "../form/FormInput";
import {FormSection, reduxForm} from "redux-form/lib/immutable";
import Field from "redux-form/lib/immutable/Field";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {featurizations, models} from "../../util/environment";
import {connect} from "react-redux";
import formValueSelector from "redux-form/lib/immutable/formValueSelector";
import RenderFormInput from "../form/FormInput";
import Button from "@material-ui/core/Button";
import {doStartEvaluation} from "../../action/evaluation";

const useStyles = makeStyles({
    formContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    formSection: {
        width: '100%'
    },
    sectionTitle: {

    }
});

function CreateEvaluationForm(props) {
    const {change, handleSubmit, pristine, reset, submitting} = props;
    const {trainings, datasets} = props;
    const classes = useStyles();

    const datasetElements = [];
    for (let i = 0; i < datasets.size; i++) {
        let dataset = datasets.get(i);
        let group = {label: dataset.get('name'), items: []}
        let uploads = dataset.get('uploads');
        for (let j = 0; j < uploads.size; j++) {
            let upload = uploads.get(j);
            let item = {value: upload.get('upload_id'), label: upload.get('file_name')}
            group.items.push(item);
        }
        datasetElements.push(group);
    }

    const trainingElements = [];
    for (let i = 0; i < trainings.size; i++) {
        let training = trainings.get(i);
        trainingElements.push({
            label: training.get('name') + ' (' + training.get('model') + ')',
            value: training.get('task_id')
        })
    }

    return (<React.Fragment>
        <div className={classes.formSection}>
            <Field name={"name"} label={"Name"} component={RenderFormInput}/>
        </div>
        <div className={classes.formSection}>
            <div className={classes.sectionTitle}>- Choose a pretrained model</div>
            <Field
                name={"training_id"}
                component={RenderSelectInput}
                options={trainingElements}
            />
        </div>
        <div className={classes.formSection}>
            <div className={classes.sectionTitle}>- Dataset settings</div>
            <div>Test</div>
            <Field
                name={"test_set"}
                component={RenderGroupSelectInput}
                groups={datasetElements}
            />
        </div>
        <Button onClick={handleSubmit}>
            Finish
        </Button>
    </React.Fragment>)


}

const selector = formValueSelector('create-evaluation')

function mapStateToProps(state, props) {
    return {
        datasets: state.evaluation.form.get('datasets'),
        trainings: state.evaluation.form.get('trainings')
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        onSubmit: (evaluationData) => {
            dispatch(doStartEvaluation(evaluationData));
        },
    }
}

const CreateEvaluationReduxForm = reduxForm({
    form: 'create-evaluation'
})(CreateEvaluationForm);

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateEvaluationReduxForm);