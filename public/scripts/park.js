import { URL } from '../_globals.js';
import { formatParkName } from './utils/format.js';

const params = new URLSearchParams(window.location.search);
const parkName = params.get('parkName')
const defaultImg = '/img/default.png'
console.log(parkName);
let parkData;
let activityNames;
let activitiesSelected = JSON.parse(localStorage.getItem('selected')) || ['Total_Visitors', 'Tent_Camping', 'RV_Camping', 'Backcountry_Camping'];

const activityIndexMap = {
        Total_Visitors: 0,
        Private_Camping: 1,
        Private_Lodging: 2,
        Tent_Camping: 3,
        RV_Camping: 4,
        Backcountry_Camping: 5
      };

fetchParkData(parkName);

let dataSet2024;
let chartInstance;

document.querySelector('.site-name').addEventListener('click', () => {
  window.location.href = `${URL}`;
})

function renderPage() {
  const {parkName, parkType, region, state, description, url, images} = parkData;

  if(!parkName || !parkType || !region || !state) {
    console.log('ERROR: Some essential park data not passed');
  }

  //Populate basic Park Info fields
  document.querySelector('.js-park-name').innerHTML = formatParkName(parkName);
  document.querySelector('.js-park-type').innerHTML += parkType;
  document.querySelector('.js-region').innerHTML += region;
  document.querySelector('.js-state').innerHTML += state;
  
  if(description){
    document.querySelector('.js-park-summ').innerHTML +=  description;
  } else {
    document.querySelector('.js-park-summ').innerHTML +=  'No description available';
  }
  if(url){
    const container = document.querySelector('.summary-info-container');

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'View Official Site';
    btn.className = 'more-info';
    btn.addEventListener('click', () => {
      window.open(url, '_blank', 'noopener,noreferrer')
    });

    container.appendChild(btn); 
  }
  // Render Image
  const container = document.querySelector('.img-container');
  let source = defaultImg;
  if(images){
    source = images[0].url;
  }
  const img = document.createElement('img');
  img.type = 'img';
  img.className = 'park-img';
  img.src = source;
  container.appendChild(img);
  if(images){
    const credit = document.createElement('span');
    credit.type = 'span';
    credit.className = 'credit-text';
    credit.textContent = `Photo credit: ${images[0].credit}`;
    container.appendChild(credit);
  }
  
  //transform data for ChartJS
  dataSet2024 = transformForChartJS(parkData.visitData, '2024');
  const selectedDataSets = [];
  activitiesSelected.forEach((activity) => {
    selectedDataSets.push(dataSet2024.datasets[activityIndexMap[activity]]);
  })
  // const dataSetsToDisplay = [dataSet2024.datasets[0], dataSet2024.datasets[3], dataSet2024.datasets[4], dataSet2024.datasets[5]]

  // Create other page elements
  createActivitySelector()

  // Reveal all page elements
  document.body.classList.remove('hidden');

  // Render chart with Visitor Data
  renderChart(selectedDataSets);

  // Subscribe identifier buttons
  subscribeIdentButtons();
}

async function fetchParkData(parkName) {
  try {
    const response = await fetch(`${URL}/api/v1/parkdata/${decodeURIComponent(parkName)}`);
    const data = await response.json();
    console.log('Data fetched')
    parkData = data;
    if(data){
      renderPage();
    } else {
      console.log('Failed to render page.');
      //renderErrorPage();
    }
    
  } catch (error) {
    console.log(error);
  }
  
};

function transformForChartJS(visitData, year) {
  const months = Object.keys(visitData[year]).sort((a, b) => a - b);
  
  // Initialize datasets for each activity
  activityNames = Object.keys(visitData[year][months[0]]);
  const activityColorMap = {
    Total_Visitors: "#11251F",
    Private_Camping: "#FF4365",
    Private_Lodging: "#00D9C0",
    Tent_Camping: "#FFD93D",
    RV_Camping: "#7D5BA6",
    Backcountry_Camping: "#F63E02"
  };

  const datasets = activityNames.map(name => ({
    label: name.replace(/_/g, ' '),
    data: [],
    borderColor: activityColorMap[name],
    backgroundColor: activityColorMap[name].replace(')', ', 0.5)'),
    fill: false
  }));

  // Fill in the data
  months.forEach(month => {
    const monthData = visitData[year][month];
    
    activityNames.forEach((activity, idx) => {
      datasets[idx].data.push(monthData[activity]);
    });
  });

  return {
    labels: months,
    datasets,
  };
}

function createActivitySelector() {
  const container = document.querySelector('.js-dropdown-content');

  activityNames.forEach((activity) => {
    let checked = '';
    activitiesSelected.forEach((a) => {
      if (activity === a) {
        checked = ' checked';
      }
    })
    // let checked = ' checked';
    // if(activity === 'Private_Camping' || activity === 'Private_Lodging'){
    //   checked = ''
    // }
    container.innerHTML += `
    <label><input type="checkbox" value="${activity}" ${checked}> ${activity.replace(/_/g, ' ')}</label>
    `
  })

  const dropbtn = document.querySelector(".dropbtn");
  const dropdown = document.querySelector(".dropdown");
  const checkboxes = dropdown.querySelectorAll("input[type='checkbox']");
  const selectedSpan = document.getElementById("selected-values");

  // Toggle dropdown
  dropbtn.addEventListener("click", () => {
    dropdown.classList.toggle("show");
  });

  // Update selected values
  checkboxes.forEach(cb => {
    cb.addEventListener("change", () => {
      const selected = Array.from(checkboxes)
        .filter(c => c.checked)
        .map(c => c.value);
      const dataSetsToDisplay = [];
      selected.forEach((activity) => {
        const index = activityIndexMap[activity];
        if(index !== undefined){
          dataSetsToDisplay.push(dataSet2024.datasets[index])
        }
      });
      chartInstance.data.datasets = dataSetsToDisplay;
      chartInstance.update();

      activitiesSelected = selected;
      localStorage.setItem('selected', JSON.stringify(activitiesSelected));
    });
  });

  // Close dropdown if clicking outside
  window.addEventListener("click", e => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("show");
    }
  });
}

function renderChart(dataSetsToDisplay) {
  const ctx = document.getElementById('chart');

  // Destroy old chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Create new chart
  chartInstance = new Chart (ctx, {
      type: 'line',
      data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: dataSetsToDisplay
          },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                boxWidth: 10,   
                boxHeight: 10,  
                padding: 15
        }
      }
    }
      }
  });
}

function subscribeIdentButtons() {
  document.querySelectorAll('.js-identifier-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const queryText = btn.innerHTML.replace(/ /g, '+');
      console.log(queryText);
      console.log(btn.dataset);
      window.location.href = `${URL}/list/?${btn.dataset.key}=${queryText}`
    })
  })
}
    