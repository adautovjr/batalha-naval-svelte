import { getWSHost } from "../helpers/ws-builder";
import { handleMessage } from "./message";

import type { WSClientMessage } from '../types'
import { clients } from "$lib/stores"

const ws = new WebSocket(getWSHost())

ws.onmessage = (event: any) => {
  const data = JSON.parse(event.data)
  handleMessage(data)
  if (data.clients){
    clients.set(data.clients)
  }
};

export const sendMessage = (message: WSClientMessage) => {
  ws.send(
    JSON.stringify(message)
  );
};
