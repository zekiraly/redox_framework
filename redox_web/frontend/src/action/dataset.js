import {performDelete, performGet, performJsonPost, performPost} from "../util/request";
import {
    ADD_DATASET,
    ADD_FILE_TO_DATASET,
    DELETE_FILE_FROM_DATASET,
    LOAD_DATASETS,
    UPDATE_DATASET_DETAILS
} from "./index";
import {dataLoaded, dataLoading} from "./loader";

export function addDataset(dataset) {
    return {
        type: ADD_DATASET,
        dataset: dataset
    }
}

export function deleteFileFromDataset(upload_id) {
    return {
        type: DELETE_FILE_FROM_DATASET,
        upload_id
    }
}

export function loadDatasets(datasets) {
    return {
        type: LOAD_DATASETS,
        datasets: datasets
    }
}

export function addFileToDataset(file) {
    return {
        type: ADD_FILE_TO_DATASET,
        file
    }
}

export function updateDatasetDetails(details) {
    return {
        type: UPDATE_DATASET_DETAILS,
        details: details
    }
}

export function doCreateDataset(dataset){
    return (dispatch) => {
        performJsonPost("/api/dataset", dataset).then(response => {
            dispatch(addDataset(response));
        });
    }
}

export function doLoadDatasets() {
    return (dispatch) => {
        performGet("/api/dataset").then(response => {
            dispatch(loadDatasets(response));
        });
    }
}

export function doUpdateDatasetDetails(dataset_id) {
    const timestamp = Date.now();
    return (dispatch) => {
        dispatch(dataLoading('dataset_details', timestamp));
        performGet('/api/dataset/'+ dataset_id + '/details').then(result => {
            dispatch(updateDatasetDetails(result));
            dispatch(dataLoaded('dataset_details', timestamp));
        })
    }
}

export function doAddFileToDataset(file) {
    return (dispatch) => {
        dispatch(addFileToDataset(file));
    }
}

export function doDeleteFileFromDataset(upload_id) {
    return (dispatch) => {
        performDelete(`/api/upload/${upload_id}`).then(response => {
            dispatch(deleteFileFromDataset(upload_id));
        });
    }
}