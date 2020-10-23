import {combineReducers} from "redux";
import {trainingListReducer} from "./trainingList";
import {trainingDetailsReducer} from "./trainingDetails";
import {trainingFormReducer} from "./trainingForm";

export const trainingReducer = combineReducers({
    list: trainingListReducer,
    details: trainingDetailsReducer,
    form: trainingFormReducer
})