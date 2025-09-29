import { MAX_RESPONSE_SEGMENTS, MAX_TOKENS } from "~/lib/.server/llm/constants";
import { CONTINUE_PROMPT } from "~/lib/.server/llm/prompts";
import { streamText, type Messages, type StreamingOptions } from "~/lib/.server/llm/stream-text";
import SwitchableStream from "~/lib/.server/llm/switchable-stream";

type Env = Record<string, unknown> & {
  ANTHROPIC_API_KEY: string;
};

export async function runChat(
  messages: Messages,
  env: Env
): Promise<ReadableStream<Uint8Array>> {
  const history: Messages = messages.slice();
  const stream = new SwitchableStream();

  const options: StreamingOptions = {
    toolChoice: "none",
    onFinish: async ({ text: content, finishReason }: { text: string; finishReason?: string }) => {
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
    },
  };

  const result = await streamText(history, env, options);
  stream.switchSource(result.toAIStream());
  return stream.readable;
}
