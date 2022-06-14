
import type { WSServerConnectionMessage, WSServerMessage, WSServerMessageBoardSetBody, WSServerMessageSessionBody, WSServerMessageSessionInfoBody, WSServerMessageSessionRequestReceivedBody, WSServerMessageShotResultBody, WSServerUsernameSetBody } from "../types";
import Swal from 'sweetalert2'
import { sendMessage } from "./ws";
import { user, session, sessionState, username } from '$lib/stores'
import { get } from 'svelte/store'
import Toastie from "../helpers/toastie";

export const handleMessage = async (data: WSServerMessage) => {
  const userId = get(user)

  switch (data.type) {
    case 'error': {
      Toastie.fire({
        icon: 'error',
        title: data.body,
      })
      break
    }
    case 'connection': {
      const conData = data as WSServerConnectionMessage
      user.set(conData.you)
      username.set(conData.username)
      break
    }
    case 'sessionRequestReceived': {
      const reqData = data.body as WSServerMessageSessionRequestReceivedBody
      const result = await Swal.fire({
        title: 'Heya!',
        text: `${reqData.opponentName} challenged you for a match`,
        icon: 'info',
        confirmButtonText: 'Accept',
        denyButtonText: 'Run!',
        showDenyButton: true
      })
      if (result.isConfirmed && userId) {
        sendMessage({
          type: 'acceptRequest',
          body: {
            userId,
            opponentId: reqData.opponentId
          }
        })
      }
      break
    }
    case 'sessionCreated': {
      const { sessionId } = data.body as WSServerMessageSessionBody
      window.location.href = `/${sessionId}`
      session.set(sessionId)
      break
    }
    case 'boardSet': {
      const { session, playerNumberWhoseBoardIsSet, shouldWaitForOpponent } = data.body as WSServerMessageBoardSetBody
      sessionState.set(session)
      if (shouldWaitForOpponent) {
        Toastie.fire({
          icon: 'success',
          title: 'Board set!',
          html: playerNumberWhoseBoardIsSet === session.yourPlayerNumber 
            ? `<p>You may reposition your board while you wait for your opponent to set his board.</p>`
            : `<p>Your opponent just finished setting his board and is waiting for you.</p>`
        })
        return
      }
      Toastie.fire({
        icon: 'success',
        title: 'Let the bombing begin!'
      })
      break
    }
    case 'sessionRestored': {
      const { session } = data.body as WSServerMessageSessionInfoBody
      sessionState.set(session)
      if (window.location.pathname != `/${session.id}`) {
        window.location.href = `/${session.id}`
      }
      break
    }
    case 'gameStateUpdate': {
      const { session, hit, lastShotBy } = data.body as WSServerMessageShotResultBody
      sessionState.set(session)
      if (hit) {
        Toastie.fire({
          icon: 'success',
          title: session.yourPlayerNumber === lastShotBy ? 'Hit! 💥' : 'You got hit! 💥'
        })
      } else { 
        Toastie.fire({
          icon: 'error',
          title: session.yourPlayerNumber === lastShotBy ? 'You missed! 💔' : 'Your opponent missed! 😮‍💨'
        })
      }
      break
    }
    case 'userReconnected':
    case 'opponentReconnected': {
      const message = data.body as string
      Toastie.fire({
        icon: 'success',
        title: message
      })
      break
    }
    case 'usernameSet': {
      const body = data.body as WSServerUsernameSetBody
      username.set(body.username)
    }
  }
}