/* eslint-disable no-alert, no-console */
import $ from 'jquery';
window.$ = $;

if (document.location.hostname === 'www.facebook.com') {
  chrome.extension.sendRequest({method: 'page'}, () => {});
}

$(document).ready(() => {
  const targets = $('div[role="article"]');
  console.log(targets);
});

chrome.extension.sendRequest({
  method: 'add_contextMenu',
  title: 'Add this post to bookmarks',
}, ({id}) => { console.log(id); });

/* deal with changed DOMs (i.e. AJAX-loaded content)
ported from https://github.com/g0v/newshelper-extension/blob/master/content_script.js */
const registerObserver = () => {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  const throttle = (() => {
    let timer_;
    return (fn, wait) => {
      if (timer_) {
        clearTimeout(timer_);
      }
      timer_ = setTimeout(fn, wait);
    };
  })();

  // 直接 censor 整個 document
  // 這樣才能偵測到滑鼠點選換頁的事件
  const target = document;
  const config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
  };

  const mutationObserver = new MutationObserver((mutations) => {
    chrome.extension.sendRequest({method: 'page'}, () => {});

    let hasNewNode = false;
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        hasNewNode = true;
      }
    });
    if (hasNewNode) {
      throttle(() => {
        // censorFacebook(target);
      }, 1000);
    }
  });

  mutationObserver.observe(target, config);
};
