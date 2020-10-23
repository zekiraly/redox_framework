import {performGet, performJsonPost} from "../util/request";
import {
    ADD_TRAINING,
    LOAD_TRAININGS,
    UPDATE_EVALUATION_STATUS,
    UPDATE_TRAINING_FORM_DATA,
    UPDATE_TRAINING_PROGRESS, UPDATE_TRAINING_STATUS
} from "./index";
import {dataLoaded, dataLoading} from "./loader";
import {updateDatasetDetails} from "./dataset";

function loadTrainings(trainings) {
    return {
        type: LOAD_TRAININGS,
        trainings
    }
}

function addTraining(training) {
    return {
        type: ADD_TRAINING,
        training
    }
}

function updateTrainingStatus(task_id, status) {
    return {
        type: UPDATE_TRAINING_STATUS,
        task_id,
        status
    }
}

function updateTrainingProgress(task_id, progress, loss) {
    return {
        type: UPDATE_TRAINING_PROGRESS,
        task_id,
        progress,
        loss
    }
}

function formDataLoaded(datasets) {
    return {
        type: UPDATE_TRAINING_FORM_DATA,
        datasets
    }
}

export function doLoadTrainings() {
    return (dispatch) => {
        performGet("/api/training").then(response => {
            dispatch(loadTrainings(response));
        });
    }
}



export function doStartTraining(trainingData) {
    return dispatch => {
        performJsonPost("/api/training", trainingData).then(response => {
            dispatch(addTraining(response));
        });
    }
}

export function doGetTrainingProgress(task_id) {
    return dispatch => {
        performGet("/api/getTrainingProgress", {task_id}).then(response => {
            dispatch(updateTrainingProgress(task_id, response.progress, response.loss))
        });
    }
}



export function doSubscribeToTrainings() {
    return dispatch => {
        try {
            const protocolPrefix = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            let { host } = window.location;
            let ws = new WebSocket(`${protocolPrefix}//${host}/ws/training`);
            ws.onmessage = (event) => {
                let jsonMessage = JSON.parse(event.data);
                if (jsonMessage.message_type === 'UPDATE_PROGRESS') {
                    dispatch(updateTrainingProgress(jsonMessage.task_id, jsonMessage.progress, jsonMessage.loss))
                } else {
                    dispatch(updateTrainingStatus(jsonMessage.task_id, jsonMessage.status))
                }

            };
        } catch (error) {
            console.log("Could not connect to websocket")
        }
    }
}

export function doUpdateTrainingForm() {
    const timestamp = Date.now();
    return (dispatch) => {
        dispatch(dataLoading('create_training_form', timestamp));
        performGet('/api/dataset/info').then(result => {
            dispatch(formDataLoaded(result))
            dispatch(dataLoaded('create_training_form', timestamp));
        })
    }
}