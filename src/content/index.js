import welcome from 'shared/welcome';

welcome('content/index.js');

if (document.location.hostname === 'www.facebook.com') {
  chrome.extension.sendRequest({method: 'page'}, () => {});
}

chrome.extension.sendRequest({
  method: 'add_contextMenu',
  title: 'Add this post to bookmarks',
}, ({id}) => { console.log(id); });
