/**
 * code in inject.js
 * added "web_accessible_resources": ["injected.js"] to manifest.json
 */

function gen_script(filename){
    var s = document.createElement('script');
    s.src = chrome.extension.getURL(filename);
    s.onload = function() {
        this.remove();
    };
    return s;
}

var files = ["jszip-utils.js","FileSaver.js","jszip.js","injected.js"]
var d =  (document.head || document.documentElement);

for (let i in files){
    var s = gen_script("js/"+files[i]);
    d.appendChild(s);
}


