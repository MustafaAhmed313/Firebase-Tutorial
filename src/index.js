import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    query,
    where,
    orderBy,
    serverTimestamp,
    getDoc,
    updateDoc
} from 'firebase/firestore';
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

/**
 * Change the firebaseConfig object with yours 
 * to see the result of your cloud database application ^_^! 
 */
const firebaseConfig = {
    apiKey: "AIzaSyCGrDKnNZcq2JfNUluCnp8o7hlSPPOHArU",
    authDomain: "fir-tutorial-6be2c.firebaseapp.com",
    projectId: "fir-tutorial-6be2c",
    storageBucket: "fir-tutorial-6be2c.appspot.com",
    messagingSenderId: "842932624428",
    appId: "1:842932624428:web:9bd61a6075be7801380589"
};

initializeApp(firebaseConfig);

// connection
const db = getFirestore();

// authentication object
const auth = getAuth();

// retrive collection
const colRef = collection(db , 'Books');

// create queries
const apiGET_byAuthor = (authorName) => {
    console.log('Retrive Docs by Author Name...')
    const q = query(colRef , where('author' , '==' , authorName) , orderBy('createdAt'));
    onSnapshot(q , (snapshot) => {
        const docs = [];
        snapshot.docs.forEach((doc) => {
            docs.push({...doc.data() , id: doc.id });
        });
        console.log(docs);
    });
}


// Listeners
const addDocForm = document.querySelector('.add');
addDocForm.addEventListener('submit' , (e) => {
    e.preventDefault();
    apiPOST();
});

const deleteDocForm = document.querySelector('.delete');
deleteDocForm.addEventListener('submit' , (e) => {
    e.preventDefault();
    apiDELETE();
});

const updateDocForm = document.querySelector('.update');
updateDocForm.addEventListener('submit' , (e) => {
    e.preventDefault();
    const docRef  = doc(db , 'Books' ,updateDocForm.id.value);
    const title = updateDocForm.title.value;
    const author = updateDocForm.author.value;  
    const data = {};
    if (title) data.title = title;
    if (author) data.author = author;
    apiPUT(docRef , data);
});

const signUpForm = document.querySelector('.signup');
signUpForm.addEventListener('submit' , (e) => {
    e.preventDefault();
    const email = signUpForm.email.value;
    const password = signUpForm.password.value;
    apiSIGNUP(email , password);
})

const logInForm = document.querySelector('.login');
logInForm.addEventListener('submit' , (e) => { 
    e.preventDefault();
    const email = logInForm.email.value;
    const password = logInForm.password.value;
    apiSIGNIN(email , password);
});

const logOutButton = document.querySelector('.logout');
logOutButton.addEventListener('click' , (e) => { 
    e.preventDefault();
    apiSIGNOUT();
});

const unSubscribe = document.querySelector('.unsub');
unSubscribe.addEventListener('click' , () => {
    console.log('Unsubscribing...');
    unsubAuth();
    console.log('You have been unsbscribed successfully!');
});

// get method
const apiGET = async () => {
    try {
        console.log('Retriving Docs from the firestore...');
        const docs = [];
        const promise = await getDocs(colRef);
        promise.docs.forEach((doc) => {
            docs.push({ ...doc.data() , id: doc.id });
        });
        console.log(docs);
    }catch (err) {
        console.log('Error [apiGET] : ' , err.message);
    }
};

const apiGET_docByID = async () => {
    const docRef = doc(db , 'Books' , '5DZkmRHayoC524UGubOa');
    // const document = await getDoc(docRef);
    // console.log({ ...document.data() , id: document.id});
    apiGET_docByID_ENHANCEMNET(docRef);
}

// realtime data without refresh
const apiGET_ENHANCEMENT = () => {
    console.log('Retriving Docs from the firestore...');
    var unsubCol = onSnapshot(colRef , (snapshot) => {
        const docs = [];
        snapshot.docs.forEach((doc) => {
            docs.push({...doc.data() , id: doc.id });
        });
        console.log(docs);
    });
};

const apiGET_docByID_ENHANCEMNET = (docRef) => {
    var unsubDoc = onSnapshot(docRef , (doc) => {
        console.log({ ...doc.data() , id: doc.id });
    });
};

// post method
const apiPOST = async () => {
    try {
        console.log('Adding new doc...');
        await addDoc(colRef, {
            title: updateDocForm.title.value,
            author: updateDocForm.author.value,
            createdAt: serverTimestamp()
        });
        addDocForm.reset();
        console.log('The Doc has been added successfully!');
    }catch (err) {
        console.log('Error [apiPOST] : ' , err.message);
    }
};

// delete method
const apiDELETE = async () => {
    try {
        console.log('Deleting a doc...');
        const docRef = doc(db , 'Books' , deleteDocForm.id.value);
        await deleteDoc(docRef);
        deleteDocForm.reset();
        console.log('The Doc has been deleted successfully!');
    }catch (err) {
        console.log('Error [apiDELETE] : ' , err.message);
    }
}

// put method
const apiPUT = async (docRef , data) => {
    try {
        console.log('Updating a doc...');
        await updateDoc(docRef , data);
        updateDocForm.reset();
        console.log('The Doc has been updated successfully!');
    }catch (err) {
        console.log('Error [apiPUT] : ' , err.message);
    }
}; 

//authentication
const apiSIGNUP = async (email , password) => {
    try {
        console.log('Adding new user...')
        const cred = await createUserWithEmailAndPassword(auth , email , password);
        // console.log('The user with email ' , cred.user.email , ' has been added succefully!');
    }catch(err) {
        console.log('Error [apiSIGNUP] : ' , err.message);
    }
}

const apiSIGNOUT = async () => {
    try {
        console.log('logging out...');
        await signOut(auth);
        // console.log('The user logged out successfully!');
    }catch(err) {
        console.log('Error [apiSIGNOUT] : ' , err.message);
    }
}

const apiSIGNIN = async(email , password) => {
    try {
        console.log('Signing In...');
        const cred = await signInWithEmailAndPassword(auth , email , password);
        // console.log('The user with email ' , cred.user.email , ' signed in successfully!');
    }catch(err) {
        console.log('Error [apiSIGNIN] : ' , err.message);
    }
}

const unsubAuth =  onAuthStateChanged(auth , (user) => {
    if (user) console.log('Logged in with: ' , user.email);
    else console.log('No one has logged in yet!');
});

apiGET_ENHANCEMENT();
// let authorName = prompt('Enter Author Name:');
// apiGET_byAuthor(authorName);
// apiGET_docByID();