;(function ($, window, document, undefined) {
	
	// Plugin variables
	var
		// # Variables
		pluginName = 'customWebControls',
		defaults = {
			allowDeselect: true
		},


		// # Classes
		Control = function (el) {
			this.el      = el;
			this.name    = el.getAttribute('name');
		},

		Switch = function (el) {
			Control.call(this, el);

			this.type   = el.getAttribute('type');
			this.value  = el.getAttribute('value');
			this.labels = this.getLabels();

			this.init();
		};

		/*Select = function (el) {
			Control.call(this, el);

			this.full  = el.getAttribute('data-mode') === 'fullscreen';

			this.init();
		};*/


	// # Plugin constructor
	function Plugin (element, options) {
		this.element   = element;
		this.settings  = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name     = pluginName;

		this.init();
	}


	// # Plugin Functions
	Plugin.prototype = {

		// ## Initialise plugin
		init: function () {
			console.log('init()');

			var el      = this.element,
				tagname = el.tagName,
				name    = el.getAttribute('name');

			if (!!tagname && !!name) {
				switch (tagname) {
					case 'INPUT':
						this.control = new Switch(el);
						break;

					/*
					case 'SELECT':
						var full = input.getAttribute('data-mode') === 'fullscreen';

						this.control = new Select(full);
						this.valid   = true;
						break;
					*/
				}
			}


		},
		
		// ## Uninitialise plugin
		destroy: function () {
			console.log('destroy()');

			this.control.destroy();
		}
	};


	// # Switch class methods
	Switch.prototype = {

		// ## Get label(s) for Switch
		getLabels: function () {
			console.log('Switch.getLabels()');

			// Identify labels
			var parent = this.el.parentNode;

			if (parent.tagName === 'LABEL') { // input is a child of label
				return parent;

			} else if (this.el.getAttribute('id') !== undefined) { // input has an id
				var id     = this.el.getAttribute('id'),
					labels = document.querySelectorAll('label[for="' + id + '"]');
				return labels.length > 0 ? labels : null;
			}

			return null;
		},

		// ## Initialise Switch
		init: function () {
			console.log('Switch.init()');

			if (this.type && (this.type === 'radio' || this.type === 'checkbox')) { // Input type radio or checkbox
				var eventData = {
					el: this.el,
					name: this.name
				};
				
				// Get ID of input or generate oneid  = this.el.getAttribute('id').
				this.id = this.el.getAttribute('id');

				if (!this.id || this.id.length === 0) {
					this.id = this.generateID(8);
				}


				// Create custom control(s)
				if (this.labels === null) { // Labels do not exist
					// Create control adjacent to original input
					var control = this.getNewControlHTML();
					$(this.el).after(control);

				} else { // Labels exist
					// Replace labels with custom controls
					var me = this;

					$(this.labels).each(function () {
						var $label   = $(this),
							content = $label.html(),
							control = me.getNewControlHTML(content);

						$label.after(control);
					});

					$(this.labels).hide(); // Hide labels
				}

				this.controls = document.querySelectorAll('div[data-cc_for="' + this.id + '"]');
				$(this.controls).on('click', eventData, this.toggle);
				this.el.setAttribute('data-cc_id', this.id);
				$(this.el).on('change', eventData, this.updateAll);
				$(this.el).hide();
				$(this.el).trigger('change', eventData);
			}
		},

		// ## Generate and ID
		generateID: function (len) {
			console.log('Switch.generateID()');

			var str = '',
				rnd = 0,
				i   = 0;
			
			while (i < len) {
				rnd = (Math.floor((Math.random() * 100)) % 94) + 33;
				
				if (
					((rnd >= 33)  && (rnd <= 47)) ||
					((rnd >= 58)  && (rnd <= 64)) ||
					((rnd >= 91)  && (rnd <= 96)) ||
					((rnd >= 123) && (rnd <= 126))
				) {
					//unacceptable character - loop again (don't use 'continue')
				} else {
					i++;
					str += String.fromCharCode(rnd);
				}
			}
		
			return str;
		},

		// ## Create custom control
		getNewControlHTML: function (content) {
			console.log('Switch.getNewControlHTML()');

			var classes = [
					'cc_' + this.type
				];
			
			if (!content || content.length === 0) {
				classes[1] = 'cc_empty';
				content    = '';
			}
			if (!!this.el.disabled) {
				classes.push('cc_disabled');
			}
			
			return '<div data-cc_for="' + this.id + '" class="' + classes.join(' ') + '">' + content + '</div>';
		},


		// ## Toggle checked
		toggle: function (e) {
			console.log('Switch.toggle()');

			if (!e.data.el.disabled) {
				if (!e.data.el.checked) {
					e.data.el.checked = true;

				} else { // elseif (allowDeselect && ) {
					e.data.el.checked = false;
				}

				$(e.data.el).trigger('change', { el: e.data.el, name: e.data.name });
			}
		},


		// ## Update all related Switches
		updateAll: function (e) {
			console.log('Switch.updateAll()');

			$('input[name="' + e.data.name + '"]').each(function () {
				var id = this.getAttribute('data-cc_id');

				if (!!this.checked) {
					$('div[data-cc_for="' + id + '"]').addClass('cc_checked');
				} else {
					$('div[data-cc_for="' + id + '"]').removeClass('cc_checked');
				}
			});
		},


		// ## Uninitialise Switch
		destroy: function () {
			console.log('Switch.destroy()');

			if (!!this.id) { // Valid control
				$(this.controls).off('click', this.toggle); // Remove toggle event
				$(this.controls).remove(); // Remove all controls
				$(this.labels).show(); // Show original labels
				$(this.el).show(); // Show original input
				$(this.el).off('change', this.updateAll); // Remove updateAll event
				this.el.removeAttribute('data-cc_for'); // Remove our ID attribute
			}
		}
	};

	
	// # Include as a jQuery Plugin
	$.fn[pluginName] = function (options) {
		var args = arguments;

		if (options === undefined || typeof options === 'object') {
			return this.each(function () {
				if (!$.data(this, 'plugin_' + pluginName)) {
					$.data(this, 'plugin_' + pluginName, new Plugin(this, options));
				}
			});
			
		} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {

			// Cache the method call
			// to make it possible
			// to return a value
			var returns;

			this.each(function () {
				var instance = $.data(this, 'plugin_' + pluginName);

				// Tests that there's already a plugin-instance
				// and checks that the requested public method exists
				if (instance instanceof Plugin && typeof instance[options] === 'function') {

					// Call the method of our plugin instance,
					// and pass it the supplied arguments.
					returns = instance[options].apply(instance, Array.prototype.slice.call(args, 1));
				}

				// Allow instances to be destroyed via the 'destroy' method
				if (options === 'destroy') {
				  $.data(this, 'plugin_' + pluginName, null);
				}
			});

			// If the earlier cached method
			// gives a value back return the value,
			// otherwise return this to preserve chainability.
			return returns !== undefined ? returns : this;
		}
	};

})(jQuery, window, document);
