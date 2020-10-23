import {combineReducers} from "redux";

import {datasetListReducer} from "./datasetList";
import {datasetDetailsReducer} from "./datasetDetails";

export const datasetReducer = combineReducers({
    list: datasetListReducer,
    details: datasetDetailsReducer,
})