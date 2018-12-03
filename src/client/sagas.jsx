import io from "socket.io-client";
import { eventChannel } from "redux-saga";
import { fork, take, call, put, cancel } from "redux-saga/effects";
import {
  login,
  logout,
  addUser,
  removeUser,
  newMessage,
  sendMessage,
  newRoom,
  getRoom
} from "./actions";

function connect() {
  const socket = io("http://ec2-18-223-44-43.us-east-2.compute.amazonaws.com/");
  return new Promise(resolve => {
    socket.on("connect", () => {
      resolve(socket);
    });
  });
}

function subscribe(socket) {
  return eventChannel(emit => {
    socket.on("rooms.list", ({ rooms }) => {
      emit(getRoom({ rooms }));
    });
    socket.on("users.login", ({ username, room }) => {
      emit(addUser({ username, room }));
    });
    socket.on("users.logout", ({ username }) => {
      emit(removeUser({ username }));
    });
    socket.on("messages.new", ({ message }) => {
      emit(newMessage({ message }));
    });

    socket.on("disconnect", e => {
      // TODO: handle
    });
    return () => {};
  });
}

function* read(socket) {
  const channel = yield call(subscribe, socket);
  while (true) {
    let action = yield take(channel);
    yield put(action);
  }
}

function* write(socket) {
  while (true) {
    const { payload } = yield take(`${sendMessage}`);
    socket.emit("message", payload);
  }
}

function* handleIO(socket) {
  yield fork(read, socket);
  yield fork(write, socket);
}

function* flow() {
  while (true) {
    const socket = yield call(connect);
    const task = yield fork(handleIO, socket);
    socket.emit("rooms");
    let { payload } = yield take(`${login}`);
    socket.emit("login", { username: payload.username, room: payload.room });
    socket.emit("rooms");
    let action = yield take(`${logout}`);
    yield cancel(task);
    socket.emit("logout", { username: payload.username });
  }
}

export default function* rootSaga() {
  yield fork(flow);
}
