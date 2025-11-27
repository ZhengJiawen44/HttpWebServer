import compressResponse from "../src/utils/compressResponse";
import { gunzip, gunzipSync, brotliDecompressSync, inflateSync, zstdDecompressSync } from "zlib";

test("compressioon returns buffer object", async () => {
  const [buffer, encoding] = await compressResponse("hello world", ["gzip"]);
  expect(Buffer.isBuffer(buffer)).toBe(true);
  expect(encoding).toBe("gzip")
})
test("compression works with Node.js built-in gzip", async () => {
  const original = "hello world";
  const [compressed, encoding] = await compressResponse(original, ["gzip"]);
  const decompressed = gunzipSync(compressed);
  const result = decompressed.toString('utf-8');
  expect(result).toBe(original);
  expect(encoding).toBe("gzip");
});
test("compression works with Node.js built-in br", async () => {
  const original = "hello world";
  const [compressed, encoding] = await compressResponse(original, ["br"]);
  const decompressed = brotliDecompressSync(compressed);
  const result = decompressed.toString('utf-8');
  expect(result).toBe(original);
  expect(encoding).toBe("br");
});
test("compression works with Node.js built-in deflate", async () => {
  const original = "hello world";
  const [compressed, encoding] = await compressResponse(original, ["deflate"]);
  const decompressed = inflateSync(compressed);
  const result = decompressed.toString('utf-8');
  expect(result).toBe(original);
  expect(encoding).toBe("deflate");
});
test("compression works with Node.js built-in zstd", async () => {
  const original = "hello world";
  const [compressed, encoding] = await compressResponse(original, ["zstd"]);
  const decompressed = zstdDecompressSync(compressed);
  const result = decompressed.toString('utf-8');
  expect(result).toBe(original);
  expect(encoding).toBe("zstd");
});
test("compression handles large data correctly", async () => {
  const original = "a".repeat(10_000_000);
  const [compressed] = await compressResponse(original, ["gzip"]);
  const decompressed = await new Promise((resolve, reject) => {
    gunzip(compressed, (err, buffer) => {
      if (err) reject(err);
      else resolve(buffer);
    });
  });
  expect(decompressed.toString()).toBe(original);
});
test("compressResponse returns null encoding for unknown encodings array", async () => {
  const data = Buffer.from("test");
  const [_, encoding] = await compressResponse(data, ["unknown"]);
  expect(encoding).toBe(null);
});
test("compressResponse returns null encoding for null encodings array", async () => {
  const data = Buffer.from("test");
  const [_, encoding] = await compressResponse(data, null);
  expect(encoding).toBe(null);
});
test("compressResponse returns null encoding for empty encodings array", async () => {
  const data = Buffer.from("test");
  const [_, encoding] = await compressResponse(data, []);
  expect(encoding).toBe(null);
});




