/* eslint-disable no-alert, no-console */
import _ from 'lodash';
import $ from 'jquery';
window.$ = $;

const targetPostWhiteList = [
  /(.*\/posts\/.*)/,
  /(.*\/photos\/.*)/,
  /(.*\/videos\/.*)/,
  /(.*\/groups\/.*\/permalink\/.*)/,
];
if (document.location.hostname === 'www.facebook.com') {
  chrome.extension.sendRequest({method: 'page'}, () => {});
}
$(document).find('div[role=article]').each((i, postComponent) => {
  console.log(postComponent);
  let url;
  $(postComponent).find('a._5pcq').each((idx, atag) => {
    console.log(atag.href);
    targetPostWhiteList.map((pattern)=> {
      console.log(pattern);
      if (atag.href.search(pattern) !== -1) {
        url = atag.href;
      }
    });
  });
  // if mouse enter into postComponent, we add the contextMenu and bind bookmark url to it
  $(postComponent).on('mouseenter', () => {
    console.log('mouseenter triggered');
    chrome.extension.sendRequest({
      method: 'add_contextMenu',
      url,
    }, ({currentContextMenuId}) => { currentContextMenuId ? console.log(currentContextMenuId + ' created') : console.log('nothing created'); });
  });
  // once it mouse leave from postComponent, we then remove contextMenu and url
  $(postComponent).on('mouseleave', () => {
    console.log('leave triggered');
    chrome.extension.sendRequest({
      method: 'remove_contextMenu',
      url,
    });
  });
});

/* deal with changed DOMs (i.e. AJAX-loaded content)
ported from https://github.com/g0v/newshelper-extension/blob/master/content_script.js */
/*
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
*/
