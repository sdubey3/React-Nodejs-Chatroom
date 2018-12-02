import { combineReducers } from "redux";
import { createReducer } from "redux-act";
import {
  login,
  logout,
  addUser,
  removeUser,
  newMessage,
  newRoom,
  getRoom
} from "./actions";

const initial = {
  app: {
    username: null,
    room: null,
    rooms: []
  },
  users: {},
  messages: {
    entities: []
  }
};

const app = createReducer(
  {
    [login]: (state, payload) => {
      return { ...state, username: payload.username, room: payload.room };
    },
    [logout]: (state, payload) => {
      return { ...state, username: null, room: null };
    },
    [newRoom]: (state, payload) => {
      let { rooms } = state;
      rooms.push({ name: payload.room, counts: 0 });
      return { ...state, rooms: rooms };
    },
    [getRoom]: (state, payload) => {
      const { rooms } = payload;
      return { ...state, rooms: rooms };
    }
  },
  initial.app
);

const users = createReducer(
  {
    [addUser]: (state, payload) => {
      return { ...state, [payload.username]: true };
    },
    [removeUser]: (state, payload) => {
      const newState = { ...state };
      delete newState[payload.username];
      return newState;
    }
  },
  initial.users
);

const messages = createReducer(
  {
    [newMessage]: (state, payload) => {
      let { entities } = state;
      entities.push(payload.message);
      return { ...state, entities: entities };
    }
  },
  initial.messages
);

export default combineReducers({ app, users, messages });
