// lib/tcp-client.ts
import TcpSocket from 'react-native-tcp-socket';
import { deflate, inflate } from 'node:zlib'; // Use built-in Node.js zlib
import { promisify } from 'util';

const deflateAsync = promisify(deflate);
const inflateAsync = promisify(inflate);

export interface Request {
  model: string;
  prompt: string;
  lora?: string;
}

export interface Response {
  output?: string;
  error?: string;
}

export class TcpClient {
  private socket: any;

  async connect(host: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket = TcpSocket.createConnection({ host, port }, () => resolve());
      this.socket.on('error', (err: Error) => reject(err));
    });
  }

  async send(request: Request): Promise<Response> {
    return new Promise(async (resolve, reject) => {
      try {
        const compressed = await deflateAsync(Buffer.from(JSON.stringify(request)));
        this.socket.write(compressed);
        this.socket.once('data', async (data: Buffer) => {
          try {
            const decompressed = await inflateAsync(data);
            resolve(JSON.parse(decompressed.toString()));
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect(): void {
    this.socket.end();
  }
}

export async function sendPrompt(model: string, prompt: string, lora?: string): Promise<string> {
  const request: Request = { model, prompt, lora };
  const compressed = await deflateAsync(Buffer.from(JSON.stringify(request)));
  console.log(`Original size: ${JSON.stringify(request).length}, Compressed size: ${compressed.length}`);
  const decompressed = await inflateAsync(compressed);
  return JSON.parse(decompressed.toString()).prompt; // Mock response
}
