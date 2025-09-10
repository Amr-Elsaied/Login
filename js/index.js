var signupName = document.getElementById('signupName');
var signupEmail = document.getElementById('signupEmail');
var signupPassword = document.getElementById('signupPassword');
var signinEmail = document.getElementById('signinEmail');
var signinPassword = document.getElementById('signinPassword');
var username = document.getElementById('username');
var signUpBtn = document.getElementById('signUpBtn');
var LoginBtn = document.getElementById('LoginBtn');
var logoutBtn = document.getElementById('logoutBtn');

var notyf = new Notyf({
    duration: 2000,
    position: {
        x: 'right',
        y: 'top',
    },
});

var signUpContainer = [];

if (localStorage.getItem("signUp") != null) {
    signUpContainer = JSON.parse(localStorage.getItem("signUp"));
}

if(signupName && signupEmail && signupPassword) {
    signupName.addEventListener('input', function() {
        validate(signupName);
    });

    signupEmail.addEventListener('input', function() {
        validate(signupEmail);
    });

    signupPassword.addEventListener('input', function() {
        if (validate(signupPassword)) {
            document.getElementById('pass').innerHTML = '';
        } else {
            document.getElementById('pass').innerHTML = '<span class="text-danger">Minimum eight characters, at least one upper case letter, one lower case letter, one number and one special character</span>';
        }
    });
}


function signUp() {
    if (signupName.value == "" || signupEmail.value == "" || signupPassword.value == "") {
        notyf.error('All inputs are required');
        return;
    }

    if (!validate(signupName) || !validate(signupEmail) || !validate(signupPassword)) {
        notyf.error('Please make sure all fields are valid.');
        return;
    }

    var signUpData = {
        name: signupName.value,
        email: signupEmail.value,
        pass: signupPassword.value
    };

    if (isEmailExist(signupEmail.value)) {
        notyf.error('Email already exists');
        return;
    }

    signUpContainer.push(signUpData);
    localStorage.setItem("signUp", JSON.stringify(signUpContainer));
    notyf.success('Registration successful');
    setTimeout(function() {
        location.href = "index.html";
    }, 1000);
}


function isEmailExist(email) {
    for (var i = 0; i < signUpContainer.length; i++) {
        if (signUpContainer[i].email.toLowerCase() === email.toLowerCase()) {
            return true;
        }
    }
    return false;
}

function login() {
    var email = signinEmail.value;
    var password = signinPassword.value;

    if (email == "" || password == "") {
        notyf.error('All inputs are required');
        return;
    }

    for (var i = 0; i < signUpContainer.length; i++) {
        if (signUpContainer[i].email.toLowerCase() == email.toLowerCase() && signUpContainer[i].pass == password) {
            notyf.success('You have successfully logged in');
            localStorage.setItem('sessionUsername', signUpContainer[i].name);
            setTimeout(function() {
                location.href = "home.html";
            }, 1000);
            return;
        }
    }

    notyf.error('incorrect email or password');
}

function displayUsername() {
    var sessionUsername = localStorage.getItem('sessionUsername');
    if (sessionUsername) {
        document.getElementById('username').innerHTML = `Welcome ${sessionUsername}`;
    }
}


function logout() {
    Swal.fire({
        title: 'Are you sure?',
        text: "You will be logged out.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, log out',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('sessionUsername');
            location.href = "/";
        }
    });
}

function validate(ele) {
  var regex = {
    signupName: /^[a-zA-Z\s]{3,}$/, 
    signupEmail: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
    signupPassword:/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
  };
  if (regex[ele.id] && regex[ele.id].test(ele.value)) {
    ele.classList.remove("is-invalid");
    ele.classList.add("is-valid");
    return true;
  } else {
    ele.classList.remove("is-valid");
    ele.classList.add("is-invalid");
    return false;
  }
}



if (signUpBtn) {
    signUpBtn.addEventListener('click', signUp);
}
if (LoginBtn) {
    LoginBtn.addEventListener('click', login);
}
if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}
if (document.getElementById('username')) {
    displayUsername();
}

