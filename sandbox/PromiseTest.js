
/* -----------------------------------------------------------------------------------------
        May 05 2022     Initial for TONO 
                        The goal is to understand Promises and ASYNC calls
----------------------------------------------------------------------------------------- */


// ---------------------------------------------------------
//  Utilities
// ---------------------------------------------------------
//  Logger 
// ---------------------------------------------------------
function log(message) {
    console.log(getTime() + ': ' + message);
}
// ---------------------------------------------------------
//  Sleep on demand 
// ---------------------------------------------------------
function sleep(ms, initmess) { 
    log(initmess);
    return new Promise(resolve => setTimeout(resolve, ms)); 
}
function getTime() {
    let d = new Date();
    return d.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1") ;
}
// ---------------------------------------------------------
// Function to test Promise 
// ---------------------------------------------------------
function testPromise(delay, message) {
    return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(message + ' after ' + delay + ' ms');
                }, delay);
            });
}
// ---------------------------------------------------------
// Call testPromise
// Use await / async
// ---------------------------------------------------------
( async () => {
    log("[ START ] 1st await job")
    await testPromise(5000, '[ END ] 1st await job done').then( (resp) => {
        log(resp);
    })
    log("[ START ] 2nd await job")
    await testPromise(1000, '[ END ] 2nd await job done').then( (resp) => {
        log(resp);
    })
})()

// ---------------------------------------------------------
// Another cool way to do this
// ---------------------------------------------------------
const macro = async ( message, f) => {
    log(message);
    await f.then( (resp) => {
        log(resp);
    });
};
macro("[ START ] Macro10 call 10 sec", testPromise(10000, '[ END ] Macro10'));
macro("[ START ] Macro14 call 14 sec", testPromise(14000, '[ END ] Macro14'));


// ---------------------------------------------------------
// M A I N : T E S T S    S T A R T S     H E R E
// ---------------------------------------------------------
// Call sleep which is a function returning a Promise
// after a given delay
// ---------------------------------------------------------
sleep(5000, '[ START ] 1st sleep for 5 sec')
    .then( () => log(`[ END ]  1st sleep`));
sleep(3000, '[ START ] 2nd sleeping for 3 sec')
    .then( () => log('[ END ] 2nd sleep'));

// ---------------------------------------------------------
// Now test three async tasks tied together
// It means all tasks must be finished before processing 
// the results. Here we have 3 jobs with various computing 
// tasks taking 1, 2 and 5 seconds
// ---------------------------------------------------------

let req1 = new Promise((resolve, reject) => {
    log("[ START ] req1");
    setTimeout(() => {
        resolve('1 sec Delay OK');
    }, 1000);
});
let req2 = new Promise((resolve, reject) => {
    log("[ START ] req2");
    setTimeout(() => {
        resolve('2 sec Delay OK');
    }, 2000);
});
let req3 = new Promise((resolve, reject) => {
    log("[ START ] req3");
    setTimeout(() => {
        resolve('5 sec Delay OK');
    }, 5000);
});
// This is the place where the synchronization occurs
// Promise.all takes a parameter which is an array of 
// Promises
Promise.all([req1, req2, req3])
    .then( (results) => {
        log('[ END ] --------------- Results for tightly coupled tasks ------------------------');
        log(`[ END ] req1 result : ${results[0]}`);
        log(`[ END ] req2 result : ${results[1]}`);
        log(`[ END ] req3 result : ${results[2]}`);
    })
    .catch( error => {
        log(error)
    })


