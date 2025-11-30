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


test("correct parsing of weighted Accept Encoding", () => {
  const rawHeader = "Accept-Encoding: gzip;q=0.8, deflate, br;q=0.5, zstd;q=0.9"
  const headerStore = parseHeaders([rawHeader]);
  const acceptEncoding = headerStore.get("Accept-Encoding");
  expect(acceptEncoding).toEqual(["deflate", "zstd", "gzip", "br"])
});

test("correct parsing of weighted Accept Encoding with extra spaces", () => {
  const rawHeader = "Accept-Encoding: gzip; q=0.8, deflate, br; q=0.5, zstd;q=0.9"
  const headerStore = parseHeaders([rawHeader]);
  const acceptEncoding = headerStore.get("Accept-Encoding");
  expect(acceptEncoding).toEqual(["deflate", "zstd", "gzip", "br"])
});

test("correct parsing of partially weighted Accept Encoding with inconsistent capitalization", () => {
  const rawHeader = "Accept-Encoding: GZIP, deflate, br; q=0.5, zstd"
  const headerStore = parseHeaders([rawHeader]);
  const acceptEncoding = headerStore.get("Accept-Encoding");
  expect(acceptEncoding).toEqual(["gzip", "deflate", "zstd", "br"])
});

