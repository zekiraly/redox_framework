import {fromJS} from "immutable";
import {DATA_LOADED, DATA_LOADING} from "../action";

export function loaderReducer(state = fromJS({
    loader: {}
}), action) {
    if (action.type === DATA_LOADING) {
        let previousState = state.get(action.name);
        if (!previousState || previousState.get('timestamp') < action.timestamp) {
            return state.set(action.name, fromJS({loading: true, timestamp: action.timestamp}))
        }
        return state;
    }
    if (action.type === DATA_LOADED) {
        let previousState = state.get(action.name);
        if (!previousState || previousState.get('timestamp') <= action.timestamp) {
            return state.set(action.name, fromJS({loading: false, timestamp: action.timestamp}))
        }
        return state;
    }
    return state;
}

export function isLoading(state, name) {
    const loaderState = state.loader.get(name);
    return loaderState && loaderState.get('loading');
}

export function isLoaded(state, name) {
    const loaderState = state.loader.get(name);
    return loaderState && !loaderState.get('loading');
}