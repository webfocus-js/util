
# Webfocus Util

This is a WebfocusComponent implementation of some utilities for other [@webfocus/component](https://www.npmjs.com/package/@webfocus/component) implementations.

This component some client javascript files:

 - pagination.js

 - submit-json.js

And server side functions:

 - pagination

To use the component to serve the client files in the WebfocusApp register:

```
webfocusApp.registerComponent(require('@webfocus/util/component'))
```

To use the server side functions in any component:

```
let pagination = require('@webfocus/util').pagination;
```

## TODO

 - Improve Documentation

## Author

Diogo Almiro