# Custom Web Controls

## What is it?
A jQuery plugin to customise the look and function of radio, checkbox and selectbox controls.


## Why?
There is no perfect or cross-browser method of styling these controls with CSS alone.
This is particularly annoying when developing for touchscreen devices that do not use mobile browsers, as often the control size is too small and therefore frustrating to use.


## How does it work?
JavaScript is used to generate extra markup. The CSS can then be customised by you.


### Radios & checkboxes
The original input element and labels are hidden. In place of each label, new markup is generated with classes representing type and state, for custom styling.
If there is no label associated with the input element, the new markup is created in place of the input element.

#### Note
An HTML inside label elements will be copied to the custom label. Consequently, do not nest the input inside its label element.

custom-web-controlsI.e. this is not recommended:

```html
<label>
    Star Wars
    <input type="radio" name="fave_film" value="Star Wars" />
</label>
```

### Selectboxes
The original select element is hidden and new markup is generated.



## Extra features
* Option to clear a radio group by re-clicking/touching the currently checked option.
* Selectboxes can be configured to load options in a large modal dialog.


## Dependancies
* A good browser, or IE8+
* jQuery v1.7+


## Instructions
1. Clone/download the library
2. Update `css/jquery-custom-controls.scss` with your customisations
3. Compile Sass and include in your project, along with `js/jquery-custom-controls.min.js`
4. Run plugin script on radios, checkboxes and select elements you want to customise. `$('input, select').customControls();`


## Progress
- [x] Design as jQuery plugin
- [x] Radio/checkbox controls
- [ ] Selectbox controls
- [ ] Create usable demo
- [ ] WAI ARIA
- [ ] Web components (?)
