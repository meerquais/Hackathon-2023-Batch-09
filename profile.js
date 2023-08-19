import { auth, db, doc,getDownloadURL,onAuthStateChanged, getDoc,updateDoc,uploadBytesResumable , ref, storage, collection,getDocs, addDoc, serverTimestamp , query , orderBy, deleteDoc} from './firebase.js';


// Get the user data from localStorage
const userData = JSON.parse(localStorage.getItem('user'));

if (userData && userData.firstName && userData.lastName) {
    const fullName = `${userData.firstName} ${userData.lastName}`;
    
    // Display the full name in the "userName" element
    const userNameElement = document.getElementById('userName');
    const userNameElement1 = document.getElementById('userName1');

    if (userNameElement , userNameElement1) {
        userNameElement.textContent = fullName;
        userNameElement1.textContent = fullName;
    }
};
window.addEventListener("load", function () {
    // const user = JSON.parse(localStorage.getItem("user"))
    if(!userData){
      window.location.replace("./index.html")
      return
    }
    onAuthStateChanged(auth, async (user) => {
        if (userData) {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (!docSnap.exists()) {
                alert("user not found")
            }
            // userData = docSnap.data()
            console.log(docSnap.data().firstName)
            const profilePic = document.getElementById("imgSrc")
            profilePic.src = `${docSnap.data().profilePic}`
            userData.profilePic ? profilePic.src = `${ userData.profilePic}`:"./wallpaper-for-facebook-profile-photo.jpg"
            
        } else {
            //   window.location.replace("./index.html")
            return
        }
    });

})

const updateProfile = document.getElementById("updateProfile")
updateProfile.addEventListener("click", async () => {
    const firstNameInput = document.getElementById("firstNameInput");
    const lastNameInput = document.getElementById("lastNameInput");
    const profileImage = document.getElementById("inputGroupFile04");
    const closeBtn = document.getElementById("closeBtn");
    
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    
    // if (!firstName || !lastName) {
    //     Swal.fire({
    //         title: 'Fill Empty Fields',
    //         icon: 'warning',
    //         confirmButtonColor: 'rgb(119, 73, 248)',
    //         iconColor: 'rgb(119, 73, 248)'
    //     });
    //     return;
    // }
    
    updateProfile.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
      <span class="sr-only">Loading...</span>`;

      const file = profileImage
    if (file !== undefined) {

        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'images/' + userData.uid);
        const uploadTask = uploadBytesResumable(storageRef, file.files[0], metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {

                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.
                    ref).then(async (downloadURL) => {
                   
                    const pictureRef = doc(db, "users", userData.uid);
                    await updateDoc(pictureRef, {
                        firstName: firstName.value.trim(),
                        lastName: lastName.value.trim(),
                        profilePic: downloadURL
                    });

            const profilePic = document.getElementById("imgSrc")
            profilePic.src = `${downloadURL}`
                    file.value = ""
                    updateProfile.innerHTML = "Update"
                    closeBtn.click()
                });
            }
        );
    } else {
        const pictureRef = doc(db, "users", userData.uid);
        await updateDoc(pictureRef, {
            // firstName: firstName.value.trim(),
            // lastName: lastName.value.trim(),
        });
        
        document.getElementById("name").innerHTML = `${firstName + " " + lastName}`
        saveBtn.innerHTML = `Update`
        uptClose.click()
    }
})















const logout = document.getElementById("logoutBtn")
logout.addEventListener("click",()=>{
    auth.signOut().then(() => {
        localStorage.removeItem('user');
        window.location.href = '../index.html';
      }).catch((error) => {
        console.log(error.message);
      });
});

