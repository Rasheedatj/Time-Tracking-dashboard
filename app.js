const navLink = document.querySelectorAll('#profile-nav a');
const nav = document.querySelector('#profile-nav');
const loader = document.querySelector('.loader');
const errorMsg = document.querySelector('.error');
let active = 'weekly';

nav.addEventListener('click', (e) => {
  e.preventDefault();

  if (e.target.classList.contains('navlink')) {
    // highlight active navlink
    navLink.forEach((link) => link.classList.remove('active'));
    e.target.classList.add('active');

    // update active and refetch data
    active = nav.querySelector('.active').innerText.toLowerCase();
    fetchData();
  }
});

async function fetchData() {
  try {
    // clear error message before fetching
    errorMsg.classList.remove('active');
    loader.classList.add('active');

    // fetch data
    const res = await fetch(
      'https://my-json-server.typicode.com/Rasheedatj/Time-Tracking-dashboard/events'
    );
    if (!res.ok) throw new Error('Error fetching data, pls try again!');
    const data = await res.json();

    // remove loader and display
    loader.classList.remove('active');
    fix(data);
  } catch (error) {
    // remove loader and display error message
    loader.classList.remove('active');
    errorMsg.classList.add('active');
    errorMsg.innerText = error;
  }
}

function fix(data) {
  // clear previous boxes to avoid duplicates
  document.querySelectorAll('.dynamic-box').forEach((box) => box.remove());

  data.forEach((item) => {
    let hrs;
    let last;
    if (active === 'weekly') {
      hrs = item.timeframes.weekly.current;
      last = item.timeframes.weekly.previous;
    } else if (active === 'monthly') {
      hrs = item.timeframes.monthly.current;
      last = item.timeframes.monthly.previous;
    } else if (active === 'daily') {
      hrs = item.timeframes.daily.current;
      last = item.timeframes.daily.previous;
    }

    // create section html and append to container
    const section = document.createElement('section');
    section.className = 'box dynamic-box';
    section.innerHTML = `
  <div class="event ">
   
  </div>

  <div class="article">
    <nav>
      <p>${item.title}</p>
      <img src="./images/icon-ellipsis.svg" alt="option">
    </nav>

    <time>
      <h1>${hrs}hrs</h1>
      <p>Last ${
        active === 'daily' ? 'day' : active === 'weekly' ? 'week' : 'month'
      } - ${last}hrs</p>
    </time>
  </div>
`;

    document.querySelector('.container').appendChild(section);
  });
}

fetchData();
