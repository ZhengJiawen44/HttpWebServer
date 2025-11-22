import net from "net";
import incomingRequest from "./incomingRequest.js";
export class Server {
  constructor(reqListener) {
    //create the TCP server
    this.server = net.createServer((socket) => {
      socket.on("close", () => { console.log("server closed") });

      //parse incoming bytes to an http request message
      socket.on("data", (data) => {

        let req = incomingRequest(data);

        //obtain server response by executing http server callbacks
        const serverResponse = reqListener(req).serialize();
        //send server response over TCP socket
        socket.write(serverResponse);

      });

    });
  }

  listen(port = 4221, host = "localhost", serverOnStart) {
    //start listening to TCP connections
    this.server.listen(port, host, serverOnStart)
  }
}

export function createServer(cb) {
  return new Server(cb);
}


