import welcome from 'shared/welcome';

welcome('content/index.js');

if (document.location.hostname === 'www.facebook.com') {
  chrome.extension.sendRequest({method: 'page'}, () => {});
}
