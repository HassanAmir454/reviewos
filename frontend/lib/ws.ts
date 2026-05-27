import { WS_BASE_URL, WS_RECONNECT_BASE_MS, WS_RECONNECT_MAX_MS, WS_MAX_RETRIES } from './constants'
import type { WSMessage } from '@/types/ws'

type MessageHandler = (msg: WSMessage) => void

class WSClient {
  private socket: WebSocket | null = null
  private clientId: string | null = null
  private handlers = new Set<MessageHandler>()
  private retryCount = 0
  private retryTimer: ReturnType<typeof setTimeout> | null = null
  private _isConnected = false

  get isConnected() {
    return this._isConnected
  }

  connect(clientId: string) {
    if (this.clientId === clientId && this._isConnected) return
    this.clientId = clientId
    this.retryCount = 0
    this._open()
  }

  disconnect() {
    if (this.retryTimer) clearTimeout(this.retryTimer)
    this.socket?.close(1000, 'Client disconnect')
    this.socket = null
    this._isConnected = false
  }

  addHandler(fn: MessageHandler): () => void {
    this.handlers.add(fn)
    return () => this.handlers.delete(fn)
  }

  private _open() {
    if (!this.clientId) return
    const url = `${WS_BASE_URL}/ws/${this.clientId}`

    try {
      this.socket = new WebSocket(url)
    } catch {
      this._scheduleRetry()
      return
    }

    this.socket.onopen = () => {
      this._isConnected = true
      this.retryCount = 0
    }

    this.socket.onmessage = (ev: MessageEvent) => {
      try {
        const msg = JSON.parse(ev.data as string) as WSMessage
        this.handlers.forEach(fn => fn(msg))
      } catch {
        // ignore malformed messages
      }
    }

    this.socket.onclose = (ev: CloseEvent) => {
      this._isConnected = false
      if (ev.code !== 1000) this._scheduleRetry()
    }

    this.socket.onerror = () => {
      this._isConnected = false
    }
  }

  private _scheduleRetry() {
    if (this.retryCount >= WS_MAX_RETRIES) return
    const delay = Math.min(
      WS_RECONNECT_BASE_MS * 2 ** this.retryCount,
      WS_RECONNECT_MAX_MS
    )
    this.retryTimer = setTimeout(() => {
      this.retryCount++
      this._open()
    }, delay)
  }
}

export const wsClient = new WSClient()
