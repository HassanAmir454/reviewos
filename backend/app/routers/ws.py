import json
from typing import Any

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

router = APIRouter(prefix="/ws", tags=["websockets"])


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, WebSocket] = {}

    async def connect(self, client_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self.active_connections[client_id] = websocket

    def disconnect(self, client_id: str) -> None:
        self.active_connections.pop(client_id, None)

    async def send_to_client(self, client_id: str, message: dict[str, Any]) -> None:
        ws = self.active_connections.get(client_id)
        if ws:
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                self.disconnect(client_id)

    async def broadcast(self, message: dict[str, Any]) -> None:
        """Send a message to all connected clients."""
        dead: list[str] = []
        for client_id, ws in self.active_connections.items():
            try:
                await ws.send_text(json.dumps(message))
            except Exception:
                dead.append(client_id)
        for cid in dead:
            self.disconnect(cid)


manager = ConnectionManager()


@router.websocket("/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str) -> None:
    await manager.connect(client_id, websocket)
    try:
        while True:
            # Keep connection alive; client messages are ignored for now
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(client_id)
