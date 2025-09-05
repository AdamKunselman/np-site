import { URL } from '../_globals.js';

export function renderPageHeader() {
  addHTML();
  document.querySelector('.site-name').addEventListener('click', () => {
    window.location.href = `${URL}`;
  })
};

function addHTML () {
  const container = document.querySelector('.header');
  container.innerHTML = `
      <span class="site-name"><span class="yellow">parkdata</span>.io</span>
      <div class="search-container">
        <div class="search-wrap">
          <input id="search" class="search-input" type="text" placeholder="Search parks…" 
                role="combobox" aria-autocomplete="list" aria-expanded="false" 
                aria-controls="suggestions" aria-activedescendant="" autocomplete="off">
          <i class="fa-solid fa-magnifying-glass"></i>
          <div id="suggestions" class="suggestions" role="listbox" aria-hidden="true"></div>
        </div>
      </div>
  `
}