//GLOBAL ELEMENT VARIABLES
var userInputEL = document.getElementById("userInput");
var submitBtnEL = document.getElementById("submit");

//API keys
const petAPIkey = 'XGikDxKLCfIT8eGinrzrmJ5aSNQc2Wd0UkWHPMN0GRDzH5J4pA';
const secret = 'hI7Kyt4lVjtoOIywuub9YEMIzvaylnoscXD3BUzb';

let token = "";

getToken();

function getToken() {
    var queryURL = 'https://api.petfinder.com/v2/oauth2/token';
    fetch(queryURL, {
        method:"POST", 
        body:`grant_type=client_credentials&client_id=${petAPIkey}&client_secret=${secret}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    } 
    )
    .then(response=>response.json())
    .then(data=>{
        localStorage.setItem("token", data.access_token);
        console.log(data);
    })
}

function findPetsNearby(location) {
    var queryURL = `https://api.petfinder.com/v2/animals?location=${location}`;
    fetch(queryURL, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response=>{
        if(response.status == 401) {
            getToken();
        }
        console.log(response)
        return response.json();
        
    })
    .then(data=> {
        console.log(data);
    })
}
findPetsNearby("60634");
console.log(token);
//when submit is clicked, find pets nearby
$("#submit").click(function() {
    
})

var getBreedUrl = 'https://api.petfinder.com/v2/types/{dog}/breeds';
fetch(getBreedUrl , {
    method:'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "Authorization" : `Bearer ${localStorage.getItem("token")}`
    }
});

