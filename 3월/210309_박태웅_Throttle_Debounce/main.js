main();

function main() {
  const input = document.querySelector('.search__input');
  const ul = document.querySelector('.search-keywords__list');
  const buttonThrottle = document.querySelector('.search-option__button-throttle');  
  const buttonDebounce = document.querySelector('.search-option__button-debounce');
  const text = document.querySelector('.search-option__text');

  const timeDiffStamp = createTimeDiffStamp();

  input.onkeyup = handleInputKeyup;
  buttonThrottle.onclick = handleButtonThrottle;
  buttonDebounce.onclick = handleButtonDebounce;

  function handleButtonThrottle() {
    input.onkeyup = throttle(handleInputKeyup);
    text.innerText = 'throttle: 최소한의 일정한 시간 간격을 두고 콜백을 실행합니다.';
  };

  function handleButtonDebounce() {
    input.onkeyup = debounce(handleInputKeyup);
    text.innerText = 'debounce: 연속된 입력 중 마지막 입력에 대해서만 콜백을 실행합니다.';
  }

  function handleInputKeyup(e) {
    appendKeyword(ul, e.target.value, timeDiffStamp());
  }

  function createTimeDiffStamp() {
    let last;

    return () => {
      const now = (new Date).getTime();
      if (!last) {
        last = now;
        return 0;
      }
      
      const diff = now - last;
      last = now;

      return diff;
    }
  }

  function appendKeyword(target, keyword, timeDiff) {
    if (!keyword) return;
    target.insertAdjacentHTML(
      'afterbegin',
      `<li class="search-keywords__list-item">
        <div>${keyword}</div>
        ${timeDiff}ms
      </li>`
    );
  }
}


function debounce(callback, t = 200) {
  let timer;
  return e => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => callback(e), t);
  }
}

function throttle(callback, t = 200) {
  let timer;
  return e => {
    if (!timer) {
      timer = setTimeout(() => {
        callback(e);
        timer = null;
      }, t);
    }
  }
}