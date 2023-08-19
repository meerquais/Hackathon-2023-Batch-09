import { auth, db, doc, getDoc,updateDoc, collection,getDocs, addDoc, serverTimestamp , query , orderBy, deleteDoc} from '../firebase.js';


window.addEventListener("load", function () {
    if (!localStorage.getItem('user')) {
        window.location.replace = '../index.html';
    }
});

const editBtn = document.getElementById("Edit")
const DeleteBtn = document.getElementById("Delete")
// Get the user data from localStorage
const userData = JSON.parse(localStorage.getItem('user'));

if (userData && userData.firstName && userData.lastName) {
    const fullName = `${userData.firstName} ${userData.lastName}`;
    
    // Display the full name in the "userName" element
    const userNameElement = document.getElementById('userName');
    if (userNameElement) {
        userNameElement.textContent = fullName;
    }
}

const postCard = (time,firstName,lastName,text,title,uId)=>{
    let date = new Date(time.seconds*1000).toLocaleString()
    return `<div id="${uId}" class="container-fluid mt-3 bg-white p-3 rounded">
    <div class="d-flex justify-content-between">
      <div class="authorsDetails d-flex align-items-center">
        <div class="container-fluid d-flex">
          <div style="width: 100px;height: 100px; overflow: hidden;" class="rounded">
            <img src="https://i.pinimg.com/564x/c7/9f/50/c79f505ef4d4f5c29b1c69fad333c303.jpg" alt="" class="img-fluid">
          </div>
          <div class="userName-id ms-2">
            <h5 style="width: 70%;" class="postTitle fw-bold">${title}</h5>
            <div class="d-flex align-items-center" style="font-size: 14px!important;">
              <div class="mb-1 text-capitalize username">${firstName} ${lastName}</div>
              <div class="mb-0 ms-2">${date}</div>
            </div>
          </div>
        </div>
      </div>
      <div>
        
      </div>
    </div>
    <div class="postDetails">
      <p class="postText mt-3" style="color: #707070;word-wrap: break-word;">${text}</p>
    </div>
    <div class="btns mt-3 d-flex gap-3">
    <span class="Btns"  data-bs-toggle="modal" data-bs-target="#editModal" id="Edit" onclick="edit(this)" style="color: rgb(119, 73, 248) ;">Edit</span>
    <span class="Btns" data-bs-toggle="modal" data-bs-target="#deleteModal" id="Delete" onclick="deletes(this)"  style="color: rgb(119, 73, 248) ;">Delete</span>
    </div>
  </div> 
</div>`
};

const publish = document.getElementById("publishBtn")
publish.addEventListener("click",async ()=>{
  
    try{
        publish.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        <span class="sr-only">Loading...</span>`
        publish.style.pointerEvents = "none"
        publish.style.opacity = "0.5"
        let placeholder = document.getElementById("exampleFormControlInput1")
        let blogText = document.getElementById("exampleFormControlTextarea1")
        if(!placeholder.value || !blogText.value){
            Swal.fire({
                title: 'Fill All The Fields',
                icon: 'warning',
                confirmButtonColor: 'rgb(119, 73, 248)',
                iconColor: 'rgb(119, 73, 248)'
              })
              publish.innerHTML = `Publish Blog`
              publish.style.pointerEvents = "auto"
              publish.style.opacity = "1"
            return
        }
        const snapshot = await getDocs(collection(db,'posts'));
        const taskCount = snapshot.size;
    
        const obj ={
            time : serverTimestamp(),
            firstName : userData.firstName,
            lastName : userData.lastName,
            title : placeholder.value,
            text : blogText.value,
            order: -taskCount,
            uId: userData.uid
          }

            const docRef = await addDoc(collection(db, "posts"),obj);
            console.log(docRef)
            const getDocRef = doc(db, "posts", docRef.id);
            const docSnap = await getDoc(getDocRef);
            const {time,firstName,lastName,text,title,uId} = docSnap.data();
            const postBox = document.getElementById("postBox")
            const card = postCard(time,firstName,lastName,text,title,docRef.id)
            postBox.innerHTML += card
            publish.innerHTML = `Publish Blog`
              publish.style.pointerEvents = "auto"
              publish.style.opacity = "1";
              placeholder.value = '';
              blogText.value = '';


    }catch(e){
            alert(e.message)
    }
    
})

async function loadBlogCards() {
    const postBox = document.getElementById("postBox");

    // Reference the "posts" collection in Firestore
    const postsCollection = collection(db, "posts");
const qry = query(collection(db,"posts"),orderBy("time"));

    // Query the collection to get all documents
    const querySnapshot = await getDocs(qry).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const { time, firstName, lastName, text, title, uId } = doc.data();
            const card = postCard(time, firstName, lastName, text, title, doc.id);
            postBox.innerHTML = card + postBox.innerHTML;
        });
    }).catch((error) => {
        console.error("Error loading blog cards:", error);
    });
}
window.onload = loadBlogCards;

async function edit(e){
    const editTitle = document.getElementById("editTitle")
    const editDesc = document.getElementById("editDesc")
    const post = e.parentNode.parentNode
    post.querySelector(".postTitle")
    post.querySelector(".postText")
    editTitle.value = post.querySelector(".postTitle").innerHTML  
    editDesc.value = post.querySelector(".postText").innerHTML

   const saveBtn = document.getElementById("saveBtn").addEventListener("click",async ()=>{

    const washingtonRef = doc(db, "posts", post.id);
    await updateDoc(washingtonRef, {
      title: editTitle.value,
      text: editDesc.value,
    });
    post.querySelector(".postTitle").innerHTML = editTitle.value
    post.querySelector(".postText").innerHTML = editDesc.value
   })

}

async function deletes(e){
    const post = e.parentNode.parentNode;
    const deleteBtn = document.getElementById('DeletesBtn')
    deleteBtn.addEventListener("click" , async ()=>{
        console.log("working!!")
        await deleteDoc(doc(db,"posts", post.id));
        post.remove()
        document.getElementById("closeBtn").click();
    } );

};

    
if(!userData){
    window.location.href = '../index.html';
}


window.deletes = deletes
window.edit = edit

const logout = document.getElementById("logoutBtn")
logout.addEventListener("click",()=>{
    auth.signOut().then(() => {
        localStorage.removeItem('user');
        window.location.href = '../index.html';
      }).catch((error) => {
        console.log(error.message);
      });
});

