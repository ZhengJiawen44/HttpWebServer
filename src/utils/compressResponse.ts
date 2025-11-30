import { Writable, Readable } from "stream";
import { createGzip, createDeflate, createBrotliCompress, createZstdCompress } from "zlib";
import { pipeline } from "stream/promises";

export default async function compressResponse(response: string | Buffer, compressionEncodings: string[]): Promise<[Buffer, string]> {

  if (compressionEncodings == null) return [null, null];

  let chosenEncoding = null;
  let buffers = [];
  const readableStream = Readable.from(response);
  const writeableStream = new Writable({
    write(chunk, encoding, callback) {
      buffers.push(chunk);
      callback();
    }
  });

  for (let encoding of compressionEncodings) {
    switch (encoding) {
      case "deflate":
        chosenEncoding = "deflate"
        await pipeline(readableStream, createDeflate(), writeableStream);
        break;
      case "gzip":
        chosenEncoding = "gzip";
        await pipeline(readableStream, createGzip(), writeableStream);
        break;
      case "br":
        chosenEncoding = "br";
        await pipeline(readableStream, createBrotliCompress(), writeableStream);
        break;
      case "zstd":
        chosenEncoding = "zstd";
        await pipeline(readableStream, createZstdCompress(), writeableStream);
        break;
      case "*":
        chosenEncoding = "gzip";
        await pipeline(readableStream, createGzip(), writeableStream);
        break;
    }
    if (chosenEncoding) break;
  }
  return [Buffer.concat(buffers), chosenEncoding];
}

