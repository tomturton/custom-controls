window.CustomControls = function (inputs) {
	'use strict';

	var
		// == Private == //

		// # Classes
		Control = function (node, display) {
			this.node    = node;
			this.type    = null;
			this.valid   = false;
			this.display = display || 'none';
		},

		Switch = function (node, display, label) {
			Control.call(this, node, display);
			//Switch.prototype = Object.create(Control.prototype);
			//Switch.prototype.constructor = Switch;

			this.type  = this.node.getAttribute('type');
			this.value = this.node.getAttribute('value');
			this.label = label || null;
			this.valid = label !== undefined;
		},

		/*Select = function (node, display, full) {
			Control.call(this, node, display);
			//Select.prototype = Object.create(Control.prototype);
			//Select.prototype.constructor = Select;

			this.type  = 'select';
			this.full  = full || false;
			this.valid = true;
		},*/


		// # Vars
		_options = {
			allowDeselect: true
		},

		_fields = [],


		// # Functions

		// Identify inputs and store in controls or invalid arrays
		_init = function (inputs) {
			console.log('function: _init(inputs)');

			var i = 0,
				n = inputs.length,

				// Get the DOM node of the right label
				_getLabel = function (node) {
					console.log('function: _getLabel(node)');
					// Identify label
					if (node.parentNode.tagName.toLowerCase() === 'label') { // input is a child of label
						return node.parentNode;

					} else if (node.getAttribute('id') !== undefined) { // input has an id
						var id = node.getAttribute('id'),
							label = document.querySelector('label[for="' + id + '"]');

						if (label !== null) { // a label with this id exits
							return label;
						}
					}

					return undefined;
				};


			while (i < n) {
				var input   = inputs[i],
					name    = input.getAttribute('name'),
					type    = input.getAttribute('type'),
					display = window.getComputedStyle(input, null).getPropertyValue('display');

				if (!!input && !!name && !!type) {
					switch (type) {
						case 'radio':
						case 'checkbox':
							var label = _getLabel(input); // get label element

							if (_fields[name] === undefined) {
								_fields[name] = [];
								_fields[name].length = 0;
							}

							if (label !== undefined) {
								_fields[name].push(new Switch(input, display, label));

							} else {
								_fields[name].push(new Switch(input));
							}
							break;

						/*case 'select':
							var full = input.getAttribute('data-mode') === 'fullscreen';
							_fields[name].push(new Select(input, display, full));
							break;*/
					}
				}

				i += 1;
			}

			_initControls();
			console.log('');
		},


		_updateField = function (e) {
			console.log('function: updateField()');

			var fieldName = e.target.getAttribute('name');

			_fields[fieldName].forEach(function (c) {
				c.update();
			});
		},

		_initControls = function () {
			console.log('function: _initControls()');

			for (var fieldName in _fields) {
				if (_fields.hasOwnProperty(fieldName)) {
					var field = _fields[fieldName];
					
					field.forEach(function (control) {
						//console.log(control);
						control.init();

						// Events
						switch (control.type) {
							case 'radio':
							case 'checkbox':
								// When node changes, update labels
								control.node.addEventListener('change', _updateField, false);
								break;

							//case 'select':
								// When custom control changes, update node
						}
					});

					// Update the field controls
					_updateField({ target: field[0].node });
				}
			}
		},

		_uninitControls = function () {
			console.log('function: _uninitControls()');

			for (var fieldName in _fields) {
				if (_fields.hasOwnProperty(fieldName)) {
					var field = _fields[fieldName];

					field.forEach(function (control) {
						control.unInit();

						// Events
						switch (control.type) {
							case 'radio':
							case 'checkbox':
								// When node changes, update labels
								control.node.removeEventListener('change', _updateField, false);
								break;

							//case 'select':
								// When custom control changes, update node
						}
					});
				}
			}
		},


		// == Public == //
		cc = {
			options: function (key, val) {
				if (val !== undefined) {
					// Set option value
					_options[key] = val;

				} else {
					// Get option value
					return _options[key];
				}
			},

			destroy: function () {
				_uninitControls();
			}
		};


	// == Class methods == //
	Switch.prototype = new Control();
	//Select.prototype = new Control();

	Switch.prototype.init = function () {
		console.log('method: Switch.init()');

		if (this.valid) {
			this.node.style.display = 'none'; // Hide original control
			this.label.classList.add('cc_' + this.type); // Attach class for styling
		}
	};

	Switch.prototype.unInit = function () {
		console.log('method: Switch.unInit()');

		if (this.valid) {
			// Detach classes
			this.label.classList.remove('checked');
			this.label.classList.remove('cc_' + this.type);

			// Revert to original display setting
			this.node.style.display = this.display;
		}
	};

	Switch.prototype.update = function () {
		console.log('method: Switch.update()');

		if (this.node.checked !== false) {
			this.label.classList.add('checked');

		} else {
			this.label.classList.remove('checked');
		}
	};


	_init(inputs);

	return cc;
};
