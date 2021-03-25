const URL = 'https://api.thecatapi.com/v1/images/search/';

function onClick() {
  console.log('init fetch...');

  fetch(URL)
  .then(response => {
    console.log(response.constructor);
    console.log('status:' + response.status);
    console.log(response);
    const x = response.json();
    return x;
  })
  .then(result => {
    console.log(result);
  });
}

function main() {
  document
  .querySelector('#fetch')
  .addEventListener('click', onClick);
}

main();