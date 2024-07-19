let session = new Session();
session = session.getSession();

if(session !== "") {
    window.location.href = "ripple.html";
}



let regBtn = document.querySelector("#registration");

regBtn.addEventListener('click', () => {
    let modal = document.querySelector(".registration-modal");
    modal.style.display = "block";
});

let closeBtn = document.querySelector("#closeModal").addEventListener('click', () => {
    let modal = document.querySelector(".registration-modal");
    modal.style.display = "none";
});


let config = {
    'username': {
        required: true,
        minlength: 5,
        maxlength: 50
    },
    'email': {
        required: true,
        email: true,
        minlength: 5,
        maxlength: 50
    },
    'password': {
        required: true,
        minlength: 7,
        maxlength: 25,
        matching: 'repeat_password'
    },
    'repeat_password': {
        required: true,
        minlength: 5,
        maxlength: 50,
        matching: 'password'
    }
}

let validator = new Validator(config, "#registrationForm");

document.querySelector("#registrationForm").addEventListener('submit', e => {
    e.preventDefault();

    if(validator.validationPassed()) {
        let user = new User();
        user.username = document.querySelector("#username").value;
        user.email = document.querySelector("#email").value;
        user.password = document.querySelector("#password").value;

        user.create();

    } else {
        alert('Fields are incorrectly filled.');
    }
});



document.querySelector("#loginForm").addEventListener('submit', e => {
    e.preventDefault();

    let email = document.querySelector("#login_email").value;
    let password = document.querySelector("#login_password").value;

    let user = new User();
    user.email = email;
    user.password = password;

    user.login();
});
