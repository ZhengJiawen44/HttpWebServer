import Server from "../src/core/HttpServer.ts";
import * as net from "net";

test("server is listening on designated port", (done) => {
  const httpServer = new Server(() => { });

  httpServer.listen(45678, "localhost", () => {
    expect(httpServer.TCPServer).toBeInstanceOf(net.Server);
    httpServer.close();
    done();
  });
});

test("server has correct <maxQuota> attrbutes", () => {
  const httpServer = new Server(() => { }, { requestQuota: 2 });
  expect(httpServer.requestQuota).toBe(2);
})

test("server has correct <timeout> attrbutes", () => {
  const httpServer = new Server(() => { }, { timeout: 10 });
  expect(httpServer.timeout).toBe(10);
})




