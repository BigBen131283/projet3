/*
    user.js

    Mar 15 2022   Initial

*/

export default class user {

    constructor() {
        this.version = "city.js 1.01 Mar 15 2022 : ";
        this.userlist = [];
        let call = this.loadUserDB().then( (response) => {
            this.userlist = response;
        })
    }
    // ----------------------------------------------- 
    // Retrieve the json list of all stations for a 
    // given contract name from JCDecaux open data
    // ----------------------------------------------- 
    loadUserDB() {
        return new Promise( (resolve, reject) => {
            let request =  fetch('../userlist.json')
            .then( response => {
                return response.json();
            })
            .then( json =>  {
                this.citystations = json;
                resolve(json);
            })
            .catch (error => {
                this.log(error)
                reject(error);
                }
            )
        })
    }
    // ---------------------------------------------
    searchUser(cardid) {
        let oneuser = { 
            "cardid": "UNKNOWN",
            "fname": "",
            "lname": "",
            "status": false,
            "mobile": "",
            "mail": "",
            "reservation" : {}
        }
        for(let i = 0; i < this.userlist.length; i++) {
            if(this.userlist[i].cardid === cardid) {
                oneuser = this.userlist[i];
                break;
            }
        }
        return oneuser;
    }
    // ---------------------------------------------
    getUsersList() {
        return this.userlist();
    }
    // ----------------------------------------------- 
    log(message) {
        console.log(this.version + message);
    }
}