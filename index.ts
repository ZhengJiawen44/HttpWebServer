import { Server } from "./HttpServer.ts";
import Response from "./response.ts";
import type { httpRequest } from "./types.ts"

const server = new Server(
  (req: httpRequest) => {
    let res = new Response("hello world", { status: 200, headers: { 'Content-Type': "text/html" } });
    //console.log("server recieved: ", req);
    //console.log("server responded with: ", res);
    return res;
  }, { timeout: 10000, requestQuota: 6 }
)

server.listen(3000, "localhost", () => { console.log("server started on port 3000") });



