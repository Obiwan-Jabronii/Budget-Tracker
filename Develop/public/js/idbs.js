let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
  const db = event.target.result;
  db.createObjectStore('new_budget', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    if(navigator.onLine) {
        uploadBudget();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

function uploadBudget() {
    const transaction = db.transaction(['new-trans'], 'readwrite');
    const transObjectStore = transaction.objectStore('new-trans');
    const getAll = transObjectStore.getAll();

    getAll.onsuccess = function() {
        if(getAll.result.length > 0 ) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if(serverResponse.message) {
                    throw new Error(serverResponse)
                }
                const transaction = db.transaction(['new_trans'], 'readwrite');
                const transObjectStore = transaction.objectStore('new_trans');

                transObjectStore.clear();
                alert('Transactions have been saved to the server.');
            })
            .catch(err => console.log(err));
        }
    }
};

function saveRecord(record) {
    const transaction = db.transaction(['new_trans'], 'readwrite');
    const transObjectStore = transaction.objectStore('new_trans');
  
    transObjectStore.add(record);
    alert('Transaction has been saved to local storage and will be moved to the database once you internet connection has been re-established.');
};
  
window.addEventListener('online', uploadBudget);