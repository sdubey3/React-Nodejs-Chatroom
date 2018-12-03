import React, { Component } from "react";

import PropTypes from "prop-types";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import Typography from "@material-ui/core/Typography/Typography";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import Button from "@material-ui/core/Button/Button";
import TextField from "@material-ui/core/TextField/TextField";
import Radio from "@material-ui/core/Radio/Radio";
import RadioGroup from "@material-ui/core/RadioGroup/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import FormControl from "@material-ui/core/FormControl/FormControl";
import FormLabel from "@material-ui/core/FormLabel/FormLabel";

import { connect } from "react-redux";

import { login, newRoom } from "../actions";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },
  formControl: {
    margin: theme.spacing.unit * 3
  },
  group: {
    margin: `${theme.spacing.unit}px 0`
  }
});

class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 0,
      formValue: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.createRoom = this.createRoom.bind(this);
    this.selectRoom = this.selectRoom.bind(this);
  }

  createRoom() {
    const room = document.getElementById("chatroomCreateName").value;
    const username = document.getElementById("create-username").value;
    const { app } = this.props;
    let error = false;

    if (username.length === 0) {
      alert("Username cannot be blank. Please enter a username.");
      return;
    }

    if (room.length === 0) {
      alert("Chatroom name cannot be blank. Please provide a chatroom name.");
      return;
    }

    if (app.rooms.length === null) {
      return;
    }

    app.rooms.forEach(function(element) {
      if (room === element.name) error = true;
    });
    if (error) {
      alert("Chatroom name already taken. Please enter a unique name.");
    } else {
      this.props.dispatch(newRoom({ room }));
      this.props.dispatch(login({ username, room }));
    }
  }

  selectRoom(room) {
    const username = document.getElementById("join-username").value;
    const { app, users } = this.props;
    let error = false;

    if (username.length === 0) {
      alert("Username cannot be blank. Please enter a username.");
      return;
    }
    // users.getUsers.forEach(function(element) {
    //   if (username === element.username) error = true;
    // });
    if (error) {
      alert("Username already taken. Please enter a unique name.");
      return;
    } else {
      this.props.dispatch(login({ username, room }));
    }
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleFormChange = event => {
    this.setState({ formValue: event.target.value });
  };

  render() {
    const { app, users } = this.props;
    const { value, formValue } = this.state;

    return (
      <Dialog aria-labelledby="form-dialog-title" open={true}>
        <DialogTitle id="form-dialog-title">Welcome to HDDS Chat!</DialogTitle>
        <Tabs value={value} onChange={this.handleChange}>
          <Tab label="Join a Chatroom" />
          <Tab label="Create a Chatroom" />
        </Tabs>
        {value === 0 && (
          <TabContainer>
            <DialogContent>
              <DialogContentText>
                Your username is how other participants in your chatroom will
                identify you.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="join-username"
                label="Username"
                type="text"
                fullWidth
              />
              <br />
              <br />
              <br />
              <FormControl component="fieldset">
                <FormLabel component="legend">Rooms</FormLabel>
                <RadioGroup
                  aria-label="Room"
                  name="chatroom"
                  value={formValue}
                  onChange={this.handleFormChange}
                >
                  {app.rooms.map((item, index) => (
                    <FormControlLabel
                      key={index}
                      id={item.name}
                      value={item.name}
                      control={<Radio />}
                      label={item.name}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.selectRoom.bind(this, formValue)}
              >
                Join
              </Button>
            </DialogActions>
          </TabContainer>
        )}
        {value === 1 && (
          <TabContainer>
            <DialogContent>
              <DialogContentText>
                Create a chatroom that others can join using the chatroom name!
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="create-username"
                label="Username"
                type="text"
                fullWidth
              />
              <TextField
                autoFocus
                margin="dense"
                id="chatroomCreateName"
                label="Chatroom Name"
                type="text"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                variant="contained"
                color="primary"
                onClick={this.createRoom.bind(this)}
              >
                Create
              </Button>
            </DialogActions>
          </TabContainer>
        )}
      </Dialog>
    );
  }
}

function select({ app, users, messages, thisUser }) {
  return { app, users, messages, thisUser };
}

export default connect(select)(Welcome);
