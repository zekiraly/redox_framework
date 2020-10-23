import {fromJS} from "immutable";
import {ADD_FILE_TO_DATASET, DELETE_FILE_FROM_DATASET, UPDATE_DATASET_DETAILS} from "../../action";

export function datasetDetailsReducer(state = fromJS({
}), action) {
    if (action.type === UPDATE_DATASET_DETAILS) {
        return fromJS(action.details)
    }
    if (action.type === ADD_FILE_TO_DATASET) {
        return state.update('uploads', uploads => uploads.push(fromJS(action.file)));
    }
    if (action.type === DELETE_FILE_FROM_DATASET) {
        return state.set('uploads', state.get('uploads').filter(u => u.get('upload_id') !== action.upload_id));
    }
    return state;
}