
# Webfocus Util

This is a WebfocusComponent implementation with some utilities for other [@webfocus/component](https://www.npmjs.com/package/@webfocus/component) implementations.

This component contains some client javascript and some server side functions.

To use the component to serve the client files in the WebfocusApp register:

```
webfocusApp.registerComponent(require('@webfocus/util/component'))
```


## Client Side Scripts

To use the client side scrips insert the tag `<script src="/util/<script-name>"></script>`

### `submit-json.js`

This script enables sumbiting any form with JSON. It catches any submit event. If the form contains a `data-submit-cb` attribute it makes a request to the forms action with its methof and a FormData object.
On recieving a response it tries to call the function given by `data-submit-cb`. 

### `pagination.js`

This script makes a GET request to an url provided.

### `inline-fetch.js`

This script makes a GET request to an url provided.

## Server Side Scripts

### `require("@webfocus/util").pagination`



## TODO

 - Improve Documentation

## Author

Diogo Almiro
