import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Button from "@material-ui/core/Button/Button";
import { Welcome, Room } from "./views";
import { logout } from "./actions";

class App extends Component {
  render() {
    const { username, room } = this.props;
    let body;
    if (username) {
      body = <Room />;
    } else {
      body = <Welcome />;
    }

    return <div>{body}</div>;
  }
}

function select({ app }) {
  return { ...app };
}

export default connect(select)(App);
