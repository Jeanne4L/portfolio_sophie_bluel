let gallery = document.querySelector('.gallery');
let modalGallery = document.querySelector('.modal__gallery');
let modal = document.querySelector('#modal');
let addProjectModal = document.querySelector('#modal--add');
let overlay = document.querySelector('.overlay');
let photoContainer = document.querySelector('.add-photo__container');
let submitAddBtn = document.querySelector('#submit-btn');


// DISPLAY PROJECTS FROM API 
let works = JSON.parse(localStorage.getItem('works'));

if (works !== null) {
    displayWorks(works);
} else {
    fetchWorks();
    displayWorks(works);
};
fetchCategories();

// GET PROJECTS QUERY
async function fetchWorks() {
    try {
        let res = await fetch('http://localhost:5678/api/works');
        let works = await res.json();
        works = JSON.stringify(works);
    
        localStorage.setItem('works', works);
    } catch(error) {
        console.error(error);
    }
};
function displayWorks(works) {
    for( let i=0; i<works.length; i++) {
        let a = document.createElement('a');
        a.href = works[i].imageUrl;
        gallery.appendChild(a);

        let figure = document.createElement('figure');
        a.appendChild(figure);

        let img = document.createElement('img');
        img.src = works[i].imageUrl;
        img.alt = works[i].title;
        figure.appendChild(img);

        let figcaption = document.createElement('figcaption');
        figcaption.innerText = works[i].title;
        figure.appendChild(figcaption);
    }
};

// GET CATEGORIES QUERY
async function fetchCategories() {
    try {
        let res = await fetch('http://localhost:5678/api/categories');
        let categories = await res.json();
        categories = JSON.stringify(categories);
    
        localStorage.setItem('categories', categories);
    } catch(error) {
        console.error(error);
    }
};


// FILTER PROJECTS
let allProjectsBtn = document.querySelector('.all-btn');
allProjectsBtn.addEventListener('click', () => { 
    updateGallery(works, allProjectsBtn);
});

let categories = JSON.parse(localStorage.getItem('categories'));
for(let i=0; i<categories.length; i++) {
    let objectsBtn = document.querySelector('.objects-btn');
    sortWorks(objectsBtn, categories[0].id);
    
    let apartmentsBtn = document.querySelector('.apartments-btn');
    sortWorks(apartmentsBtn, categories[1].id);
    
    let hotelsBtn = document.querySelector('.hotels-btn');
    sortWorks(hotelsBtn, categories[2].id);
};

function updateGallery(worksToDisplay, btn) {
    gallery.innerHTML = '';
    displayWorks(worksToDisplay);

    // CHANGE STYLE OF ACTIVE FILTER BTN
    document.querySelectorAll('.filters-btn').forEach(btn => {
        btn.classList.remove('active');
    })
    btn.classList.add('active'); 
};
function sortWorks( btn, categoryId) {
    btn.addEventListener('click', () => {
        let sortWorks = works.filter(works => works.categoryId == categoryId);
        updateGallery(sortWorks, btn);
    })
};


// UPDATE INDEX PAGE IF CONNECTED
let connexionParams = new URLSearchParams(document.location.search);
let connexionStatus = connexionParams.get('connected');

if(connexionStatus === '1') {
    displayHiddenEls();
    deleteAllProjects();

    let formData = new FormData();

    document.querySelector('#project-photo').addEventListener('change', () => {
        let file = document.querySelector('#project-photo').files[0];

        checkUploadFile(file, formData);
        displayUploadFile(file);
    })
    checkInputValue();
    sendForm(formData);
};

// MODAL
function displayHiddenEls() {
    // DISPLAY CATEGORIES INTO SELECT
    for( let i=0; i<categories.length; i++) {
        let option = document.createElement("option");
        option.value = categories[i].id;
        option.text = categories[i].name;
        document.querySelector('#category').add(option);
    }

    // DISPLAY EDIT BAR 
    let editBtn = document.querySelector('.edit-bar');
    document.querySelector('header').style.marginTop = '55px';
    editBtn.classList.remove('hidden');
    editBtn.addEventListener('click', () => {
        updateGallery(works, allProjectsBtn) 
    })

    document.querySelector('.log').textContent = 'logout';

    // DISPLAY UPDATE BTN 
    document.querySelectorAll('.update-btn').forEach(btn => {
        btn.classList.remove('hidden');
        btn.addEventListener('click', () => {
            openGalleryModal(modal, overlay);
            let growUpIcons = document.querySelectorAll('.grow-up');
            for(let i=0; i<growUpIcons.length; i++) {
                growUpIcons[0].focus();
            }
        })
    })
};
function openGalleryModal(modal, overlay) {
    openModal(modal, overlay);
    displayModalGallery();

    // IF ADD BTN CLICK DISPLAY ADD MODAL
    document.querySelector('#add').addEventListener('click', () => {
        modal.classList.add('hidden');
        openAddModal(modal, overlay);
    })
};
function openAddModal(modal, overlay) {
    openModal(addProjectModal, overlay);

    // IF PREVIOUS BTN CLICK DISPLAY GALLERY MODAL
    let prevArrow = document.querySelector('.js-prev-arrow');
    prevArrow.addEventListener('click', () => {
        addProjectModal.classList.add('hidden');
        openGalleryModal(modal, overlay);
    })
};
function openModal(modalToOpen, overlay) {
    modalToOpen.classList.remove('hidden');
    if(overlay.classList.contains('hidden')) {
        overlay.classList.remove('hidden');
    }
    document.querySelector('body').style.overflow='hidden';

    closeModal(modalToOpen, overlay);
};
function closeModal(modalToClose, overlay) {
    document.querySelectorAll('.js-close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            hideModal(modalToClose, overlay);
        })
    })
    overlay.addEventListener('click', () => {   
        hideModal(modalToClose, overlay);
    }); 
};
function hideModal(modalToClose, overlay) {
    modalToClose.classList.add('hidden');
    overlay.classList.add('hidden'); 
    document.querySelector('body').style.overflow='visible';

    // REMOVE THE MODAL HASH FROM THE URL
    history.pushState("", document.title, window.location.pathname + window.location.search);
};
function displayModalGallery() {
    modalGallery.innerHTML = '';

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

        let growUp = document.createElement('a');
        growUp.href = works[i].imageUrl;
        growUp.className = 'grow-up';
        span.appendChild(growUp);

        let growUpIcon = document.createElement('i');
        growUpIcon.classList.add('fa-solid', 'fa-arrows-up-down-left-right');
        growUp.appendChild(growUpIcon);

        let deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fa-regular', 'fa-trash-can', 'delete-icon');
        deleteIcon.setAttribute('tabindex', '0');
        span.appendChild(deleteIcon);

        let editBtn = document.createElement('button');
        editBtn.textContent = 'éditer';
        editBtn.className = 'update-project';
        figcaption.appendChild(editBtn);
    }  
    deleteProject(); 
};

