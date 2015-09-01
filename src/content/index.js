/* eslint-disable no-alert, no-console */
// import _ from 'lodash';
require('expose?jQuery!expose?$!jquery'); // expose "jQuery" and "$" to window
require('bootstrap');
import './index.less';
import bookMarkModal from './bookMarkModal';

// append modal on body first
$(bookMarkModal).appendTo('body');
// hack to let modal events work as usual
// http://stackoverflow.com/questions/13966259/how-to-namespace-twitter-bootstrap-so-styles-dont-conflict
$('.modal-backdrop').first().appendTo('#modal-container');

// possible fb post url pattern
const targetPostWhiteList = [
  /(.*\/posts\/.*)/,
  /(.*\/photo[s]?.*)/, // with single photo ex: photo.php?......
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

let lastRef;
// every post would have role attributes with article value
$(document).find('div[role=article]').each((i, postComponent) => {
  console.log(postComponent);
  // a._5pcq(if fb change, we need to change too) would contain time span and href of that post
  $(postComponent).find('a._5pcq').each((idx, atag) => {
    console.log(lastRef);
    console.log(atag.href);
    // we may encounter with two postComponent with same class name ex: after somebody respond to .....
    // so we need lastRef to remember so that we don't duplicate two spans
    if (lastRef === atag.href) {
      return; // no effect return .....
    } else if (isInWhiteList(atag.href)) {
      lastRef = atag.href;
      const postBookMark = $(`<span class="bookmark" data-toggle="modal"
        data-target="#modal" data-href="${atag.href}">將此則貼文加入書籤</span>`);

      // div._5pcp(if fb change, we need to change too): parent of time span to append
      $(atag).parents('._5pcp').append(postBookMark);
      console.log('appended!');
    }
  });
});

$('#modal').on('show.bs.modal', function(event) {
  console.log('show from #modal');
  console.log(event);
  const button = $(event.relatedTarget); // Button that triggered the modal
  const recipient = button.data('href'); // Extract info from data-* attributes
  // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
  // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
  console.log('recipient ', recipient);
  const modal = $(this);
  modal.find('.modal-title').text('New message to ' + recipient);
  modal.find('.modal-body input').val(recipient);
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
