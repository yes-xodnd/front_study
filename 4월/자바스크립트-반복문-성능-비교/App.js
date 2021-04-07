import test from './test.js';
import fns from './iteration.js';

export default function App() {
  const root = document.querySelector('.app');
  const inputL = root.querySelector('#input-length');
  const inputN = root.querySelector('#input-count');
  const result = root.querySelector('.result');
  const buttonTest = root.querySelector('.button-test');
  const buttonClear = root.querySelector('.button-clear');

  inputL.addEventListener('keyup', onEvent);
  inputN.addEventListener('keyup', onEvent);
  buttonTest.addEventListener('click', onEvent);
  buttonClear.addEventListener('click', clearResult);

  function onEvent(e) {
    const L = inputL.value * 1;
    const N = inputN.value * 1;

    if (e.type === 'keyup' && e.key !== 'Enter') {
      return;
    }

    if (L < 100) {
      alert('L: 100 이상의 숫자를 입력할 수 있습니다.');
      return;
    }
    
    if (N < 1 || N > 300) {
      alert('N: 1이상, 300이하의 숫자를 입력할 수 있습니다.');
      return;
    }

    appendResult(L, N);
  }

  function appendResult(L, N) {
    const testResult = test({ fns, L, N });
    const table = createResultTable(testResult);
    const title = createHeading(L, N);
    
    const div = document.createElement('div');
    div.append(title, table);
    result.append(div);
  }

  function clearResult() {
    result.innerHTML = null;
  }
}

function createResultTable(result) {
  const table = document.createElement('table');
  const header = createTrDOMString(Object.keys(result[0]), 'th');
  const body = result.reduce((acc, item) => (
    acc + createTrDOMString(Object.values(item), 'td')
  ), '');

  table.innerHTML = header + body;
  return table;
}

function createTrDOMString(arr, tag) {
  const Tag = content => `<${tag}>${ content }</${tag}>`;
  return `
    <tr>${arr.reduce((acc, v) => acc + Tag(v), '')}</tr>
  `;
}

function createHeading(L, N) {
  const heading = document.createElement('h2');
  heading.innerText = 
    `length : ${L.toLocaleString('en-US')}
    count  : ${N}
  `;
  return heading;
}