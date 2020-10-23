import {fromJS} from "immutable";
import {ADD_DATASET, LOAD_DATASETS} from "../../action";

export function datasetListReducer(state = fromJS({
}), action) {
    if (action.type === LOAD_DATASETS) {
        const datasets = action.datasets;
        const datasetMap = {};
        datasets.forEach(dataset => {
            datasetMap[dataset.dataset_id] = dataset;
        })
        return fromJS(datasetMap);
    }
    if (action.type === ADD_DATASET) {
        const dataset = action.dataset;
        return state.set(dataset.dataset_id, fromJS(dataset));
    }
    return state;
}