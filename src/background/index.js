/* eslint-disable no-alert, no-console */

window.myDebug = require('debug');

const debug = myDebug('fbmk:background');

let backgroundState =
/* backgroundState would look like
{
  folderHtml: '',
  fbBookMarkList: [],
};
*/
// background.js initialized, we can update the backgroundState directly, don't wait for content.js asking
chrome.bookmarks.getTree(bookmarkTreeNodes => {
  // root bookmarkTreeNode has no title, only one in its array and we can omit it.
  backgroundState = updateLastestState(bookmarkTreeNodes[0].children);
  debug('initial backgroundState', backgroundState);
});
// TODO: setTimeout for updateLastestState, so if user add new folder we can know;

function onMessage(message, sender, sendResponse) {
  switch (message.type) {
  case 'add_bookmark':
    const { parentId, title, url } = message;
    chrome.bookmarks.create({parentId, title, url}, (newNode) => {
      if (!backgroundState.fbBookMarkList) { backgroundState.fbBookMarkList = []; }
      backgroundState.fbBookMarkList.push({ id: newNode.id, url: newNode.url });
      sendResponse({ addSuccess: true, fbBookMarkList: backgroundState.fbBookMarkList });
    });
    return true;
  case 'remove_bookmark':
    const { id } = message;
    chrome.bookmarks.remove(id, () => {
      const newFbBookMarkList = backgroundState.fbBookMarkList.filter(bookmark => bookmark.id !== id);
      backgroundState.fbBookMarkList = newFbBookMarkList;
      sendResponse({ removeSuccess: true, fbBookMarkList: newFbBookMarkList });
    });
    return true;
  case 'get_lastest_state':
    if (backgroundState) {
      sendResponse({backgroundState});
      return;
    }
    chrome.bookmarks.getTree(bookmarkTreeNodes => {
      // root bookmarkTreeNode has no title, only one in its array and we can omit it.
      backgroundState = updateLastestState(bookmarkTreeNodes[0].children);
      sendResponse({backgroundState});
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

function updateLastestState(rootNodes) {
  let folderHtml = '';
  const fbBookMarkList = [];
  (function recursiveUpdate(bookMarkNodes, level) {
    // http://stackoverflow.com/questions/1877475/repeat-character-n-times
    const prefix = Array(level).join('&nbsp;&nbsp;&nbsp;&nbsp;');
    bookMarkNodes.forEach(bookMarkNode => {
      // if bookMarkNodes has children, then it's an folder
      if (bookMarkNode.children) {
        folderHtml += `<option value="${bookMarkNode.id}">${prefix + bookMarkNode.title}</option>`;
        recursiveUpdate(bookMarkNode.children, level + 1);
      } else if (bookMarkNode.url.indexOf('https://www.facebook.com/') !== -1) {
        // if bookMarkNodes has no children, then it's a bookmark and we filter url only within fb
        fbBookMarkList.push({id: bookMarkNode.id, url: bookMarkNode.url});
      }
    });
  })(rootNodes, 1);
  return { folderHtml, fbBookMarkList };
}

// Listen for the content script to send a message to the background page.
chrome.runtime.onMessage.addListener(onMessage);
