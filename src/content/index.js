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

const isInWhiteList = (href) => {
  return targetPostWhiteList.some(pattern => {
    console.log(pattern);
    return href.search(pattern) !== -1;
  });
};

$(document).find('div[role=article]').each((i, postComponent) => {
  console.log(postComponent);
  let lastRef;
  $(postComponent).find('a._5pcq').each((idx, atag) => {
    console.log(atag.href);
    // we may encounter with two postComponent with same class name ex: after somebody respond to .....
    if (lastRef === atag.href) { return; }
    if (isInWhiteList(atag.href)) {
      const postHref = atag.href;
      lastRef = atag.href;
      const postBookMark = $('<span>將此則貼文加入書籤</span>');
      $(atag).parents('._5pcp').append(postBookMark);
      console.log('appended!');
    }
  });
});
/*
if (document.location.hostname === 'www.facebook.com') {
  chrome.extension.sendRequest({method: 'page'}, () => {});
}
*/
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
