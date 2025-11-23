import net from "net";
import incomingRequest from "./incomingRequest.ts";
import debounce from "./debounce.ts";
export class Server {
  server: net.Server;
  timeout: number;
  requestQuota: number;
  constructor(reqListener: Function, options?: { timeout?: number, requestQuota?: number }) {
    this.timeout = options?.timeout || 5000;
    this.requestQuota = options?.requestQuota || 5;
    //create the TCP server
    this.server = net.createServer((socket) => {
      console.log("new TCP conn established");

      let requestQuota = this.requestQuota;
      const closeConnection = debounce(() => { socket.end() }, this.timeout);

      socket.on("close", () => { console.log("TCP conn closed, change timeout or requestQuota to configure it") });

      //parse incoming bytes to an http request message
      socket.on("data", (data) => {
        requestQuota--;

        let req = incomingRequest(data);
        //obtain server response by executing http server callbacks
        const res = reqListener(req);
        res.headers.set("Keep-Alive", `timeout=${this.timeout}, max=${requestQuota}`)
        //send server response over TCP socket
        socket.write(res.serialize());

        //close connection when max request for current TCP connection is exceeded
        if (requestQuota <= 0) socket.end();
        //close connection after 5 seconds of idle time
        closeConnection();
      });

    });
  }

  listen(port = 4221, host = "localhost", serverOnStart?: () => void) {
    //start listening to TCP connections
    this.server.listen(port, host, serverOnStart)
  }
}

export function createServer(cb: Function) {
  return new Server(cb);
}


