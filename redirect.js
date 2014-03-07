// script-src error workaround
MYSELF.redirect();
/*
chrome.storage.sync.get("url", function (items) {
	var url = items.url || "";
	if (/^http[s]?:/i.test(url)) {
		document.location.href = url;
	} else {
		if (/chrome-internal:\/\/newtab[\/]?/.test(url)) { url = ""; }
		chrome.tabs.getCurrent(function (t) {
			if (t.url === "chrome://newtab/") {
				chrome.tabs.update(t.id, {
					"url": url || chrome.extension.getURL("options.html"),
					"selected": true
				});
			}
		});
	}
});
*/