// esbuild bundles the CSS these side-effect imports name (see build.mjs);
// TypeScript 6 stopped accepting such an import without a declaration for it
// (TS2882), so declare the shape: a stylesheet import contributes no values.
declare module "*.css";
