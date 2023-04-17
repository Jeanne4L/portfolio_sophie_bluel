// CHECk INPUT VALID
let email = document.querySelector('#email');
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

document.querySelector('#email').addEventListener('change', (e) => {
    if(emailRegex.test(e.target.value)){
        document.querySelector('#email--error').classList.add('hidden');
        email.classList.remove('input-alert');
    } else {
        document.querySelector('#email--error').classList.remove('hidden');
        email.classList.add('input-alert');
    }
});

// FORM SUBMIT
document.querySelector('#login').addEventListener('submit', (e) => {
    e.preventDefault();

    let formData = {
        email: email.value,
        password : document.querySelector('#password').value
    };

    fetchUserToken(formData);
});

// CONNECTION QUERY
async function fetchUserToken(formData) {
    try {
        let res = await fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: { 
                'Accept': 'application/json', 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(formData)
        });

        if(res.ok){
            let userInfo = await res.json();

            localStorage.setItem('token', userInfo.token);
            window.location.href="./index.html"; 

        } else {
            document.querySelector('.form-error').classList.remove('hidden');
        }
    } catch (error) {
        console.error(error);
    };
};