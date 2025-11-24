import Server from "./HttpServer.ts";
import Response from "./response.ts";
import type { httpRequest } from "./types.ts"
import fs from "fs/promises"

const server = new Server(
  async (req: httpRequest) => {

    if (req.url == "/") {
      try {
        const body = await fs.readFile("./index.html", { encoding: "utf8" });
        return new Response(body, { status: 200, headers: { "Content-Type": "text/html" } });
      } catch (error) {
        return new Response(error.message, { status: 500, headers: { "Content-Type": "text/html" } });
      }
    }
    else if (req.url == "/logo") {
      try {
        const img = await fs.readFile("./logo.png");
        return new Response(img, { status: 200, headers: { "Content-Type": "image/png" } })
      } catch (error) {
        return new Response(error.message, { status: 500, headers: { "Content-Type": "text/html" } })
      }
    }
    else {
      return new Response("page not found", { status: 404 });
    }


  }, { timeout: 10000, requestQuota: 6 }
)

server.listen(3000, "localhost", () => { console.log("server started on port 3000") });



