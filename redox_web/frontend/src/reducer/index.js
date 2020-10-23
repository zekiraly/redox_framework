import {applyMiddleware, createStore, combineReducers} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {reducer as formReducer} from 'redux-form/immutable'

import thunkMiddleware from "redux-thunk";
import {trainingReducer} from "./training";
import {datasetReducer} from "./dataset";
import {loaderReducer} from "./loader";
import {evaluationReducer} from "./evaluation";

export const store = createStore(combineReducers({
    training: trainingReducer,
    evaluation: evaluationReducer,
    dataset: datasetReducer,
    loader: loaderReducer,
    form: formReducer
}), composeWithDevTools(applyMiddleware(thunkMiddleware)));