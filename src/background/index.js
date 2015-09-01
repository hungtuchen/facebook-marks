/* eslint-disable no-alert, no-console */

let lastestFolderHtml;

function onMessage(message, sender, sendResponse) {
  switch (message.type) {
  case 'add_bookmark':
    break;
  case 'get_folders':
    chrome.bookmarks.getTree(bookmarkTreeNodes => {
      // root bookmarkTreeNode has no title, only one in its array and we can omit it.
      lastestFolderHtml = makeFolderHtml(bookmarkTreeNodes[0].children);
      sendResponse({lastestFolderHtml});
    });
    return true;
    /*
    This function becomes invalid when the event listener returns, unless you return true from
    the event listener to indicate you wish to send a response asynchronously
    (this will keep the message channel open to the other end until sendResponse is called).
    */
  default:
  // Return nothing to let the connection be cleaned up.
    sendResponse({});
  }
}

function makeFolderHtml(rootNodes) {
  let folderHtml = '';
  (function recursiveMakeHtml(bookMarkNodes, level) {
    // http://stackoverflow.com/questions/1877475/repeat-character-n-times
    const prefix = Array(level).join('&nbsp;&nbsp;&nbsp;&nbsp;');
    bookMarkNodes.forEach(bookMarkNode => {
      // if bookMarkNodes has children, then it's an folder
      if (bookMarkNode.children) {
        folderHtml += `<option value="${bookMarkNode.id}">${prefix + bookMarkNode.title}</option>`;
        recursiveMakeHtml(bookMarkNode.children, level + 1);
      }
    });
  })(rootNodes, 1);
  return folderHtml;
}
/*
chrome.bookmarks.getTree(bookmarkTreeNodes => {
  // root bookmarkTreeNode has no title, only one in its array and we can omit it.
  lastestFolderHtml = makeFolderHtml(bookmarkTreeNodes[0].children);
  console.log('lastestFolderHtml', lastestFolderHtml);
});
*/
// Listen for the content script to send a message to the background page.
chrome.runtime.onMessage.addListener(onMessage);
