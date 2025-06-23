// lib/swarm.ts
export interface Peer {
  ip: string;
  port: number;
  model: string;
}

export const mockPeers: Peer[] = [
  { ip: '192.168.49.2', port: 8080, model: 'qwen3' },
  { ip: '192.168.49.3', port: 8080, model: 'osmosis' },
];

export async function discoverPeers(): Promise<Peer[]> {
  return mockPeers;
}
