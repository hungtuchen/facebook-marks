/* eslint-disable no-alert, no-console */

function onRequest(request, sender, sendResponse) {
  switch (request.method) {
  case 'page':
      // remove any preconfigured contextMenus when initiated.
    // chrome.pageAction.show(sender.tab.id);
    break;
  case 'add_bookmark':
    break;
  }
  // Return nothing to let the connection be cleaned up.
  sendResponse({});
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
