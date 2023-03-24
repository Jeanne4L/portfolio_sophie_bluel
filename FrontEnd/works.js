let works = localStorage.getItem('works');

if (works !== null) {
    works = JSON.parse(works);
} else {
    getWorks();
}

displayWorks();

async function getWorks() {
    let res = await fetch('http://localhost:5678/api/works');
    let works = await res.json();
    works = JSON.stringify(works);

    localStorage.setItem('works', works);
}

function displayWorks() {
    for( let i=0; i<works.length; i++) {
        const gallery = document.querySelector('.gallery');

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

// localStorage.clear();