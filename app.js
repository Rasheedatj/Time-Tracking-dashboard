const navLink = document.querySelectorAll('#profile-nav a');
const nav = document.querySelector('#profile-nav');
let active = 'weekly';

nav.addEventListener('click', (e) => {
  e.preventDefault();

  if (e.target.classList.contains('navlink')) {
    navLink.forEach((link) => link.classList.remove('active'));
    e.target.classList.add('active');
    active = nav.querySelector('.active').innerText.toLowerCase();
    // re-fetch to update data with active
    fetchData();
  }
});

async function fetchData() {
  try {
    const res = await fetch('http://localhost:3000/events');
    if (!res.ok) throw new Error('Error fetching data');
    const data = await res.json();
    fix(data);
  } catch (error) {
    console.log(error);
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
