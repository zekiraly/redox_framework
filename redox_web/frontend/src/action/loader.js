import {DATA_LOADED, DATA_LOADING} from "./index";

export function dataLoading(name, timestamp) {
    return {
        type: DATA_LOADING,
        name,
        timestamp
    }
}

export function dataLoaded(name, timestamp) {
    return {
        type: DATA_LOADED,
        name,
        timestamp
    }
}