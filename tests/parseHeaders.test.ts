import parseHeaders from "../src/core/parseHeaders";

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

test("correct parsing of Accept-Encoding with wildcard", () => {
  const rawHeader = "Accept-Encoding: deflate;q=0.5, *"
  const headerStore = parseHeaders([rawHeader]);
  const acceptEncoding = headerStore.get("Accept-Encoding");
  expect(acceptEncoding).toEqual(["*", "deflate"])
});

test("correct parsing of wildcard with weight 0", () => {
  const rawHeader = "Accept-Encoding: gzip, deflate, br; q=0.5, *; q=0";
  const headerStore = parseHeaders([rawHeader]);
  const acceptEncoding = headerStore.get("Accept-Encoding");
  expect(acceptEncoding).toEqual(["gzip", "deflate", "br"])
});

test("correct parsing of Accept-Language", () => {
  const rawHeader = "Accept-Language: en-US,en;q=0.5, jp;q=0.6";
  const headerStore = parseHeaders([rawHeader]);
  const acceptEncoding = headerStore.get("Accept-Language");
  expect(acceptEncoding).toEqual(["en-US", "jp", "en"])
});

test("correct parsing of Accept", () => {
  const rawHeader = "Accept-Language: text/html,application/xhtml+xml,application/xml;q=0.5,*/*;q=0.8";
  const headerStore = parseHeaders([rawHeader]);
  const acceptEncoding = headerStore.get("Accept-Language");
  expect(acceptEncoding).toEqual(["text/html", "application/xhtml+xml", "*/*", "application/xml"])
});

