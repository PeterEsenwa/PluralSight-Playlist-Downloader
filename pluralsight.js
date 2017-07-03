// Step 1 - adds jquery script to page

var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

jQuery.noConflict();

var a = document.createElement('a');
document.body.appendChild(a);
var saveUrl =  " " + jQuery("video").attr("src");
saveUrl = saveUrl.toString();
var url = " ";
var url = url + `${saveUrl}`;
a.id = "grt";


// Step 2



var counter = 1;
var courseTitle = jQuery("h1").first().text().trim().replace(/[^a-zA-Z0-9]/g, "_")
var lastVideoName = jQuery("li").last().find("h3").text().trim();
var lastVideoDuration = jQuery("li").last().find("div.duration").text().trim();
var lastModule = jQuery("h2").last().text().trim();
var lastVidToDl = false;
var nextVid = "";
var nextTitle = "";
var nextDuration = "";
var nextModule = "";
var dlSpeed = 150;
var minuteSizeInMB = 3;
var titlesArray = [];

(function (console) {

    console.save = function (data, filename) {

        if (!data) {
            console.error('Console.save: No data')
            return;
        }
        console.log("filename =====" + filename)
        if (!filename) filename = 'console.json'

        if (typeof data === "object") {
            data = JSON.stringify(data, undefined, 4)
        }

        var blob = new Blob([data], { type: 'text/json' }),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a')

        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
        a.dispatchEvent(e)
    }
    console.log("" + a.download)
})(console);

function dlVid() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.response, typeof this.response);
            var a = document.getElementById('grt');
            var url = window.URL || window.webkitURL;
            a.href = url.createObjectURL(this.response);

            var currTitle = jQuery("ul.clips > li.selected").find("h3").text().trim();
            var currMod = jQuery("header.active").find("h2").text().trim();
            a.setAttribute("download", currTitle + ".mp4");

            console.log(a);
            titlesArray.push(counter + " - " + currTitle);
            counter = counter + 1;

            var minutes = parseInt(jQuery("span.total-time").text().trim().split(":")[0]) + 1;
            var size = minutes * minuteSizeInMB * 1024 * 1024;
            var timeNeeded = Math.ceil((size / (dlSpeed * 1024)) * 1000);

            console.log("Rounded duration: ", minutes, " minutes",
                "\nEstimated size: ", size, " bytes",
                "\nEstimated time needed: ", timeNeeded, " msec");

            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            a.dispatchEvent(evt)
            jQuery("#next-control").click();


            setTimeout(function () { jQuery("#play-control").click(); }, 10000);

    if (!lastVidToDl) {
        setTimeout(dlVid, timeNeeded);
        nextVid = jQuery("ul.clips > li.selected").next();
        nextTitle = nextVid.find("h3").text().trim();
        nextDuration = nextVid.find("div.duration").text().trim();
        nextModule = nextVid.parent().parent().find("h2").text().trim();

        if (nextTitle == lastVideoName &&
            nextDuration == lastVideoDuration &&
            nextModule == lastModule) {
            lastVidToDl = true;
        }
    }
    else {
        console.save(titlesArray, courseTitle + ".json");
    }
        }
    }
    xhr.open('GET', "" + url + "" );
    xhr.responseType = 'blob';
    xhr.send();

}

dlSpeed = 750; dlVid();