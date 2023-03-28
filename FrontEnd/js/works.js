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
checkConnectStatus();

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
    document.querySelectorAll('.filters-btn').forEach(btn => {
        btn.classList.remove('active')
    })
}

function updateIndexPage() {
    checkConnectStatus();
}
function checkConnectStatus() {
    let connexionParams = new URLSearchParams(document.location.search);
    let connexionStatus = connexionParams.get('connected');

    if(connexionStatus === '1') {
        displayHiddenEls()
    }
}

updateIndexPage()

function displayHiddenEls() {
    document.querySelectorAll('.update-btn').forEach(btn => {
        btn.classList.remove('hidden');
        btn.addEventListener('click', () => {
            let modal = document.querySelector('#modal');
            let overlay = document.querySelector('.overlay');

            modal.classList.remove('hidden');
            overlay.classList.remove('hidden');

            document.querySelector('.js-close-modal').addEventListener('click', () => { 
                modal.classList.add('hidden');
                overlay.classList.add('hidden'); 
            });
            overlay.addEventListener('click', () => {   
                modal.classList.add('hidden');
                overlay.classList.add('hidden'); 
            }); 
        })
    })
}

function displayModalGallery() {
    for( let i=0; i<works.length; i++) {
        document.querySelector('.modal__gallery').innerHTML += `
        <figure>
            <a href="${works[i].imageUrl}">
                <img src="${works[i].imageUrl}" alt="${works[i].title}"}>
            </a>
            <figcaption>
                <span class="modal__icons">                
                    <i class="fa-solid fa-arrows-up-down-left-right grow-up"></i>
                    <i class="fa-regular fa-trash-can"></i>
                </span>
                <button>éditer</button>
            </figcaption>
        </figure>`
    }           
}
displayModalGallery()
