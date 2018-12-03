import React, { Component, PropTypes } from "react";
import { connect } from "react-redux";
import { sendMessage } from "../actions";
import TextField from "@material-ui/core/TextField/TextField";
import Button from "@material-ui/core/Button/Button";
import AppBar from "@material-ui/core/AppBar/AppBar";
import { Toolbar, Typography } from "@material-ui/core";
import { logout } from "../actions";

const style = {
  backgroundColor: "#eaeaea",
  padding: 15,
  height: "420px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column"
};

const styles = {
  position: "absolute",
  bottom: 0,
  width: "100%",
  display: "flex"
};

const fieldStyle = {
  flexGrow: 1
};

const btnStyles = {
  marginLeft: 25,
  marginBottom: 10,
  marginRight: 25
};

class Room extends Component {
  handleSend() {
    const text = document.getElementById("room-message").value;
    this.props.dispatch(sendMessage({ text }));
    document.getElementById("room-message").value = "";
  }

  handleKeyPress() {
    if (event.key === "Enter") {
      this.handleSend();
    }
  }

  handleLogout() {
    this.props.dispatch(logout());
  }

  renderMessages(item, i) {
    const style = {
      display: "block",
      margin: "5px 0"
    };

    const isMe = app.username === item.username;
    const floatDirection = isMe ? "right" : "left";
    const nameColor = isMe ? "green" : "red";
    const margin = isMe ? " 0 0 0 40px" : "0 40px 0 0 ";

    const textStyle = {
      float: floatDirection,
      backgroundColor: "#fff",
      padding: "6px 10px",
      borderRadius: "15px",
      margin: margin,
      textAlign: "left"
    };

    const nameStyle = {
      color: nameColor,
      float: floatDirection
    };

    return (
      <div key={i} style={style}>
        <span style={textStyle}>
          <span style={nameStyle}>{item.username}</span>
          <br />
          {item.text}
        </span>
      </div>
    );
  }

  render() {
    const { app, messages, room } = this.props;

    const msgs = messages.entities.map((item, i) =>
      this.renderMessages(item, i)
    );

    return (
      <div style={{ flexGrow: 1 }}>
        <AppBar position="static" style={{ flexGrow: 1 }}>
          <Toolbar>
            <Typography variant="h6" color="inherit" style={{ flexGrow: 1 }}>
              HDDS Chat: {app.rooms[room]}
            </Typography>

            <Button color="inherit" onClick={this.handleLogout.bind(this)}>
              Logout
            </Button>
          </Toolbar>
        </AppBar>
        <div style={style}>{msgs}</div>
        <div style={styles}>
          <div style={fieldStyle}>
            <TextField
              id="room-message"
              fullWidth={true}
              placeholder="Write your message here..."
              onKeyPress={this.handleKeyPress.bind(this)}
            />
          </div>
          <div style={btnStyles}>
            <Button variant="contained" onClick={this.handleSend.bind(this)}>
              Send
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

function select({ app, users, messages }) {
  return { app, users, messages };
}

export default connect(select)(Room);
