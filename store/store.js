import thunkMiddleware from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";
import { initState } from "./general/generalActions";

/** window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ **/

export const loadState = () => {
  const ISSERVER = typeof window === "undefined";

  let serializedState;
  try {
    if (!ISSERVER) {
      serializedState = localStorage.getItem("state");
    }

    if (serializedState === null) {
      return undefined;
    }

    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("state", serializedState);
  } catch (err) {}
};

const store = createStore(
  rootReducer,
  loadState(),
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

store.subscribe(() => {
  saveState(store.getState());
});

store.dispatch(initState());

export default store;
