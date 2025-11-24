import HttpServer from "./src/core//HttpServer.ts";
import Response from "./src/core//response.ts";
import type { httpRequest } from "./src/core/types.ts"
import fs from "fs/promises"

const server = new HttpServer(
  async (req: httpRequest) => {

    if (req.url == "/") {
      try {
        const body = await fs.readFile("./public/index.html", { encoding: "utf8" });
        return new Response(body, { status: 200, headers: { "Content-Type": "text/html" } });
      } catch (error) {
        return new Response(error.message, { status: 500, headers: { "Content-Type": "text/html" } });
      }
    }
    else if (req.url == "/logo") {
      try {
        const img = await fs.readFile("./public/logo.png");
        return new Response(img, { status: 200, headers: { "Content-Type": "image/png" } })
      } catch (error) {
        return new Response(error.message, { status: 500, headers: { "Content-Type": "text/html" } })
      }
    }
    else if (req.url.startsWith("/files") && req.method == "POST") {
      console.log(req.body);
      return new Response("data recieved", { status: 404 });
    }
    else {
      return new Response("page not found", { status: 404 });
    }


  }, { timeout: 10000, requestQuota: 6 }
)

server.listen(3000, "localhost", () => { console.log("server started on port 3000") });



