/* eslint-disable no-alert, no-console */
let currentContextMenuId;
let currentUrl;

function handleContextMenuClick(info, /* tab */) {
  console.log(info.menuItemId + ' is clicked');
  console.log('url under clicked: ' + currentUrl);
}

function onRequest(request, sender, sendResponse) {
  switch (request.method) {
  case 'page':
      // remove any preconfigured contextMenus when initiated.
    chrome.contextMenus.removeAll();
    // chrome.pageAction.show(sender.tab.id);
    break;
  case 'add_contextMenu':
    // if there is previous currentContextMenuId, delete it first
    console.log('currentContextMenuId in add', currentContextMenuId);
    if (currentContextMenuId) {
      currentUrl = request.url;
      console.log('currentUrl', currentUrl);
      sendResponse({});
      break;
    }
    currentContextMenuId = chrome.contextMenus.create({
      'title': 'Add this post to bookmarks',
      'onclick': handleContextMenuClick,
    });
    currentUrl = request.url;
    console.log('new create id: ' + currentContextMenuId);
    console.log('currentUrl', currentUrl);
    sendResponse({currentContextMenuId});
    break;
  case 'remove_contextMenu':
    console.log('currentContextMenuId in remove', currentContextMenuId);
    if (currentContextMenuId) {
      currentUrl = undefined;
    }
    sendResponse({});
    break;
  }

  // Return nothing to let the connection be cleaned up.
  sendResponse({});
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
