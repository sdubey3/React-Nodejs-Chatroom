const serve = require("koa-static-server");
const koa = require("koa");
const app = new koa();
const http = require("http");

app.use(serve({ rootDir: "../../dist" }));

app.use(async next => {
  if (this.path !== "/") {
    return await next();
  }
});

const server = http.createServer(app.callback());

const io = require("socket.io")(server);
let activeroom = null;
let usernames = [];
io.on("connection", function(socket) {
  socket.on("login", function({ username, room }) {
    console.log(`[server] login: ${username + " -> " + room}`);
    usernames.push(username);
    socket.join(room);
    activeroom = room;
    socket.username = username;
    socket.emit("users.login", { username, room });
  });

  socket.on("message", function({ text }) {
    console.log(`[server] message: ${text}`);
    const message = {
      text,
      username: socket.username,
      room: activeroom
    };
    io.to(activeroom).emit("messages.new", { message });
  });

  socket.on("logout", function({ username }) {
    if (username) {
      console.log(`[server] logout: ${username}`);
      usernames = usernames.filter(u => u !== username);
      io.to(activeroom).emit("users.logout", { username });
      socket.leave(activeroom);
    }
  });
  function findRooms() {
    let availableRooms = [];
    const rooms = io.sockets.adapter.rooms;
    if (rooms) {
      for (const room in rooms) {
        if (!rooms[room].hasOwnProperty(room)) {
          if (room.slice(0, 2) == "/#") continue;
          availableRooms.push({
            name: room,
            counts: io.sockets.adapter.rooms[room].length
          });
        }
      }
    }
    return availableRooms;
  }
  socket.on("rooms", function() {
    const rooms = findRooms();
    io.emit("rooms.list", { rooms: rooms });
  });
});

const port = process.env.PORT || 3000;
server.listen(port);
