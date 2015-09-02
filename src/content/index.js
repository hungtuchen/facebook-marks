/* eslint-disable no-alert, no-console */
// import _ from 'lodash';
require('expose?jQuery!expose?$!jquery'); // expose "jQuery" and "$" to window
require('bootstrap');
import './index.less';
import bookMarkModal from './bookMarkModal';

// TODO: ._5pbx.userContent for paragraph, if it should default title.

let lastestFbBookMarkList = [];
let currentPostBookmark;

// append modal on body first
const bookMarkModalContainer = $(bookMarkModal);
$('body').append(bookMarkModalContainer);
// hack to let modal events work as usual
// http://stackoverflow.com/questions/13966259/how-to-namespace-twitter-bootstrap-so-styles-dont-conflict
$('.modal-backdrop').first().appendTo(bookMarkModalContainer);

// possible fb post url pattern
const targetPostWhiteList = [
  /(.*\/post[s]?.*)/,
  /(.*\/posts\/.*)/,
  /(.*\/photo[s]?.*)/, // with single photo ex: photo.php?......
  /(.*\/photos\/.*)/,
  /(.*\/video[s]?.*)/,
  /(.*\/videos\/.*)/,
  /(.*\/permalink[s]?.*)/,
  /(.*\/groups\/.*\/permalink\/.*)/,
  /(.*\/note[s]?.*)/,
  /(.*\/notes\/.*)/,
];

const isInWhiteList = (href) => {
  return targetPostWhiteList.some(pattern => {
    console.log(pattern);
    return href.search(pattern) !== -1;
  });
};

const modal = $('#modal');
const nameTextInput = $('#name');
const folderSelect = $('#folder');
// folderSelect.on('change', function() {
// });
const addSubmitButton = $('#add-submit');

console.log('message about to sent');
chrome.runtime.sendMessage({type: 'get_lastest_state'}, ({backgroundState}) => {
  const { folderHtml, fbBookMarkList } = backgroundState;
  folderSelect.append(folderHtml);
  lastestFbBookMarkList = fbBookMarkList;
  console.log('lastestFbBookMarkList', lastestFbBookMarkList);
  starEveryPost();
});

function starEveryPost() {
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
      if (lastRef === postHref || lastRef + '#' === postHref) {
        return;
      } else if (isInWhiteList(postHref)) {
        lastRef = postHref;
        const postBookMark = makeStar(postHref);
        // div._5pcp(if fb change, we need to change too): parent of time span to append
        $(atag).parents('._5pcp').append(postBookMark);
        console.log('appended!');
      }
    });
  });
}

function makeStar(postHref) {
  const text = checkWasBookmarked(postHref) ? '移除書籤' : '將此則貼文加入書籤';
  const postBookMark = $(`<span class="bookmark" data-href="${postHref}">${text}</span>`);

  postBookMark.on('click', {postHref}, function() {
    const href = $(this).data('href');
    const wasBookmarked = checkWasBookmarked(href);
    // click to remove
    if (wasBookmarked) {
      postBookMark.text('將此則貼文加入書籤'); // optimistically updated
      chrome.runtime.sendMessage({type: 'remove_bookmark', id: wasBookmarked.id},
        ({removeSuccess, fbBookMarkList}) => {
          if (removeSuccess) {
            lastestFbBookMarkList = fbBookMarkList;
            console.log('lastestFbBookMarkList after removed', lastestFbBookMarkList);
          }
        });
      return false;
    }
    // click to open modal
    currentPostBookmark = $(this);
    console.log('currentPostBookmark', currentPostBookmark);
    modal.modal('show', {postHref});
  });
  return postBookMark;
}

function checkWasBookmarked(href) {
  const wasBookmarked = lastestFbBookMarkList.filter(b => b.url === href)[0];
  console.log('wasBookmarked', wasBookmarked);
  // wasBookmarked: {id: "*", url: "https://www.facebook.com/*/posts/*"}
  return wasBookmarked;
}

modal.on('show.bs.modal', function(event) {
  const postHref = event.relatedTarget ? event.relatedTarget.postHref : '';
  $(nameTextInput).val(postHref); // attach url on name first, then auto focus, let user edit.
});
/*
Due to how HTML5 defines its semantics, the autofocus HTML attribute has no effect in Bootstrap modals.
To achieve the same effect, use some custom JavaScript:
*/
modal.on('shown.bs.modal', function() {
  nameTextInput.focus();
});


addSubmitButton.on('click', function addSubmitHandler() {
  console.log('addSubmitHandler currentPostBookmark', currentPostBookmark);
  const url = $(currentPostBookmark).data('href');
  const parentId = folderSelect.val();
  const title = nameTextInput.val();
  console.log(url, parentId, title);
  if (title) {
    chrome.runtime.sendMessage({ type: 'add_bookmark', parentId, title, url},
      ({addSuccess, fbBookMarkList}) => {
        if (addSuccess) {
          lastestFbBookMarkList = fbBookMarkList;
          console.log('lastestFbBookMarkList after added', lastestFbBookMarkList);
        }
      });
    $(currentPostBookmark).text('移除書籤');
    modal.modal('hide');
  }
  nameTextInput.val('請給標籤一個名稱！');
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
