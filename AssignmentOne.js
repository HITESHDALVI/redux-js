import logger from "redux-logger";
import thunk from "redux-thunk";
import {createStore, applyMiddleware, combineReducers} from "redux";
import axios from "axios";

const POSTSUCCESS = "POSTSUCCESS";
const POSTPENDING = "POSTPENDING";
const POSTFAILED = "POSTFAILED";

const store = createStore(
  reducer,
  applyMiddleware(logger.default, thunk.default)
);
const initialState = {data: null, error: "", pending: false};
function reducer(initialState, action) {
  switch (action.type) {
    case POSTSUCCESS:
      return {data: action.payload, error: "", pending: false};
    case POSTPENDING:
      return {data: null, error: "", pending: true};
    case POSTFAILED:
      return {data: null, error: action.error, pending: false};
    default:
      return initialState;
  }
}
const getPostSuccess = (value) => {
  return {type: POSTSUCCESS, payload: value};
};
const getPostFailed = (error) => {
  return {type: POSTFAILED, error: error};
};
const getPostPending = () => {
  return {type: POSTPENDING};
};

const getPost = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch(getPostPending());
      const {data} = await axios.get(
        `https://jsonplaceholder.typicode.com/posts`
      );

      dispatch(getPostSuccess(data));
    } catch (error) {
      dispatch(getPostFailed(error.message));
    }
  };
};

store.dispatch(getPost(10));
