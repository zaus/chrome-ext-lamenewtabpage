;MYSELF = (function (storage, $) {
	var 
		// the "plugin"
		P = {},
		// namespace
		N = 'oldnewtabpage_v1',
		// localization
		L = {
			saved_settings: 'Settings Saved'
		},
		// the current options
		options
	;

	// #region -------- utilities ----------
	
	P.log = function () {
		if (!options.debugMode || !options.debugMode.val) return;

		var args = Array.prototype.slice.call(arguments, 0);
		console.log.apply(console, args);

		var $d = $('#debug')[0];
		if ($d) {
			args = args.map(function (o) { return JSON.stringify(o); });
			$d.innerHTML += args.join("\n");
		}
	}

	/**
	 * Serialize
	 */
	P.ser = function(data) {
	
		return JSON.stringify(data);
	};
	/**
	 * Deserialize
	 */
	P.deser = function(data) {
		return JSON.parse(data);
	};

	// #endregion -------- utilities ----------

	
	/**
	 * On example dropdown change
	 */
	P.ex = function(e) {
		P.log(e, e.target.value);
		
		$('#url')[0].value = e.target.value;
	};

	
	
	/**
	 * Save options
	 */
	P.save = function () {
		options = [].reduce.call($('.f input'), function (o, v) {
			o[v.id] = { type: v.type };
			switch(o.type) {
				case 'checkbox': o.val = v.checked; break;
				default: o.val = v.value; break;
			}
			return o;
		}, {});
		
		// must turn into key/value pair
		var d = {};
		d[N] = P.ser(options);
		
		storage.set(d, function() {
			alert(L.saved_settings); // TODO: localize
			P.log(N, 'saved options', options);		
		});
		
	};

	
	/**
	 * Load options
	 */
	P.load = function () {
		storage.get(N, P._load);
	};
	P._load = function(options) {
		// default options
		
		if (!options) {}
		else options = P.deser(options);
		
		for (var k in options) {
			if (options.hasOwnProperty(k)) {
				var v = options[k];

				var $o = $('#' + k)[0];
				if ($o) {
					switch(v.type) {
						case 'checkbox': $o.checked = v.val; break;
						default: $o.value = v.val; break;
					}
				}
			}
		}

		if (options.debugMode.val && !$('#debug')[0]) {
			var e = document.createElement('pre');
			e.id = 'debug';
			$('#P')[0].parentNode.appendChild(e);
		}

		P.log(N, 'loaded options');
	}

	P.options_init = function() {
		document.addEventListener('DOMContentLoaded', P.load);
		// buttons
		['save'].forEach(function (a) {
			var $o = $('#' + a)[0];
			if($o) $o.addEventListener('click', P[a]);
		});
		// dropdowns
		['ex'].forEach(function (a) {
			var $o = $('#' + a)[0];
			if($o) $o.addEventListener('onchange', P[a]);
		});
	};
	
	P.redirect_init = function() {
		storage.get(N, function(data) {
			if(!data) return;
			
			options = P.deser(data);
			
			window.location.href = options.url;
		})
	};
	
	return {
		options: P.options_init,
		redirect: P.redirect_init
	};

})(chrome.storage.sync, function (s) { return document.querySelectorAll(s); });
