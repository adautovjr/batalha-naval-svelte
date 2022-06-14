import { session } from "$lib/stores";

/** @type {import('./__types/[sessionID]').RequestHandler} */
export async function get({ params }: any) {
  const { sessionID } = params;
  session.set(sessionID)
  return {
    body: { sessionID }
  };
}