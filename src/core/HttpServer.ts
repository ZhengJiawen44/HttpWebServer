import net from "net";
import incomingRequest from "./incomingRequest.ts";
import debounce from "../utils/debounce.ts";
import compressResponse from "../utils/compressResponse.ts";

export default class HttpServer {
  TCPServer: net.Server;
  timeout: number;
  requestQuota: number;
  schemes: string[];
  constructor(reqListener: Function, options?: { timeout?: number, requestQuota?: number }) {
    this.timeout = options?.timeout || 5000;
    this.requestQuota = options?.requestQuota || 5;
    //create the TCP server
    this.TCPServer = net.createServer((socket) => {
      console.log("new TCP conn established");

      let requestQuota = this.requestQuota;
      const startDebouncedCloseTCP = debounce(() => { socket.end() }, this.timeout);

      socket.on("close", () => { console.log("TCP conn closed, change timeout or requestQuota to configure it") });

      //parse incoming bytes to an http request message
      socket.on("data", async (data) => {
        requestQuota--;

        let req = incomingRequest(data);

        //obtain server response by executing http server callbacks
        const res = await reqListener(req);
        const encodings = req.headers.get("Accept-Encoding") as string[] | undefined;
        if (encodings) {
          const [compressedResponse, chosenEncoding] = await compressResponse(res.body, encodings);
          if (chosenEncoding) {
            res.body = compressedResponse;
            res.headers.set("Content-Encoding", chosenEncoding);
          }
        }
        res.headers.set("Content-Length", Buffer.byteLength((res.body)));
        res.headers.set("Keep-Alive", `timeout=${this.timeout}, max=${requestQuota}`);
        socket.write(res.serialize());

        //close connection when max request for current TCP connection is exceeded
        if (requestQuota <= 0) socket.end();
        //close connection after 5 seconds of idle time
        startDebouncedCloseTCP();
      });
      socket.on("error", (error) => {
        console.error(error);
      })

    });
  }

  listen(port = 4221, host = "localhost", serverOnStart?: () => void) {
    //start listening to TCP connections
    this.TCPServer.listen(port, host, serverOnStart)
  }
  close() {
    this.TCPServer.close();
  }
}