//  DELETE PROJECT
function deleteProject() {
    let deleteBtns = document.querySelectorAll('.delete-icon');

    for( let i=0; i<deleteBtns.length; i++) {
        deleteBtns[i].addEventListener('click', () => {
            let datasetId = Number(deleteBtns[i].closest('[data-id]').dataset.id);

            deleteToAPI(datasetId);
        })
    }
};
async function deleteToAPI(datasetId) {
    try {
        let res = await fetch(`http://localhost:5678/api/works/${datasetId}`, {
            method: 'DELETE',
            headers: {  
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            } 
        });
        if(res.ok) {
            deleteToLocalStorage(datasetId);
    
            works = JSON.parse(localStorage.getItem('works'));
            displayModalGallery();
        }
    } catch (error){
        console.error(error);
    }
};
function deleteToLocalStorage(datasetId) {
    works = works.filter(works => works.id !== datasetId);
    localStorage.setItem('works', JSON.stringify(works));
};
function deleteAllProjects() {
    modalGallery.innerHTML = '';
    
    let deleteAllBtn = document.querySelector('#delete-all');
    deleteAllBtn.addEventListener('click', () => {
        for(let i=0; i<works.length; i++) {
            let datasetId = Number(works[i].id);

            deleteToAPI(datasetId);
        }
    })
};

// ADD PROJECT CHECK AND DISPLAY
function checkUploadFile(file, formData) {
    // CHECK FILE SIZE < 4MO
    if(file.size > '4194304') {
        let p = document.createElement('p');
        p.textContent = 'L\'image sélectionnée est trop lourde';
        p.classList.add('alert', 'add-error');
        photoContainer.appendChild(p);
    } else {
        if(document.querySelector('.add-error')) {
            document.querySelector('.add-error').classList.add('hidden');
        }

        formData.set('image',document.querySelector('#project-photo').files[0]);
    }
};
function displayUploadFile(file) {
    let reader = new FileReader();
    reader.addEventListener('load', (e) => {
        let img = document.createElement('img');
        img.src = e.target.result;
        img.id = 'upload';
        document.querySelector('.add-photo__content').classList.add('hidden');
        photoContainer.style.padding = '0';
        photoContainer.appendChild(img);
    });
    reader.readAsDataURL(file);
    convertFileNameToTitle(file.name);
};
function convertFileNameToTitle(name) {
    let regex = /\.jpg$|\.png$|-|_/g;
    name = name.replace(regex, ' ');
    let title = document.querySelector('#title');
    title.value = name;
};
function checkInputValue() {
    document.querySelector('#category').addEventListener('change', (e) => {
        if( document.querySelector('#title').value !== null && e.target.value !== null && document.querySelector('#project-photo').value !== '') {
            submitAddBtn.removeAttribute('disabled');
            submitAddBtn.classList.remove('inactive-btn');
        }
    })
};

// ADD FORM SUBMIT
function sendForm(formData) {
    let form = document.querySelector('#add-form');
    
    form.addEventListener('submit', (e) =>{
        e.preventDefault();
        AddProjectToApi(formData);
    });
};
async function AddProjectToApi(formData){ 
    formData.set('title',document.querySelector('#title').value);
    formData.set('category',document.querySelector('#category').value);
    try {
        let res = await fetch('http://localhost:5678/api/works',{
            method:'POST',
            headers:{
                'accept':'application/json',
                'Authorization':`Bearer ${localStorage.getItem('token')}`
            },
            body:formData
        });

        if(res.ok){
            // PUSH NEW PROJECT INTO LOCALSTORAGE
            let work = await res.json();
            works.push(work);
            localStorage.setItem('works', works);

            // REMOVE MODAL AND DISPLAY PORTFOLIO
            fetchWorks();
            hideModal(addProjectModal, overlay);
            updateGallery(works, allProjectsBtn);

            submitAddBtn.classList.add('inactive-btn');
            submitAddBtn.setAttribute('disabled', 'disabled');

            // RESET ADD FORM
            document.querySelector('#add-form').reset();
            document.querySelector('.add-photo__content').classList.remove('hidden');
            document.querySelector('#upload').remove();

            // REMOVE FORMDATA CONTENT
            for (let key of formData.keys()) {
                formData.delete(key);
            }
            formData.delete('title');
        }
    } catch (error) {
        console.error(error);
    }
};