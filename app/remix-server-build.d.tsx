declare module "../build/server/index.js" {
  // Good enough for editor; Remix will provide the real thing at runtime
  // You can refine this to ServerBuild if you want stricter types.
  const build: any;
  export = build;
}
