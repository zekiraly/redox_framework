import {combineReducers} from "redux";
import {evaluationFormReducer} from "./evaluationForm";
import {evaluationDetailsReducer} from "./evaluationDetails";
import {evaluationListReducer} from "./evaluationList";

export const evaluationReducer = combineReducers({
    list: evaluationListReducer,
    details: evaluationDetailsReducer,
    form: evaluationFormReducer
})