console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// const navLinks = $$("nav a");

// let currentLink = navLinks.find(
//   (a) => a.host === location.host && a.pathname === location.pathname,
// );

// currentLink?.classList.add('current');

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";         // GitHub Pages repo name
  

let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'contact/', title: 'Contact' },
  { url: 'resume/', title: 'Resume' },
  { url: "https://github.com/jjessicalu", title: "GitHub" }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
  let url = p.url;
  url = !url.startsWith('http') ? BASE_PATH + url : url;

  let title = p.title;

  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  if (a.host === location.host && a.pathname === location.pathname) {
  a.classList.add('current');
  }
  if (a.host !== location.host) {
    a.target = "_blank";
  }
  nav.append(a);  
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>  
		</select>
	</label>`,
);

function setColorScheme(colorScheme) {
  document.documentElement.style.setProperty('color-scheme', colorScheme);
}

let select = document.querySelector(".color-scheme select")
select.addEventListener('input', function (event) {
  setColorScheme(localStorage.colorScheme = event.target.value);
  localStorage.colorScheme = event.target.value
  // console.log('color scheme changed to', event.target.value);
  // document.documentElement.style.setProperty('color-scheme', event.target.value);
});

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
  select.value = localStorage.colorScheme;
}

let form = document.querySelector('form');
form?.addEventListener('submit', function (event) {event.preventDefault();
  let data = new FormData(form);
  let url = form.action + "?";
  let params = [];
  for (let [name, value] of data) {
    params.push(`${name}=${encodeURIComponent(value)}`)
  console.log(name, value);
}
  url += params.join('&');
  location.href = url;

})

export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  if (!containerElement) return;
  containerElement.innerHTML = '';
  for (let project of projects) {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <div class = "project-info">
        <p>${project.description}</p>
        <p class = "project-year">${project.year}</p>
      </div>
    `;
    containerElement.appendChild(article);
  }
}
 
export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}