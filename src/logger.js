import pino from "pino";

const logger = pino({
  browser: {
    serialize: true,
    asObject: true,
    // transmit: {
    //   send,
    // },
  },
});
export default logger;
