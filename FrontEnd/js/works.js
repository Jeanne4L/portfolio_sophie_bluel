let gallery = document.querySelector('.gallery');

// Get and display works from API
let works = localStorage.getItem('works');

if (works !== null) {
    works = JSON.parse(works);
    displayWorks(works);
} else {
    getWorks();
    displayWorks(works);
}


async function getWorks() {
    let res = await fetch('http://localhost:5678/api/works');
    let works = await res.json();
    works = JSON.stringify(works);

    localStorage.setItem('works', works);
}

function displayWorks(works) {
    for( let i=0; i<works.length; i++) {
        const figure = document.createElement('figure');
        gallery.appendChild(figure);

        const img = document.createElement('img');
        img.src = works[i].imageUrl;
        img.alt = works[i].title;
        figure.appendChild(img);

        const figcaption = document.createElement('figcaption');
        figcaption.innerText = works[i].title;
        figure.appendChild(figcaption);
    }
}

// Sort works with filters
let allProjectsBtn = document.querySelector('.all-btn');
allProjectsBtn.addEventListener('click', () => {    
    gallery.innerHTML = '';
    displayWorks(works);

    removeActiveClass()
    allProjectsBtn.classList.add('active');
})
let objectsBtn = document.querySelector('.objects-btn');
sortWorks(objectsBtn, 'Objets');

let apartmentsBtn = document.querySelector('.apartments-btn');
sortWorks(apartmentsBtn, 'Appartements');

let hotelsBtn = document.querySelector('.hotels-btn');
sortWorks(hotelsBtn, 'Hotels & restaurants');

function sortWorks( btn, category) {
    btn.addEventListener('click', () => {
        let sortWorks = works.filter(works => works.category.name == category);
        gallery.innerHTML = '';
        displayWorks(sortWorks);
    
        removeActiveClass()
        btn.classList.add('active');
    })
}

function removeActiveClass() {
    let filtersBtns = document.querySelectorAll('.filters-btn');
    for( let i=0; i<filtersBtns.length; i++) {
        filtersBtns[i].classList.remove('active')
    }
}

let connexionParams = new URLSearchParams(document.location.search);
let connexionStatus = connexionParams.get('connected');

if(connexionStatus === '1') {
    let updateBtns = document.querySelectorAll('.update-btn');
    
    for( let i=0; i<updateBtns.length; i++) {
        updateBtns[i].classList.remove('hidden')
    }
}