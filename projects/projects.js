import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');
const title = document.querySelector('.projects-title');
title.textContent = `${projects.length} Projects`;

let query = '';
let selectedIndex = -1; 
let currentProjects = projects;

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  
  if (newData.length === 0) {
    let svg = d3.select('#projects-pie-plot');
    svg.selectAll('path').remove();
    let legend = d3.select('.legend');
    legend.html('');
    return;
  }
  
  let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => newArcGenerator(d));
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  let svg = d3.select('#projects-pie-plot');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.html('');

  newArcs.forEach((arc, i) => {
    svg
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        
        svg.selectAll('path').attr('class', (_, idx) => 
          selectedIndex === idx ? 'selected' : ''
        );
        
        legend.selectAll('li').attr('class', (_, idx) => 
          selectedIndex === idx ? 'legend-item selected' : 'legend-item'
        );
        
        if (selectedIndex === -1) {
            renderProjects(currentProjects, projectsContainer, 'h2');
        } else {
            let selectedYear = newData[selectedIndex].label;
            let filteredByYear = currentProjects.filter((project) => 
                project.year === selectedYear);
            renderProjects(filteredByYear, projectsContainer, 'h2');
        }
      });
  });
  
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', selectedIndex === idx ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        
        svg.selectAll('path').attr('class', (_, i) => 
          selectedIndex === i ? 'selected' : ''
        );
        
        legend.selectAll('li').attr('class', (_, i) => 
          selectedIndex === i ? 'legend-item selected' : 'legend-item'
        );
        
        if (selectedIndex === -1) {
            renderProjects(currentProjects, projectsContainer, 'h2');
        } else {
            let selectedYear = newData[selectedIndex].label;
            let filteredByYear = currentProjects.filter((project) => 
                project.year === selectedYear);
            renderProjects(filteredByYear, projectsContainer, 'h2')
        }
      });
  });
}

renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');
if (searchInput) {
  searchInput.addEventListener('change', (event) => {
    selectedIndex = -1;  // Reset selection when searching
    query = event.target.value;
    currentProjects = projects.filter((project) => {
      let values = Object.values(project).join('\n').toLowerCase();
      return values.includes(query.toLowerCase());
    });
    renderProjects(currentProjects, projectsContainer, 'h2');
    renderPieChart(currentProjects);
  });
}