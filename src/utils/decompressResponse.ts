import { Writable, Readable } from "stream";
import { createGunzip, createInflate, createBrotliDecompress, createZstdDecompress } from "zlib";
import { pipeline } from "stream/promises";

export async function decompressResponse(compressedData: Buffer, encoding: string): Promise<Buffer> {
  const buffers: Buffer[] = [];
  const readableStream = Readable.from(compressedData);
  const writeableStream = new Writable({
    write(chunk, encoding, callback) {
      buffers.push(chunk);
      callback();
    }
  });

  switch (encoding) {
    case "deflate":
      await pipeline(readableStream, createInflate(), writeableStream);
      break;
    case "gzip":
      await pipeline(readableStream, createGunzip(), writeableStream);
      break;
    case "br":
      await pipeline(readableStream, createBrotliDecompress(), writeableStream);
      break;
    case "zstd":
      await pipeline(readableStream, createZstdDecompress(), writeableStream);
      break;
    default:
      throw new Error(`Unsupported encoding: ${encoding}`);
  }

  return Buffer.concat(buffers);
}
