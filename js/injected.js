(function(xhr) {

    var Promise = window.Promise;
    if (!Promise) {
        Promise = JSZip.external.Promise;
    }

    /**
     * Fetch the content and return the associated promise.
     * @param {String} url the url of the content to fetch.
     * @return {Promise} the promise containing the data.
     */
    function urlToPromise(url) {
        return new Promise(function(resolve, reject) {
            JSZipUtils.getBinaryContent(url, function (err, data) {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }
    
    function createDownloadButton(){
        var nav = document.querySelector("#app > div:nth-child(2) > div.view-classroom > div > div.classroom-layout > div.classroom-nav");
        var old = document.querySelector("#app > div:nth-child(2) > div.view-classroom > div > div.classroom-layout > div.classroom-nav > span");
        var button = document.createElement("button");
        button.innerText = "下载"
        button.style.cssText = "margin-left: 16px;--dialog-body-max-height: 466.364px;-webkit-font-smoothing: antialiased;list-style: none;list-style-type: none;font: inherit;vertical-align: baseline;font-family: Roboto,Helvetica,Arial,sans-serif;-webkit-tap-highlight-color: rgba(0,0,0,0);-webkit-user-select: none;line-height: 1;white-space: nowrap;cursor: pointer;border: 1px solid #dadce0;-webkit-appearance: none;text-align: center;box-sizing: border-box;outline: 0;transition: .1s;font-weight: 500;font-size: 12px;border-radius: 3px;padding: 9px 15px;display: block;color: #ffffff;background: #4285f4;border-color: #b3cefb;";
        button.onclick = downloadFile;
        nav.removeChild(nav.lastElementChild);
        nav.appendChild(button);
    }

    function downloadFile(){
        var img_data = window.img_data;
        var title = img_data[1].task.title;
        var zip = new JSZip();
        for (let i in img_data){
            var url = img_data[i].src;
            var name = String(i)+".png";
            zip.file(name, urlToPromise(url), {binary:true});
        }
        zip.generateAsync({type:"blob"}).then(function(content) {
            var filename = title.replace(".pptx","").replace(".ppt","");
            saveAs(content, filename+".zip");
        });
    }


    var XHR = XMLHttpRequest.prototype;

    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    XHR.open = function(method, url) {
        this._method = method;this._url = url;
        this._requestHeaders = {};
        this._startTime = (new Date()).toISOString();
        return open.apply(this, arguments);
    };

    XHR.setRequestHeader = function(header, value) {
        this._requestHeaders[header] = value;
        return setRequestHeader.apply(this, arguments);
    };

    XHR.send = function(postData) {
        this.addEventListener('load', function() {
            var responseHeaders = this.getAllResponseHeaders();
            if ( this._url.match("PrestudyTaskApi/preStudyList") == null) return;
            if ( this.responseType != 'blob' && this.responseText) {
                try {
                    var arr = this.responseText;
                    var response_data = JSON.parse(arr);
                    var img_data = response_data.data.data;
                    window.img_data = img_data;
                    createDownloadButton();
                    console.log(response_data);

                } catch(err) {
                    console.log("Error in response try catch");
                    console.log(err);
                }
            }
        });

        return send.apply(this, arguments);
    };

})(XMLHttpRequest);