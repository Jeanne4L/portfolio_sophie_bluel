document.querySelector('#authentification-form').addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = {
        email: document.querySelector('#email').value,
        password : document.querySelector('#password').value
    }

    fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: { 
            'Accept': 'application/json', 
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData)
    })
    .then(function(res) {
        if(res.ok) {
            return res.json();
        } else {
            document.querySelector('.form-error').classList.remove('hidden')
        }
    })
    .then(function(userInfo) {
        localStorage.setItem('token', userInfo.token);
        document.location.href="./index.html?connected=1"; 
    })
})