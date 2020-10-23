import {fromJS} from "immutable";
import {UPDATE_EVALUATION_FORM_DATA} from "../../action";

export function evaluationFormReducer(state = fromJS({
}), action) {
    if (action.type === UPDATE_EVALUATION_FORM_DATA) {
        return state.set(action.data, fromJS(action[action.data]))
    }
    return state;
}