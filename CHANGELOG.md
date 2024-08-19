# @kucrut/vite-for-wp

## 0.9.3

### Patch Changes

-   3b9edd7: Exclude unnecessary files from git archive
-   c40e329: Respect build.sourcemap option, props @ernilambar

## 0.9.2

### Patch Changes

-   0564e76: Fix wp_scripts plugin, props @Bernix01

## 0.9.1

### Patch Changes

-   86a8495: Fix peer dependencies

## 0.9.0

### Minor Changes

-   d33de07: Support enqueuing split CSS chunks with multiple outputs. Props @netlas
-   c4bc83a: Vite 5

### Patch Changes

-   6eb0bb8: ESLint 9
-   b7b96a3: Fix script type modifier. Props @irshadahmad21

## 0.8.0

### Minor Changes

-   da9b6e1: wp_scripts: Import dependencies dynamically.
-   bafb3cb: Use WP_HTML_Tag_Processor to update script type attribute.
-   28a3eb6: Accept options in dev_server, prioritise dev manifest over build one in PHP helper.

### Patch Changes

-   77a7da8: Use wp_json_file_decode() to read manifest file.
-   3296971: Only print react-refresh preamble script once.

## 0.7.1

### Patch Changes

-   461687b: Merge dev server plugins
-   ad81a04: Make v4wp options optional
-   c755432: Ensure dev server manifest is created when the server (re)starts and deleted when it's stopped.
-   e2212e3: Improve JS doc blocks.
-   dc71bde: Dev server manifest plugin: Improve files-related operation

## 0.7.0

### Minor Changes

-   56bce53: Introduce wp_scripts() plugin to externalise scripts already registered by WP core.
-   08ceb4f: Provide v4wp plugin, deprecate create_config()

### Patch Changes

-   961d00b: Update prettier

## 0.6.2

### Patch Changes

-   a4cd144: Improve manifest file finder

## 0.6.1

### Patch Changes

-   f221454: Fix production asset paths on Windows

## 0.6.0

### Minor Changes

-   89d341b: Vite 4.4 & Typings with JSDoc

## 0.5.2

### Patch Changes

-   c9bf8fb: Update Vite -> 4.0.1

## 0.5.1

### Patch Changes

-   6393c5a: Replace deprecated option: polyfillModulePreload -> modulePreload

## 0.5.0

### Minor Changes

-   f8041da: Exit process cleanly after removing manifest file

## 0.4.0

### Minor Changes

-   2bdce3b: Improve production assets handling, props @slamkajs.

## 0.3.1

### Patch Changes

-   c8db8fe: Fix react-refresh preamble script

## 0.3.0

### Minor Changes

-   cd44819: Support dynamic imports/code splitting

## 0.2.0

### Minor Changes

-   ef4decc: Add support for WP global modules

## 0.1.2

### Patch Changes

-   89fc35e: Fix README & NPM package info

## 0.1.1

### Patch Changes

-   aad4294: Fix release workflow

## 0.1.0

### Minor Changes

-   d34ce89: Initial release
