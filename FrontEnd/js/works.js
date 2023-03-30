let gallery = document.querySelector('.gallery');

// Get and display works from API
let works = JSON.parse(localStorage.getItem('works'));

if (works !== null) {
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
        let figure = document.createElement('figure');
        gallery.appendChild(figure);

        let img = document.createElement('img');
        img.src = works[i].imageUrl;
        img.alt = works[i].title;
        figure.appendChild(img);

        let figcaption = document.createElement('figcaption');
        figcaption.innerText = works[i].title;
        figure.appendChild(figcaption);
    }
}

// Sort works with filters buttons
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

// update index page if connected
function checkConnectStatus() {
    let connexionParams = new URLSearchParams(document.location.search);
    let connexionStatus = connexionParams.get('connected');

    if(connexionStatus === '1') {
        displayHiddenEls()
    }
}
function displayHiddenEls() {
    let editBtn = document.querySelector('.edit-bar');
    editBtn.classList.remove('hidden');
    editBtn.addEventListener('click', () => {
        gallery.innerHTML = '';
        displayWorks(works);
    })

    document.querySelectorAll('.update-btn').forEach(btn => {
        btn.classList.remove('hidden');
        btn.addEventListener('click', () => {
            let modal = document.querySelector('#modal');
            let overlay = document.querySelector('.overlay');

            openModal(modal, overlay);
        })
    })
    let modalContainer = document.querySelector('.modal__container');

    displayFirstModalContent(modalContainer);
}
function openModal(modal, overlay) {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');

    document.querySelector('.js-close-modal').addEventListener('click', () => { 
        closeModal(modal, overlay);
    });
    overlay.addEventListener('click', () => {   
        closeModal(modal, overlay);
    }); 
}
function closeModal(modal, overlay) {
    modal.classList.add('hidden');
    overlay.classList.add('hidden'); 
}

function displayFirstModalContent(modalContainer) {
    let modalGallery = document.createElement('div');
    modalGallery.classList.add('modal__gallery');
    modalContainer.appendChild(modalGallery);

    displayModalGallery(modalGallery);

    let hr = document.createElement('hr');
    modalContainer.appendChild(hr);

    let btnsDiv = document.createElement('div');
    btnsDiv.classList.add('modal__btns');
    modalContainer.appendChild(btnsDiv);

    let addBtn = document.createElement('button');
    addBtn.classList.add('btn');
    addBtn.id = 'add';
    addBtn.textContent = 'Ajouter une photo';
    btnsDiv.appendChild(addBtn);

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('alert');
    deleteBtn.id = 'delete-all';
    deleteBtn.textContent = 'Supprimer la galerie';
    btnsDiv.appendChild(deleteBtn);

    updateModalContent(modalContainer);
    deleteAllProjects();
}
function displayModalGallery(modalGallery) {
    for( let i=0; i<works.length; i++) {
        let figure = document.createElement('figure');
        figure.setAttribute('data-id', works[i].id);
        modalGallery.appendChild(figure);

        let img = document.createElement('img');
        img.src = works[i].imageUrl;
        img.alt = works[i].title;
        figure.appendChild(img);

        let figcaption = document.createElement('figcaption');
        figure.appendChild(figcaption);

        let span = document.createElement('span');
        span.classList.add('modal__icons');
        figcaption.appendChild(span);

        let a = document.createElement('a');
        a.href = works[i].imageUrl;
        span.appendChild(a);

        let growUp = document.createElement('i');
        growUp.classList.add('fa-solid', 'fa-arrows-up-down-left-right', 'grow-up');
        a.appendChild(growUp);

        let deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-regular', 'fa-trash-can', 'delete-icon');
        span.appendChild(deleteIcon);

        let editBtn = document.createElement('button');
        editBtn.textContent = 'éditer';
        figcaption.appendChild(editBtn);
    }
    deleteProject();   
}

