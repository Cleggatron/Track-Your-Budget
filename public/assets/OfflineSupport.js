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

    
    getAll.onsuccess = function() {
        //add extant stored IndexDB entries into the online DB when back online
        if(getAll.result.length > 0){
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    'Content-Type': 'application/json'
                }
            }).then(response => response.json())
            .then((response) => {
                //IF the return response is not empty then the addition worked
                if(response.length !==0){
                    //Open another transation to the budget store with read write
                    transaction = db.transaction(["BudgetStore"], "readwrite");
                    const currentStore = transaction.objectStore("BudgetStore");

                    currentStore.clear();
                    console.log("IndexedDB cleared")
                }

            })
        }
    }
}

export function saveRecord(record){
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