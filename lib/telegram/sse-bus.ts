import { EventEmitter } from "events";

const globalForBus = globalThis as unknown as {
  telegramBus?: EventEmitter;
};

if (!globalForBus.telegramBus) {
  globalForBus.telegramBus = new EventEmitter();
  globalForBus.telegramBus.setMaxListeners(1000); // prevent memory leak warning
}

export const telegramBus = globalForBus.telegramBus;
