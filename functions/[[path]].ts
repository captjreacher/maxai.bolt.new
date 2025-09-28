// functions/[[path]].ts
import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "./_server/index.js"; // this is the copied Remix server build

export const onRequest = createPagesFunctionHandler({ build });









