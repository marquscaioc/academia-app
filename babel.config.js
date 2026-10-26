module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxImportSource: "nativewind",
          // zustand/middleware (persist) ships `import.meta.env` in its ESM build; the
          // web bundle is not an ES module, so without this the app renders blank.
          unstable_transformImportMeta: true,
        },
      ],
      "nativewind/babel",
    ],
  };
};
