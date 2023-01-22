const auth = firebase.auth();

const whenSignedIn = document.getElementById("whenSignedIn");
const whenSignedOut = document.getElementById("whenSignedOut");

const signInBtn = document.getElementById("signInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.addEventListener("click", () => {
    auth.signInWithPopup(provider);
    
})

signOutBtn.addEventListener("click", () => {
    auth.signOut();
})

auth.onAuthStateChanged(user => {
    if (user) {
        //signed in 
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3><p>User Id: ${user.uid}</p>`
    } else {
        //not signed in
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = ""
    }
});

const db = firebase.firestore();

const createThing = document.getElementById("createThing");
const thingList = document.getElementById("thingsList");

let thingsRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    if (user) {
        thingsRef = db.collection("things")

        createThing.addEventListener("click", () => {
            thingsRef.add({
                uid: user.uid,
                name: faker.commerce.productName(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            })
        })

        unsubscribe = thingsRef
            .where("uid", "==", user.uid)
            .orderBy("createdAt")
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return `<li class="list-group-item">${doc.data().name}</li>`
                });

                thingsList.innerHTML = items.join("");
            })
    } else {
        unsubscribe && unsubscribe();
        thingsList.innerHTML = "";
    }
})