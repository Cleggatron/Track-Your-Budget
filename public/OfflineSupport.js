let db;
let budgetVersion;

const request = indexedDB.open("BudgetDB", budgetVersion || 21);

request.onupgradeneeded = function(event) {
    console.log("IndexDB upgrade needed");

    const { oldVersion } = event;
    const newVersion = e.newVersion || db.version;

    console.log(`DB Updated from version ${oldVersion} to ${newVersion}`)

    db = event.target.result;

    if(db.objectStoreNames.length === 0) {
        db.createObjectStore("BudgetStore", {autoIncrement : true})
    }
};

function checkDatabase() {
    
    //open transaction on the database
    let transaction = db.transaction(["BudgetStore"], "readwrite");
    
    //access the BudgetStore Object
    const store = transaction.objectStore("BudgetStore");

    //Get all our records
    const getAll = store.getAll();

    //add our stored IndexDB entries into the online DB
    getAll.onsuccess = function() {
        if(getAll.result.length > 0){
            //TO DO
        }
    }
}

const saveRecord = (record) => {
    console.log("Saving offline");

    //open a transaction
    let transaction = db.transaction(["BudgetStore"], "readwrite");

    //Access our BudgetStore object
    const store = transaction.objectStore("BudgetStore");

    //add the record to the store
    store.add(record)
}

request.onsuccess( event => {
    console.log("Sucess");
    db.event.target.result;

    if(navigator.onLine){
        console.log("Backend Online");
        checkDatabase()
    }
})

request.onerror = (event => {
    console.log(`${event.target.errorCode}`)
})

window.addEventListener("online", checkDatabase)