import { renderPageHeader } from './pageHeader.js';
import { renderPageFooter } from './pageFooter.js';
import { URL } from '../_globals.js';
import { getUrlParam, fetchData } from './utils/generic.js';
import { getStateName } from './utils/format.js';

const cardContainer = document.querySelector('.card-cont');

const query = getUrlParam('query')

const queryMap = {
  types: 'Park Types',
  states: 'State',
  regions: 'Region'
}

const queryIdentMap = {
  types: 'parkType',
  states: 'state',
  regions: 'region'
}

renderPageHeader();
renderPage();
renderPageFooter();

async function renderPage() {
  try {
    const data = await fetchData(`/api/v1/info/category/${query}`);
    if(data) {
      data.forEach((value) => {
        addCard(value);
      })
    }
    document.querySelectorAll('.card').forEach((card) => {
      card.addEventListener('click', ()=>{
        const id = card.dataset.id;
        console.log(id);
        window.open(`${URL}/list?${encodeURIComponent(queryIdentMap[query])}=${id}`, '_self');
      })
    })

    document.querySelector('.browse').innerHTML += 
    `<span class="yellow">${(queryMap[query]).replace("+", " ")} ...</span>`
  } catch (error) {
    console.log(error)
  }
}

function addCard(value) {
  if(value.name){
    let parks = 'park'
    if(value.count > 1){
      parks = 'parks'
    }
    let name = value.name
    if (query === 'states') {
      name = getStateName(name);
    }
    cardContainer.innerHTML += `
    <div class="card" data-id="${value.name}">
        <span class="cat-name">${name}</span>
        <span class="cat-count">${value.count} ${parks}</span>
      </div>
    `
  }
  
}

