import {
    db,
    auth,
    createUserWithEmailAndPassword,
    doc,
    setDoc,
} from "../firebase.js";


const SignupBtn = document.getElementById("sign-up");

SignupBtn.addEventListener("click", SignUp);

if (localStorage.getItem('user')) {
    // const userData = JSON.parse(localStorage.getItem('user'));
    window.location.replace("./login.html")
}

async function SignUp() {
    try {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const repeatPassword = document.getElementById("repeat-password").value;
        const phone = document.getElementById("phone").value;

        if (!firstName || !lastName || !email || !password || !phone) {
            alert("Please fill all the fields");
            return;
        }

        if (!email.includes("@")) {
            await Swal.fire({
                title: 'Please Add an valid Email Address',
                icon: 'error',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
              })
            return;
        }
        if(repeatPassword !== password){
            await Swal.fire({
                title: 'password does not match!!!s',
                icon: 'error',
                showClass: {
                  popup: 'animate__animated animate__fadeInDown'
                },
                hideClass: {
                  popup: 'animate__animated animate__fadeOutUp'
                }
              })
    
            return;
        }

        const userAuth = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userAuth.user.uid;
        const userObj = {
            firstName,
            lastName,
            email,
            phone,
            uid,
        };

        const userRef = doc(db, "users", uid);
        await setDoc(userRef, userObj);
    
        disableSignUpButton();
       
        await Swal.fire({
            title: 'Account Created Successfully.',
            icon: 'success',
            showClass: {
              popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
              popup: 'animate__animated animate__fadeOutUp'
            }
          })

        window.location.assign("./login.html");
    } catch (error) {
        console.error(error.message);
        await Swal.fire({
            title: 'Error',
            text: error.message,
            icon: 'error',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
    }
}
function disableSignUpButton() {
    SignupBtn.disabled = true;
    SignupBtn.innerHTML = 'Logging In...';
}