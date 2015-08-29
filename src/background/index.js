function onRequest(request, sender, sendResponse) {
  if (request.method === 'page') {
    // chrome.pageAction.show(sender.tab.id);
  } else if (request.method === 'add_contextMenu') {
    const id = chrome.contextMenus.create({'title': request.title});
    console.log(id);
    sendResponse({id});
  }

  // Return nothing to let the connection be cleaned up.
  sendResponse({});
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
