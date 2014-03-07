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
		var args = Array.prototype.slice.call(arguments, 0);
		console.log.apply(console, args);

		if (!options || !options.debugMode || !options.debugMode.val) return;

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
		// P.log(e, e.target.value);
		
		$('#url')[0].value = e.target.value;
	};

	
	
	/**
	 * Save options
	 */
	P.save = function () {
		options = [].reduce.call($('.f [id]'), function (o, v) {
			o[v.id] = { type: v.type };
			switch(o.type) {
				case 'checkbox': o[v.id].val = v.checked; break;
				default: o[v.id].val = v.value; break;
			}
			return o;
		}, {});
		
		storage.set(options, function() {
			alert(L.saved_settings); // TODO: localize
			P.log(N, 'saved options', options);		
		});
		
	};
	
	P.reset = function() {
		storage.clear(function() { P.log(N, 'cleared settings'); });
	};

	
	/**
	 * Load options
	 */
	P.load = function () {
		storage.get(null, P._load);
		P.log(N, chrome.runtime.lastError);
	};
	P._load = function(options) {
		P.log(N, 'loaded options', options)
		// default options
		if ('undefined' === typeof options) {
			options = {
				url: { type: 'text', val: '' },
				ex: { type: 'select-one', val: '' },
				debugMode: { type: 'checkbox', val: false }
			}
		}
		
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
		['save', 'reset'].forEach(function (a) {
			var $o = $('#' + a)[0];
			if($o) $o.addEventListener('click', P[a]);
		});
		// dropdowns
		['ex'].forEach(function (a) {
			var $o = $('#' + a)[0];
			if($o) $o.addEventListener('change', P[a]);
		});
	};
	
	var isnewtab = function(url) {
		return (/chrome(-internal)?:\/\/newtab[\/]?/).test(url);
	};
	
	P.redirect_init = function() {
		storage.get('url', function(data) {
			if('undefined' === typeof data || !data.url) return;
			var url = data.url.val;
			
			// regular link vs chrome
			if (/^http[s]?:/i.test(url)) {
				document.location.href = url;
			} else {
				if (isnewtab(url)) { url = ""; }
				chrome.tabs.getCurrent(function (t) {
					if (!t.url || isnewtab(t.url)) {
						chrome.tabs.update(t.id, {
							"url": url || chrome.extension.getURL("options.html"),
							"selected": true
						});
					}
				});
			}
		})
	};
	
	return {
		options: P.options_init,
		redirect: P.redirect_init
	};

})(chrome.storage.sync, function (s) { return document.querySelectorAll(s); });
