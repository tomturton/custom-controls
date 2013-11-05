# Custom Controls

## What is it?
A way of customising the look and function of radio, checkbox and selectbox controls.


## Why?
There is no perfect or cross-browser method of styling these controls with CSS alone.
This is particularly annoying when developing for touchscreen devices that do not use mobile browsers, as often the control size is too small and therefore frustrating to use.


## How does it work?
JavaScript is used to generate extra markup. The CSS can then be customised by you.

### Radios & checkboxes
The original input element is hidden and classes are applied directly to the label element for styling.

### Selectboxes
The original select element is hidden and new markup is generated.



## Extra features
* Option to clear a radio group by re-clicking/touching the currently checked option.
* Selectboxes can be configured to load options in a large modal dialog.


## Browser Support
* Chrome
* Firefox
* IE10+ (Issues: forEach, indexOf, classList, getComputedStyle)


## Instructions
1. Clone/download the library
2. Update `css/custom-controls.scss` with your customisations
3. Compile Sass and include in your project, along with `js/custom-controls.min.js`


## To-do
* Shadow DOM
* WAI ARIA
* Better browser support
* Selectbox controls
