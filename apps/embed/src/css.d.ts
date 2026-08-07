// esbuild's `.css` -> `text` loader (build.mjs, calendar-layout entry point
// only) yields the stylesheet's raw text as the default export.
declare module "*.css" {
  const content: string;
  export default content;
}
