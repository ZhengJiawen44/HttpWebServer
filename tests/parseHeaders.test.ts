import parseHeaders from "../src/core/parseHeaders";
import { parseEncodingTypes } from "../src/core/parseHeaders";

test("correct parsing of user agent header", () => {
  const rawHeader = "User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0";
  const headerStore = parseHeaders([rawHeader]);
  const userAgent = headerStore.get("User-Agent");
  expect(userAgent).toBe("Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0")
});

test("correct parsing of Accept Encoding", () => {
  const rawHeader = "Accept-Encoding: gzip, deflate, br, zstd"
  const headerStore = parseHeaders([rawHeader]);
  const acceptEncoding = headerStore.get("Accept-Encoding");
  expect(acceptEncoding).toEqual(["gzip", "deflate", "br", "zstd"])
});

