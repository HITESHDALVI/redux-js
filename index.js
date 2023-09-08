import {createStore, applyMiddleware, combineReducers} from "redux";
// use to log all change in state in termial
import logger from "redux-logger";
import thunk from "redux-thunk";
import axios from "axios";

let history = [];

// action name constants
const INITILIZER = "account/initilizer";
const INCREMENT = "account/increment";
const DECREMENT = "account/decrement";
const GETUSERACCOUNTSUCCESS = "account/success";
const GETUSERACCOUNTPENDING = "account/pending";
const GETUSERACCOUNTREJECTED = "account/rejected";
const INCREMENTBYAMOUNT = "account/increment_by_amount";
const INCREASEBONUS = "bonus/increase_bonus";
// reducer
const accountReducer = (state = {amount: 1}, action) => {
  switch (action.type) {
    case INITILIZER:
      return {amount: action.payload};
    case INCREMENT:
      return {amount: state.amount + 1};
    case DECREMENT:
      return {amount: state.amount - 1};
    case INCREMENTBYAMOUNT:
      return {amount: state.amount + action.payload};
    default:
      return state;
  }
};
const bonusReducer = (state = {points: 1}, action) => {
  switch (action.type) {
    case INCREASEBONUS:
      return {points: state.points + 1};
    case GETUSERACCOUNTSUCCESS:
      return {points: action.payload, pending: false};
    case GETUSERACCOUNTREJECTED:
      return {...state, error: action.error, pending: false};
    case GETUSERACCOUNTPENDING:
      return {...state, pending: true};
    case INCREMENTBYAMOUNT:
      return action.payload >= 100
        ? {points: state.points + action.payload}
        : state;
    default:
      return state;
  }
};
// store
// applyMiddleware used to perform some action between reducer and dispatch
const store = createStore(
  combineReducers({account: accountReducer, bonus: bonusReducer}),
  applyMiddleware(logger.default, thunk.default)
);

// subscribe
// store.subscribe(() => {
//   history.push(store.getState());
//   console.log(history);
// });

// action creators
const initilizer = (value) => {
  return {type: INITILIZER, payload: value};
};
const increment = () => {
  return {type: INCREMENT};
};
const increaseBonus = () => {
  return {type: INCREASEBONUS};
};
const decrement = () => {
  return {type: DECREMENT};
};
const incrementByAmount = (value) => {
  return {type: INCREMENTBYAMOUNT, payload: value};
};

// Aysnc API call
const getUser = (id) => {
  return async (dispatch, getState) => {
    try {
      dispatch(getAccountPending());
      const {data} = await axios.get(`http://localhost:3000/account/${id}`);
      dispatch(getAccountSuccess(data.amount));
    } catch (error) {
      dispatch(getAccountFailed(error.message));
    }
  };
};

const getAccountSuccess = (value) => {
  return {type: GETUSERACCOUNTSUCCESS, payload: value};
};
const getAccountFailed = (error) => {
  return {type: GETUSERACCOUNTREJECTED, error: error};
};
const getAccountPending = (value) => {
  return {type: GETUSERACCOUNTPENDING};
};

// getUser();
setTimeout(() => {
  //   store.dispatch(decrement());
  //   store.dispatch(increment());
  //   store.dispatch(incrementByAmount(2));
  store.dispatch(getUser(8));
  //   store.dispatch(increaseBonus());
}, 2000);

// global state

// console.log(store.getState(), {store});
