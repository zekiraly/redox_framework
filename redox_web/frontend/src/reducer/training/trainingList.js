import {fromJS} from "immutable";
import {ADD_TRAINING, LOAD_TRAININGS, UPDATE_TRAINING_PROGRESS, UPDATE_TRAINING_STATUS} from "../../action";

export function trainingListReducer(state = fromJS({
}), action) {
    if (action.type === LOAD_TRAININGS) {
        const trainings = action.trainings;
        const dictionary = {}
        for (let i = 0; i < trainings.length; i++) {
            dictionary[trainings[i].task_id] = trainings[i];
        }
        return fromJS(dictionary);
    }
    if (action.type === ADD_TRAINING) {
        const training = action.training;
        return state.set(training.task_id, fromJS(training));
    }
    if (action.type === UPDATE_TRAINING_PROGRESS) {
        if (!!state.get(action.task_id)) {
            return state.setIn([action.task_id, 'progress'], action.progress)
                .setIn([action.task_id, 'loss'], action.loss);
        }
    }
    if (action.type === UPDATE_TRAINING_STATUS) {
        if (!!state.get(action.task_id)) {
            return state.setIn([action.task_id, 'status'], action.status);
        }
    }

    return state;
}