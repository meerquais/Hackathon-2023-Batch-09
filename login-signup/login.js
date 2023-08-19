import { auth, db, doc, getDoc, signInWithEmailAndPassword } from '../firebase.js';

const loginBtn = document.getElementById('loginBtn');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

loginBtn.addEventListener('click', login);

// Check if the user is already logged in and redirect to dashboard
window.addEventListener("load", function () {
    if (localStorage.getItem('user')) {
        redirectToDashboard();
    }
});

async function login() {
    try {
        const email = emailInput.value;
        const password = passwordInput.value;

        // Disable the login button during login process
        disableLoginButton();

        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userRef = doc(db, "users", userCredential.user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            handleLoginError('No such user!');
            return;
        }

        const userData = userDoc.data();
        localStorage.setItem('user', JSON.stringify(userData));

        await Swal.fire({
            title: 'Account Logged In Successfully.',
            icon: 'success',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })

        // Redirect to the dashboard
        redirectToDashboard();

    } catch (error) {
        console.log(error);
        handleLoginError(error.message);
    } finally {
        // Re-enable the login button
        enableLoginButton();
    }
}


function handleLoginError(errorMessage) {
    alert(errorMessage);
}

function redirectToDashboard() {
    window.location.assign("../dashboard/dashboard.html");
}

function disableLoginButton() {
    loginBtn.disabled = true;
    loginBtn.innerHTML = 'Logging In...';
}
