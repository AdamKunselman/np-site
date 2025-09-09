import { URL } from '../_globals.js';
import { renderPageFooter } from './pageFooter.js';

document.querySelectorAll('.category-btn').forEach((btn) => {
  btn.addEventListener('click',()=>{
    console.log(btn.dataset.category);
    window.open(`${URL}/category?query=${btn.dataset.category}`, '_self');
  })
})

renderPageFooter();