//  Delete projects
function deleteProject() {
    let deleteBtns = document.querySelectorAll('.delete-icon');

    for( let i=0; i<deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', () => {
            let datasetId = Number(deleteBtns[i].closest('[data-id]').dataset.id)

            deleteToAPI(datasetId);
        })
    }
}
function deleteToAPI(datasetId) {
    fetch(`http://localhost:5678/api/works/${datasetId}`, {
        method: 'DELETE',
        headers: {  
            'Authorization': `Bearer ${localStorage.getItem('token')}` 
        } 
    })
    .then(function(res) {
        if(res.ok) {
            deleteToLocalStorage(datasetId);

            document.querySelector('.modal__gallery').innerHTML = '';
            works = JSON.parse(localStorage.getItem('works'));
            displayModalGallery();
        }
    })
}
function deleteToLocalStorage(datasetId) {
    works = works.filter(works => works.id !== datasetId);
    localStorage.setItem('works', JSON.stringify(works));
}
function deleteAllProjects() {
    let deleteAllBtn = document.querySelector('#delete-all');
    deleteAllBtn.addEventListener('click', () => {
        for(let i=0; i<works.length; i++) {
            let datasetId = Number(works[i].id);

            deleteToAPI(datasetId);
        }
    })
}

// Add project
function updateModalContent(modalContainer) {
    document.querySelector('#add').addEventListener('click', () => {

        let h3 = document.querySelector('.modal__title');
        h3.textContent = 'Ajout photo';

        modalContainer.innerHTML = '';

        let form = document.createElement('form');
        modalContainer.appendChild(form);

        let photoContainer = document.createElement('div');
        photoContainer.classList.add('add-photo__container');
        form.appendChild(photoContainer);
        
        let i = document.createElement('i');
        i.classList.add('fa-regular', 'fa-image');
        photoContainer.appendChild(i);

        let btnsContainer = document.createElement('div');
        btnsContainer.classList.add('add-photo__buttons');
        photoContainer.appendChild(btnsContainer);

        let fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.name = 'project-photo';
        fileInput.id = 'project-photo';
        fileInput.classList.add('hidden-add-btn');
        btnsContainer.appendChild(fileInput);

        let btn = document.createElement('button');
        btn.classList.add('front-add-btn');
        btn.textContent = '+ Ajouter photo';
        btnsContainer.appendChild(btn);

        let p = document.createElement('p');
        p.textContent = 'jpg, png : 4mo max';
        photoContainer.appendChild(p);

        let titleLabel = document.createElement('label');
        titleLabel.textContent = 'Titre';
        titleLabel.for = 'title';
        form.appendChild(titleLabel);

        let titleInput = document.createElement('input');
        titleInput.type = 'text';
        titleInput.name = 'title';
        titleInput.required = true;
        titleInput.id = 'title';
        form.appendChild(titleInput);

        let categoryLabel = document.createElement('label');
        categoryLabel.textContent = 'Catégorie';
        categoryLabel.for = 'category';
        form.appendChild(categoryLabel);

        let categorySelect = document.createElement('select');
        categorySelect.name = 'category';
        categorySelect.required = true;
        categorySelect.id = 'category';
            let nullOption = document.createElement("option");
            nullOption.selected = true;
            nullOption.disabled = 'disabled' ;
            nullOption.text = 'Sélectionner une catégorie';
            categorySelect.add(nullOption);

            fetchCategories();
            let categories = JSON.parse(localStorage.getItem('categories'));

            for( let i=0; i<categories.length; i++) {
                let option = document.createElement("option");
                option.value = categories[i].id;
                option.text = categories[i].name;
                categorySelect.add(option);
            }
        form.appendChild(categorySelect);

        let hr = document.createElement('hr');
        modalContainer.appendChild(hr);

        let submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        submitBtn.classList.add('btn', 'inactive-btn')
        submitBtn.value = 'Valider';
        modalContainer.appendChild(submitBtn);

        let prevArrow = document.querySelector('.js-prev-arrow');
        prevArrow.style.opacity = '1';
        prevArrow.addEventListener('click', () => {
            modalContainer.innerHTML = '';
            displayFirstModalContent(modalContainer);
        })
    })
}
async function fetchCategories() {
    let res = await fetch('http://localhost:5678/api/categories');
    let categories = await res.json();
    categories = JSON.stringify(categories);

    localStorage.setItem('categories', categories);
}

// localStorage.clear()