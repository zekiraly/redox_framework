import {fromJS} from "immutable";
import {
    ADD_DATASET,
    ADD_EVALUATION,
    LOAD_EVALUATIONS,
    UPDATE_EVALUATION_STATUS,
    UPDATE_TRAINING_PROGRESS
} from "../../action";

export function evaluationListReducer(state = fromJS({
}), action) {
    if (action.type === LOAD_EVALUATIONS) {
        const evaluations = action.evaluations;
        const dictionary = {}
        for (let i = 0; i < evaluations.length; i++) {
            dictionary[evaluations[i].task_id] = evaluations[i];
        }
        return fromJS(dictionary);
    }
    if (action.type === ADD_EVALUATION) {
        const evaluation = action.evaluation;
        return state.set(evaluation.task_id, fromJS(evaluation));
    }
    if (action.type === UPDATE_EVALUATION_STATUS) {
        if (!!state.get(action.task_id)) {
            return state.setIn([action.task_id, 'status'], action.status);
        }
    }
    return state;
}