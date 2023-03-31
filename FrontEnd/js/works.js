let gallery = document.querySelector('.gallery');

// DISPLAY PROJECTS FROM API 
let works = JSON.parse(localStorage.getItem('works'));
if (works !== null) {
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

// FILTER PROJECTS
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

// UPDATE INDEX PAGE IF CONNECTED
let connexionParams = new URLSearchParams(document.location.search);
let connexionStatus = connexionParams.get('connected');

if(connexionStatus === '1') {
    fetchCategories();
    displayHiddenEls();
}
async function fetchCategories() {
    let res = await fetch('http://localhost:5678/api/categories');
    let categories = await res.json();
    categories = JSON.stringify(categories);

    localStorage.setItem('categories', categories);
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
            let isOpenedGalleryModal = false;

            let addProjectModal = document.querySelector('#modal--add');
            let isOpenedAddModal = false;

            let overlay = document.querySelector('.overlay');

            openFirstModal(modal, isOpenedGalleryModal, addProjectModal, isOpenedAddModal, overlay);
        })
    })
}
function openModal(modalToOpen, isOpenedCurrentModal, otherModal, isOpenedOtherModal, overlay) {
    modalToOpen.classList.remove('hidden');
    if(overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
    }

    isOpenedCurrentModal = true;
    isOpenedOtherModal = false;

    closeModal(modalToOpen, isOpenedCurrentModal, otherModal, isOpenedOtherModal, overlay);
}
function closeModal(modalToClose, isOpenedCurrentModal, otherModal, isOpenedOtherModal, overlay) {
    document.querySelectorAll('.js-close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal(modalToClose, isOpenedCurrentModal, otherModal, isOpenedOtherModal, overlay);
        })
    })
    overlay.addEventListener('click', () => {   
        hideModal(modalToClose, isOpenedCurrentModal, otherModal, isOpenedOtherModal, overlay);
    }); 
}
function hideModal(modalToClose, isOpenedCurrentModal, otherModal, isOpenedOtherModal, overlay) {
    if(isOpenedCurrentModal === true ) {
        modalToClose.classList.add('hidden');
        isOpenedOtherModal = false;
    } else if(otherModal === true ){
        isOpenedOtherModal.classList.add('hidden');
        isOpenedCurrentModal = false;
    }
    overlay.classList.add('hidden'); 
}

function openFirstModal(modal, isOpenedGalleryModal, addProjectModal, isOpenedAddModal, overlay) {
    openModal(modal, isOpenedGalleryModal, addProjectModal, isOpenedAddModal, overlay);

    document.querySelector('#add').addEventListener('click', () => {
        modal.classList.add('hidden');
        openAddModal(modal, isOpenedGalleryModal, addProjectModal, isOpenedAddModal, overlay);
        // // displayUploadFile();
    })
}
function openAddModal(modal, isOpenedGalleryModal, addProjectModal, isOpenedAddModal, overlay) {
    openModal(addProjectModal, isOpenedAddModal, modal, isOpenedGalleryModal, overlay);

    console.log(isOpenedAddModal)
    let prevArrow = document.querySelector('.js-prev-arrow');
    prevArrow.addEventListener('click', () => {
        addProjectModal.classList.add('hidden');
        openFirstModal(modal, isOpenedGalleryModal, addProjectModal, isOpenedAddModal, overlay);
    })
}



// function createFirstModalContent(modalContainer) {

//     displayModalGallery();

