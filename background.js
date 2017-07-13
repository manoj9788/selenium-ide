var panelId = undefined;

function onCreated(windowInfo) {
    console.log(`Create editor successfully: id = ${windowInfo.id}`);
    panelId = windowInfo.id;
}

function onError(error) {
    console.log(`Error: ${error}`);
}

function openPage() {
    var windowGet = browser.windows.getLastFocused({});
    var popupURL = browser.extension.getURL("panel.html");
    //if (!panelId) { //window isn't existed
        var creating = browser.windows.create({
            url: popupURL,
            type: "popup",
            height: 650,
            width: 630
        });

    Promise.all([windowGet,creating]).then(results => {
            //console.log("All done");
            setTimeout(passingWindowID,2000,results[0].id,results[1].id);
        }).catch((e) => {
            console.log(`Error: ${error}`);
    });

}

browser.browserAction.onClicked.addListener(openPage);

function disconnectAllTabs(tabs) {
    for (let tab of tabs) {
        browser.tabs.sendMessage(tab.id, {active: false});
    }
}

function queryError(error) {
    console.log(`Error: ${error}`);
}

browser.windows.onRemoved.addListener(function(windowId) {
    if (windowId === panelId) {
        console.log("Editor has closed");
        var querying = browser.tabs.query({url: "<all_urls>"});
        querying.then(disconnectAllTabs, queryError);
        panelId = undefined;
    }
});

function passingWindowID(window_id,sideex_id){
    console.log(window_id+" "+sideex_id);

    var catchSideexTab = browser.tabs.query({ windowId: sideex_id,active:true },function(sideexTabs){
        console.log("sideexTab:"+sideexTabs[0].id);
        console.log("url2:"+sideexTabs[0].url);

        //passing userWinID to sideex
        browser.tabs.query({ windowId: sideex_id,active:true }, function(tabs) {
            for (let tab of tabs) {
                browser.tabs.sendMessage(
                    tab.id, { passWinID:window_id,sideexID:sideexTabs[0].id }
                ).catch(onError);
            }
        });

        //passing sideexID to userWin
        browser.tabs.query({ windowId: window_id,active:true }, function(tabs) {
            for (let tab of tabs) {
                browser.tabs.sendMessage(
                    tab.id, { passWinID:window_id,sideexID:sideexTabs[0].id }
                ).catch(onError);
            }
        });
    });
};

browser.contextMenus.create({
    id: "verifyText",
    title: "verifyText"
    //contexts: ["all"]
});
browser.contextMenus.create({
    id: "verifyTitle",
    title: "verifyTitle"
    //contexts: ["all"]
});
browser.contextMenus.create({
    id: "assertText",
    title: "assertText"
    //contexts: ["all"]
});
browser.contextMenus.create({
    id: "assertTitle",
    title: "assertTitle"
    //contexts: ["all"]
});
browser.contextMenus.create({
    id: "storeText",
    title: "storeText"
    //contexts: ["all"]
});
browser.contextMenus.create({
    id: "storeTitle",
    title: "storeTitle"
    //contexts: ["all"]
});

var port;
browser.contextMenus.onClicked.addListener(function(info, tab) {
    switch (info.menuItemId) {
      case "verifyText":
        console.log("verifyText:");
        port.postMessage({cmd:"verifyText"});
        break;
      case "verifyTitle":
        console.log("verifyTitle:");
        port.postMessage({cmd:"verifyTitle"});
        break;
      case "assertText":
        console.log("assertText:");
        port.postMessage({cmd:"assertText"});
        break;
      case "assertTitle":
        console.log("assertTitle:");
        port.postMessage({cmd:"assertTitle"});
        break;
      case "storeText":
        console.log("storeText:");
        port.postMessage({cmd:"storeText"});
        break;
      case "storeTitle":
        console.log("storeTitle:");
        port.postMessage({cmd:"storeTitle"});
        break;  
    default:
    }
});
//
browser.runtime.onConnect.addListener(function(m) {
    port = m;
});
