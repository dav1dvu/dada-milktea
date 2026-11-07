/**
 * JoyUp SDK Interface Stub (Decoupled & Offline)
 * Replaces remote proprietary SDK with local offline stubs.
 */
export const jp = {
  get user() { return null; },
  get member() { return false; },
  get canLogin() { return false; },
  get anon() { return false; },
  get db() { return null; },
  get mock() { return false; },
  get hasSdk() { return false; },
  get wantSdk() { return false; },
  async init() { return null; },
  async login() { return 'unavailable'; },
  saveLoad: async () => null,
  saveSet: async () => false
};
