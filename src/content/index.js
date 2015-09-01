/* eslint-disable no-alert, no-console */
// import _ from 'lodash';
require('expose?jQuery!expose?$!jquery'); // expose "jQuery" and "$" to window
require('bootstrap');
import './index.less';
import bookMarkModal from './bookMarkModal';

// append modal on body first
const bookMarkModalContainer = $(bookMarkModal);
$('body').append(bookMarkModalContainer);
// hack to let modal events work as usual
// http://stackoverflow.com/questions/13966259/how-to-namespace-twitter-bootstrap-so-styles-dont-conflict
$('.modal-backdrop').first().appendTo(bookMarkModalContainer);

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
    const postHref = atag.href;
    console.log(lastRef);
    console.log(postHref);
    // we may encounter with two postComponent with same class name ex: after somebody respond to .....
    // so we need lastRef to remember so that we don't duplicate two spans
    if (lastRef === postHref) {
      return; // no effect return .....
    } else if (isInWhiteList(postHref)) {
      lastRef = postHref;
      const postBookMark = $(`<span class="bookmark" data-toggle="modal"
        data-target="#modal" data-href="${postHref}">將此則貼文加入書籤</span>`);

      // div._5pcp(if fb change, we need to change too): parent of time span to append
      $(atag).parents('._5pcp').append(postBookMark);
      console.log('appended!');
    }
  });
});

$('#modal').on('show.bs.modal', function(event) {
  const span = $(event.relatedTarget); // Button that triggered the modal
  const postHref = span.data('href'); // Extract info from data-* attributes
  console.log('postHref ', postHref);
  const modal = $(this);
  modal.find('.modal-body input').val(postHref);
});
/*
Due to how HTML5 defines its semantics, the autofocus HTML attribute has no effect in Bootstrap modals.
To achieve the same effect, use some custom JavaScript:
*/
$('#modal').on('shown.bs.modal', function() {
  $('#name').focus();
});

const folderSelect = $('#folder');
// folderSelect.on('change', function() {
// });

console.log('message about to sent');
chrome.runtime.sendMessage({type: 'get_folders'}, ({lastestFolderHtml}) => {
  folderSelect.append(lastestFolderHtml);
});

/*
if (document.location.hostname === 'www.facebook.com') {
  chrome.extension.sendRequest({type: 'page'}, () => {});
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
    chrome.extension.sendRequest({type: 'page'}, () => {});

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
