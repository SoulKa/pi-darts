import { io, type Socket } from 'socket.io-client'
import type { ClientToServerEvents, ServerToClientEvents } from '@pipod/shared'

/** Typed socket to the server (same origin; dev proxy forwards /socket.io). */
export type ConsoleSocket = Socket<ServerToClientEvents, ClientToServerEvents>

export function createSocket(): ConsoleSocket {
  return io({ autoConnect: true })
}
