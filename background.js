import { formatFileName, composeText } from "./utils.js";

function extractText() {
  const title = document.title;
  const url = window.location.href;
  return { 
    title: title,  
    url: url,
    text: window.getSelection().toString().trim() || document.body.innerText
  }
};

function copyText() {
  function composeText(title, url, body) {
    return title + '\n' + url + "\n\n" + body;
  }
  let allText = composeText(document.title, window.location.href, window.getSelection().toString().trim() || document.body.innerText);
  navigator.clipboard.writeText(allText);
  return allText;
};

function isValidTab(tab){
  return tab.url.indexOf("about:") === -1 && tab.url.indexOf("moz-extension:") === -1;
}
browser.browserAction.onClicked.addListener( (tab) => {
  if(isValidTab(tab)){
    browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractText,
    }).then(async (r) => {
      const res = r[0].result;
      let resTab = await browser.tabs.create({url: browser.runtime.getURL("plain-text.html?t=" + encodeURIComponent(res.title) +"&u=" + encodeURIComponent(res.url) +"&tx=" + encodeURIComponent(res.text))});
      //console.log("resTab", resTab);
    });
  }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if(isValidTab(tab)){
    if(info.menuItemId === 'download-text'){
      browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractText,
      }).then(async (r) => {
        const res = r[0].result
        const allText = composeText(res.title , res.url, res.text)
        var blob = new Blob([allText], {type: "text/plain;charset=utf-8"})

        browser.downloads.download({
          url: URL.createObjectURL(blob),
          filename: formatFileName(res.title),
          saveAs: true
        });
      });
    } else if(info.menuItemId === 'copy-text'){
      browser.scripting.executeScript({
        target: { tabId: tab.id },
        func: copyText,
      }).then(async (r) => {
        /*
        const allText = r[0].result
        console.log("allText", allText);
        */
      });
    }
  }
});

browser.runtime.onInstalled.addListener(function (a,b,c) {
  browser.contextMenus.create({
    title: 'Copy',
    id: 'copy-text',
    contexts: ['all'],
  });
  browser.contextMenus.create({
    title: 'Download',
    id: 'download-text',
    contexts: ['all'],
  });
});