//     document.querySelector('#add').addEventListener('click', () => {
//         createAddModalContent(modalContainer);
//         displayUploadFile();
//     })
//     deleteAllProjects();
// }
function displayModalGallery() {
    for( let i=0; i<works.length; i++) {
        let modalGallery = document.querySelector('.modal__gallery');
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

//  DELETE PROJECT
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

// ADD PROJECT
function createAddModalContent(modalContainer) {
    let h3 = document.querySelector('.modal__title');
    h3.textContent = 'Ajout photo';

    modalContainer.innerHTML = '';

    let form = document.createElement('form');
    form.id = 'add-form';
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
    fileInput.accept = 'image/png, image/jpg'
    fileInput.required = 'true';
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
    titleInput.id = 'title';
    titleInput.required = 'true';
    form.appendChild(titleInput);

    let categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Catégorie';
    categoryLabel.for = 'category';
    form.appendChild(categoryLabel);

    let categorySelect = document.createElement('select');
    categorySelect.name = 'category';
    categorySelect.required = 'true';
    categorySelect.id = 'category';
        let nullOption = document.createElement("option");
        nullOption.value = null;
        nullOption.selected = 'true';
        nullOption.disabled = 'disabled' ;
        nullOption.text = 'Sélectionner une catégorie';
        categorySelect.add(nullOption);

        let categories = JSON.parse(localStorage.getItem('categories'));

        for( let i=0; i<categories.length; i++) {
            let option = document.createElement("option");
            option.value = categories[i].id;
            option.text = categories[i].name;
            categorySelect.add(option);
        }
    form.appendChild(categorySelect);

    let hr = document.createElement('hr');
    form.appendChild(hr);

    let submitBtn = document.createElement('input');
    submitBtn.type = 'submit';
    submitBtn.disabled = 'true';
    submitBtn.id = 'submit-btn';
    submitBtn.classList.add('btn', 'inactive-btn')
    submitBtn.value = 'Valider';
    form.appendChild(submitBtn);

    let prevArrow = document.querySelector('.js-prev-arrow');
    prevArrow.style.opacity = '1';
    prevArrow.addEventListener('click', () => {
        modalContainer.innerHTML = '';
        createFirstModalContent(modalContainer);
    })
}


function displayUploadFile() {
    document.querySelector('#project-photo').addEventListener('change', () => {
        let photoContainer = document.querySelector('.add-photo__container');

        let file = document.querySelector('#project-photo').files[0];

        if(file.size > '4194304') {
            let p = document.createElement('p');
            p.textContent = 'L\'image sélectionnée est trop lourde';
            p.classList.add('alert', 'add-error');
            photoContainer.appendChild(p);
        } else {
            if(document.querySelector('.add-error')) {
                document.querySelector('.add-error').classList.add('hidden');
            }

            let formData = new FormData();
            formData.append('image',document.querySelector('#project-photo').files[0]);
            
            readUploadFile(photoContainer, file);

            checkInputValue(formData);
        }

    })
}
function readUploadFile(photoContainer, file) {
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
        let img = document.createElement('img');
        img.src = e.target.result;
        photoContainer.innerHTML = '';
        photoContainer.style.padding = '0';
        photoContainer.appendChild(img);
    });
    reader.readAsDataURL(file);
    convertFileNameToTitle(file.name);
}
function convertFileNameToTitle(name) {
    let regex = /\.jpg$|\.png$|-|_/g
    name = name.replace(regex, ' ');
    let title = document.querySelector('#title');
    title.value = name;
}

function checkInputValue(formData) {
    category.addEventListener('input', (e) => {
        if( document.querySelector('#title').value !== null && e.target.value !== null) {
            let submitBtn = document.querySelector('#submit-btn');
            submitBtn.removeAttribute('disabled');
            submitBtn.classList.remove('inactive-btn');

            getUploadFile(formData)
        }
    })
}
function getUploadFile(formData) {
    let form = document.querySelector('#add-form');

    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        AddProjectToApi(formData);
    });
}
function AddProjectToApi(formData){ 
    
    formData.append('title',document.querySelector('#title').value);
    formData.append('category',document.querySelector("#category").value);

    fetch('http://localhost:5678/api/works',{
        method:'POST',
        headers:{
            'accept':'application/json',
            'Authorization':`Bearer ${localStorage.getItem('token')}`
        },
        body:formData
    })
    .then(res => {
        if(res.ok){
            return res.json();
        }
    })
    .then(work => {
        
    })
}
// localStorage.clear()