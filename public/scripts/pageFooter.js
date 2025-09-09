import { URL } from '../_globals.js';

export function renderPageFooter() {
  addHTML();
}

function addHTML () {
  const container = document.querySelector('.footer');
  container.innerHTML = `
  <div class="footer-content">
    <a class="footer-link" href="${`${URL}/about`}" data-content="about">About</a>
    <a class="footer-link" href="${`${URL}/terms`}" data-content="tos">Terms of Use</a>
    <a class="footer-link" href="${`${URL}/privacy`}" data-content="privacyPolicy">Privacy Policy</a>
    <p class="copyright-info">Copyright © 2025 Atomware LLC</p>
    <p class="disclaimer">Park visitor data, general information, and photos provided by National Park Service. This website is not produced, endorsed, supported, or affiliated with The National Park Service.</p>
  </div>
  `
}