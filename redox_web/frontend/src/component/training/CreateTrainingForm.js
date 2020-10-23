import React, {useEffect, useRef} from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import renderFormInput, {RenderButtonInput, RenderGroupSelectInput, RenderModelInput} from "../form/FormInput";
import {FormSection, reduxForm} from "redux-form/lib/immutable";
import Field from "redux-form/lib/immutable/Field";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {featurizations, models} from "../../util/environment";
import {doStartTraining} from "../../action/training";
import {connect} from "react-redux";
import formValueSelector from "redux-form/lib/immutable/formValueSelector";
import RenderFormInput from "../form/FormInput";
import Button from "@material-ui/core/Button";

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

function CreateTrainingForm(props) {
    const {change, handleSubmit, pristine, reset, submitting} = props;
    const {selectedModel, selectedFeaturization, datasets} = props;
    const classes = useStyles();
    const mounted = useRef();

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


    useEffect(
        () => {
            if (selectedModel && models[selectedModel].params) {
                Object.entries(models[selectedModel].params).forEach(([code, settings]) => {
                    change(`model_params.${code}`, settings.default);
                });
            }
        }, [selectedModel]);
    useEffect(
        () => {
            if (selectedFeaturization && featurizations[selectedFeaturization].params) {
                Object.entries(featurizations[selectedFeaturization].params).forEach(([code, settings]) => {
                    change(`featurization_params.${code}`, settings.default);
                });
            }
        }, [selectedFeaturization]);

    const availableFeaturizations = {};
    if (selectedModel) {
        models[selectedModel].availableFeaturizations.forEach(featurization => {
            availableFeaturizations[featurization] = featurizations[featurization];
        })
    }

    const modelChanged = (newModel) => {
        let newFeaturization = null;
        const availableFeaturizations = models[newModel].availableFeaturizations;
        if (availableFeaturizations.length === 1) {
            newFeaturization = availableFeaturizations[0];
        }
        change('featurization', newFeaturization);
    }

    //Ha változott a selectedModel vagy a selectedFeaturization

    return (<React.Fragment>
        <div className={classes.formSection}>
            <Field name={"name"} label={"Name"} component={RenderFormInput}/>
            <Field name={"description"} label={"Description"} type={"textarea"} multiline component={RenderFormInput}/>
        </div>
        <div className={classes.formSection}>
            <div className={classes.sectionTitle}>- Choose a model</div>
            <Field
                name={"model"}
                component={RenderButtonInput}
                options={models}
                onChange={modelChanged}
            />
        </div>
        <div className={classes.formSection}>
            <div className={classes.sectionTitle}>- Choose featurization</div>
            <Field
                name={"featurization"}
                component={RenderButtonInput}
                options={availableFeaturizations}
            />
        </div>
        <div className={classes.formSection}>
            <div className={classes.sectionTitle}>- Dataset settings</div>
            <div>Training</div>
            <Field
                name={"training_set"}
                component={RenderGroupSelectInput}
                groups={datasetElements}
            />
            <div>Validation</div>
            <Field
                name={"validation_set"}
                component={RenderGroupSelectInput}
                groups={datasetElements}
            />
        </div>
        {selectedFeaturization && featurizations[selectedFeaturization].params &&
        <div className={classes.formSection}>
            <div className={classes.sectionTitle}>- Featurization parameters</div>
            <FormSection name={"featurization_params"}>
                {Object.entries(featurizations[selectedFeaturization].params).map(([name, settings]) => {
                    return <Field key={`feature_field_${name}`} name={name} {...settings} component={RenderFormInput} fullWidth/>
                })}
            </FormSection>
        </div>
        }
        {selectedModel && models[selectedModel].params &&
            <div className={classes.formSection}>
                <div className={classes.sectionTitle}>- Model parameters</div>
                <FormSection name={"model_params"}>
                    {Object.entries(models[selectedModel].params).map(([name, settings]) => {
                        let parse = undefined;
                        if (settings.type === 'number') {
                            parse = value => Number(value)
                        }
                        return <Field key={`model_field_${name}`} name={name} {...settings} component={RenderFormInput} parse={parse}/>
                    })}
                </FormSection>
            </div>
        }
        <Button onClick={handleSubmit}>
            Finish
        </Button>
    </React.Fragment>)


}

const selector = formValueSelector('create-training')

function mapStateToProps(state, props) {
    return {
        selectedModel: selector(state, 'model'),
        selectedFeaturization: selector(state, 'featurization'),
        datasets: state.training.form.get('datasets')
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        onSubmit: (trainingData) => {
            dispatch(doStartTraining(trainingData));
        },
    }
}

const CreateTrainingReduxForm = reduxForm({
    form: 'create-training'
})(CreateTrainingForm);

export default  connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateTrainingReduxForm);