import { s as streamText, M as MAX_RESPONSE_SEGMENTS, a as MAX_TOKENS, C as CONTINUE_PROMPT } from './server-build-D5H6ZeJU.js';
import 'react/jsx-runtime';
import '@remix-run/react';
import 'isbot';
import 'react-dom/server';
import 'remix-island';
import 'nanostores';
import '@remix-run/cloudflare';
import 'ai';
import 'node:process';
import '@ai-sdk/anthropic';
import 'rehype-sanitize';
import 'remix-utils/client-only';
import 'react';
import '@nanostores/react';

class SwitchableStream extends TransformStream {
  _controller = null;
  _currentReader = null;
  _switches = 0;
  constructor() {
    let controllerRef;
    super({
      start(controller) {
        controllerRef = controller;
      }
    });
    if (controllerRef === void 0) {
      throw new Error("Controller not properly initialized");
    }
    this._controller = controllerRef;
  }
  async switchSource(newStream) {
    if (this._currentReader) {
      await this._currentReader.cancel();
    }
    this._currentReader = newStream.getReader();
    this._pumpStream();
    this._switches++;
  }
  async _pumpStream() {
    if (!this._currentReader || !this._controller) {
      throw new Error("Stream is not properly initialized");
    }
    try {
      while (true) {
        const { done, value } = await this._currentReader.read();
        if (done) {
          break;
        }
        this._controller.enqueue(value);
      }
    } catch (error) {
      console.log(error);
      this._controller.error(error);
    }
  }
  close() {
    if (this._currentReader) {
      this._currentReader.cancel();
    }
    this._controller?.terminate();
  }
  get switches() {
    return this._switches;
  }
}

async function runChat(messages, env) {
  const history = messages.slice();
  const stream = new SwitchableStream();
  const options = {
    toolChoice: "none",
    onFinish: async ({
      text: content,
      finishReason
    }) => {
      if (finishReason !== "length") {
        stream.close();
        return;
      }
      if (stream.switches >= MAX_RESPONSE_SEGMENTS) {
        throw new Error("Cannot continue message: Maximum segments reached");
      }
      const switchesLeft = MAX_RESPONSE_SEGMENTS - stream.switches;
      console.log(
        `Reached max token limit (${MAX_TOKENS}): Continuing message (${switchesLeft} switches left)`
      );
      history.push({ role: "assistant", content });
      history.push({ role: "user", content: CONTINUE_PROMPT });
      const next = await streamText(history, env, options);
      stream.switchSource(next.toAIStream());
    }
  };
  const result = await streamText(history, env, options);
  stream.switchSource(result.toAIStream());
  return stream.readable;
}

export { runChat };
