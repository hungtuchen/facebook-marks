function onRequest(request, sender, sendResponse) {
  if (request.method === 'page') {
    // 顯示設定新聞小幫手的 page action
    chrome.pageAction.show(sender.tab.id);
  }

  // Return nothing to let the connection be cleaned up.
  sendResponse({});
}

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);
