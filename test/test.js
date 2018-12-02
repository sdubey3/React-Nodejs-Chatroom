var should = require("should");
var io = require("socket.io-client"),
  server = require("../src/server/index");

var socketURL = "http://localhost:3000";

var options = {
  transports: ["websocket"],
  "force new connection": true
};

var chatUser1 = { username: "Tom", room: "channel" };
var chatUser2 = { username: "Sally", room: "channel" };

describe("Chat Server", function() {
  it("Should be able to broadcast messages", function(done) {
    var client1, client2;
    var message = "Hello World";
    var messages = 0;

    var checkMessage = function(client) {
      client.on("message", function(msg) {
        message.should.equal(msg);
        client.disconnect();
        messages++;
        if (messages === 3) {
          done();
        }
      });
    };

    client1 = io.connect(
      socketURL,
      options
    );
    client1.on("connect", function(data1) {
      client2 = io.connect(
        socketURL,
        options
      );
      client1.emit("login", chatUser1);
      client2.on("connect", function(data2) {
        client2.emit("login", chatUser2);
        client2.emit("message", { text: message });
      });
    });
    client1.on("messages.new", function(data) {
      console.log(data);
      done();
    });
  });
});
