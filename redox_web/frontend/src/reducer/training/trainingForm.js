import {fromJS} from "immutable";
import {UPDATE_TRAINING_FORM_DATA} from "../../action";

export function trainingFormReducer(state = fromJS({
}), action) {
    if (action.type === UPDATE_TRAINING_FORM_DATA) {
        return state.set('datasets', fromJS(action.datasets))
    }
    return state;
}