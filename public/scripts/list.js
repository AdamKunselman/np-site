import { renderPageHeader } from './pageHeader.js';
import { renderPageFooter } from './pageFooter.js';
import { fetchData } from './utils/generic.js';
import { getStateName } from './utils/format.js';
import { URL } from '../_globals.js';

let category;
let categoryValue;
setCategoryAndValue();

renderPageHeader();
await renderPage();
renderPageFooter();

async function renderPage() {
  setH1Content();
  try {
    const data = await fetchData(`/api/v1/list?${category}=${categoryValue}`);
    console.log(data);
    if(data){
      populateContent(data);
    }
  } catch (error) {
    console.log(error);
  }
  
}

function populateContent(data){
  const container = document.querySelector('.park-cont');
  data.forEach((park) => {
    let imgUrl = "../img/default.png";
    if(park.webImages){
      imgUrl = park.webImages.small; 
    }
    container.innerHTML += `
      <div class="park-card" data-name="${park.parkName}">
        <img class="park-img" src="${imgUrl}" loading="lazy">
        <div class="name-cont"><span class="park-name">${park.parkName}</span></div>
        <span class="park-type">${park.parkType}</span>
        <span class="region-state">${park.region}, ${park.state}</span>
      </div>
    `
  });
  document.querySelectorAll('.park-card').forEach((card)=>{
    card.addEventListener('click', ()=>{
      console.log(card.dataset.name);
      window.open(`${URL}/park/?parkName=${card.dataset.name}`, '_self');

    })
  })
}

function setCategoryAndValue() {
  const params = new URLSearchParams(window.location.search);
  const expectedParams = ['parkType', 'state', 'region']
  if(expectedParams){
    expectedParams.forEach((p) => {
    if(params.has(p)){
      category = p
      categoryValue = params.get(p);
    }
  })
  } else {
    console.log('ERROR: Unexpected param passed in URL');
  }
  
}

function setH1Content() {
  console.log(category);
  const contentMap = {
    parkType: `Viewing all <span class=yellow>${categoryValue}s</span> ...`,
    state: `Viewing all parks in the state of <span class=yellow>${getStateName(categoryValue)}</span> ...`,
    region: `Viewing all parks in the <span class=yellow>${categoryValue}</span> region ...`
  }


  document.querySelector('.listing').innerHTML=`
  ${contentMap[category]}
  `
}