import { createServer } from "./HttpServer.js";
import Response from "./response.js";

const server = createServer(
  (req) => {
    let res = new Response("hello world", { status: 200, headers: { 'Content-Type': "text/html" } });
    //console.log("server recieved: ", req);
    //console.log("server responded with: ", res);
    return res;
  }
)

server.listen(3000, "localhost", () => { console.log("server started on port 3000") });



