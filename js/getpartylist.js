// this script makes sure that we get the latest list of detected 3rd parties

//dont know if this is necessary, but if it prevents a crash once, its successful
if ( self.browser instanceof Object === false ) {
    if ( self.chrome instanceof Object === false ) {
        throw new Error('!?!');
    }
    self.browser = self.chrome;
}

let browser = self.browser;
let jsonData = "no data :(";
browser.runtime.sendMessage({ what: 'doExportData' }, function(data) {
    jsonData = data;
});
