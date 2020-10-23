import {performGet, performJsonPost} from "../util/request";
import {loadDatasets} from "./dataset";
import {ADD_EVALUATION, LOAD_EVALUATIONS, UPDATE_EVALUATION_FORM_DATA, UPDATE_EVALUATION_STATUS} from "./index";
import {dataLoaded, dataLoading} from "./loader";

function loadEvaluations(evaluations) {
    return {
        type: LOAD_EVALUATIONS,
        evaluations
    }
}

function addEvaluation(evaluation) {
    return {
        type: ADD_EVALUATION,
        evaluation
    }
}

function updateEvaluationStatus(task_id, status) {
    return {
        type: UPDATE_EVALUATION_STATUS,
        task_id,
        status
    }
}

function formDataTrainingsLoaded(trainings) {
    return {
        type: UPDATE_EVALUATION_FORM_DATA,
        data: 'trainings',
        trainings
    }
}

function formDataDatasetsLoaded(datasets) {
    return {
        type: UPDATE_EVALUATION_FORM_DATA,
        data: 'datasets',
        datasets
    }
}

export function doLoadEvaluations() {
    return (dispatch) => {
        performGet("/api/evaluation").then(response => {
            dispatch(loadEvaluations(response));
        });
    }
}

export function doStartEvaluation(evaluationData) {
    return dispatch => {
        performJsonPost("/api/evaluation", evaluationData).then(response => {
            dispatch(addEvaluation(response));
        });
    }
}

export function doUpdateEvaluationForm() {
    const timestamp = Date.now();
    return (dispatch) => {
        dispatch(dataLoading('create_evaluation_form_trainings', timestamp));
        dispatch(dataLoading('create_evaluation_form_datasets', timestamp));
        performGet('/api/training').then(result => {
            dispatch(formDataTrainingsLoaded(result))
            dispatch(dataLoaded('create_evaluation_form_trainings', timestamp));
        })
        performGet('/api/dataset/info').then(result => {
            dispatch(formDataDatasetsLoaded(result))
            dispatch(dataLoaded('create_evaluation_form_datasets', timestamp));
        })
    }
}

export function doSubscribeToEvaluations() {
    return dispatch => {
        try {
            const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            let { host } = window.location;
            let ws = new WebSocket(`${protocolPrefix}//${host}/ws/evaluation`);
            ws.onmessage = (event) => {
                let jsonMessage = JSON.parse(event.data);
                dispatch(updateEvaluationStatus(jsonMessage.task_id, jsonMessage.status))
            };
        } catch (error) {
            console.log("Could not connect to websocket")
        }
    }
}