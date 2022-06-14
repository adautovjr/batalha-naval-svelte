export const UUID_KEY = '@NAVALBATTLE:uuid';
export const USERNAME_KEY = '@NAVALBATTLE:username';
export const SESSION_KEY = '@NAVALBATTLE:session';
export const SESSION_STATE_KEY = '@NAVALBATTLE:sessionState';

export type LocalStorageKey =
  | typeof UUID_KEY
  | typeof USERNAME_KEY
  | typeof SESSION_STATE_KEY
  | typeof SESSION_KEY