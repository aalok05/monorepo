import NodeProvider from "../../src/node-provider";
import { NodeMessageType } from "../../src/types";
import {
  createMockMessageChannel,
  mockAddEventListenerFunction,
  mockPostMessageFunction
} from "../utils/message-api-mocks";

const originalAddEventListener = window.addEventListener;
const originalPostMessage = window.postMessage;

const context = {
  originalAddEventListener,
  messageCallback: () => {},
  connected: false
};

describe("NodeProvider", () => {
  beforeAll(() => {
    window.addEventListener = jest.fn(mockAddEventListenerFunction(context));
    window.postMessage = jest.fn(mockPostMessageFunction(context));

    window.addEventListener("message", event => {
      if (event.data === "cf-node-provider:init") {
        const { port2 } = createMockMessageChannel();
        window.postMessage("cf-node-provider:port", "*", [port2]);
      }

      if (event.data === "cf-node-provider:ready") {
        context.connected = true;
      }
    });
  });
  beforeEach(() => {
    context.connected = false;
  });
  it("should instantiate", () => {
    new NodeProvider();
  });
  it("should connect", async () => {
    const nodeProvider = new NodeProvider();
    await nodeProvider.connect();

    expect(context.connected).toBe(true);
  });
  it("should emit a warning if you're connecting twice", async () => {
    console.warn = jest.fn();

    const nodeProvider = new NodeProvider();
    await nodeProvider.connect();
    await nodeProvider.connect();

    expect(console.warn).toBeCalledWith("NodeProvider is already connected.");
  });
  it("should fail to send a message if not connected", () => {
    const nodeProvider = new NodeProvider();

    expect(() => {
      nodeProvider.sendMessage({
        messageType: NodeMessageType.INSTALL,
        requestId: "0",
        data: null
      });
    }).toThrow(
      "It's not possible to use postMessage() before the NodeProvider is connected. Call the connect() method first."
    );
  });
  afterAll(() => {
    window.addEventListener = originalAddEventListener;
    window.postMessage = originalPostMessage;
  });
});
