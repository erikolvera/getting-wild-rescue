//Youtube 
fetch("https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=eWT-zSXbxk0&key=AIzaSyBkOuqvGwJI1J4KV9gZwsu1cFNF0x8x9Hs")
.then((result)=>{
    return result.json()
}).then((data)=>{
    console.log(data)
    var video = data.items
    var videoContainer = document.querySelector(".youtube-video")
})

//Will display a youtube video on main page
var obj = {"video": {
    "value": "<iframe title='YouTube video player' type=\"text/html\" src='http://www.youtube.com/embed/eWT-zSXbxk0' width='640' height='390' frameborder='0' allowFullScreen></iframe>"
}}
    
$("#test").html(obj.video.value);

//GLOBAL ELEMENT VARIABLES
var userInputEL = document.getElementById("userInput");
var submitBtnEL = document.getElementById("submit");
var petContEL = document.getElementById("petContainer");
var youtubeKey = 'AIzaSyBkOuqvGwJI1J4KV9gZwsu1cFNF0x8x9Hs'


//API keys
const petAPIkey = 'XGikDxKLCfIT8eGinrzrmJ5aSNQc2Wd0UkWHPMN0GRDzH5J4pA';
const secret = 'hI7Kyt4lVjtoOIywuub9YEMIzvaylnoscXD3BUzb';

let token = "";

//obtain token for the PetFinder API
getToken();

function getToken() {
    //obtain token with given key and secret
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
        //store token in localstorage to be used again
        localStorage.setItem("token", data.access_token);
    })
}

function findPetsNearby(location) {
    //grab URL that allows for zipcode input
    var queryURL = `https://api.petfinder.com/v2/animals?location=${location}`;
    fetch(queryURL, {
        //first grab token in order to get data
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "Authorization" : `Bearer ${localStorage.getItem("token")}`
        }
    })
    .then(response=>{
        //if token is expired, then get a new one and store it
        if(response.status == 401) {
            getToken();
        }
        return response.json();
    })
    .then(data=> {
        clearcontent("petContainer");
        //sort through all the data
        for(var i = 0; i < data.animals.length; i++) {
            //determine what page the user is currently on
            if(isDogPage) {
                //obtain only data for dogs
                if(data.animals[i].type == "Dog") {
                    console.log(data.animals[i])
                    generatePetResults(data.animals[i]);
                }
            } else if(isCatPage) {
                //obtain only data for cats
                if(data.animals[i].type == "Cat") {
                    console.log(data.animals[i]);
                    generatePetResults(data.animals[i]);
                }
            }
        }
    })
}

function generatePetResults(info) {
    //create container for each individual pet
    var cardDiv = document.createElement("div");

    //create header for pet name
    var cardHeader = document.createElement("h4");
    cardHeader.innerText = info.name;

    //create img element for the pet image
    var cardPhoto = document.createElement("img");
    var imageURL = info.primary_photo_cropped?.small;
    cardPhoto.setAttribute("src", imageURL);

    //create paragraph with pet's age, breed, and its contact info
    var cardPara = document.createElement("pre");
    const node = document.createTextNode("Age: " + info.age 
    + "\nPrimary Breed: " + info.breeds.primary 
    + "\nContact us for more about this pet"
    + "\nEmail: " + info.contact.email 
    + "\nPhone: " + info.contact.phone);
    cardPara.append(node);

    cardDiv.appendChild(cardHeader);
    cardDiv.appendChild(cardPhoto);
    cardDiv.appendChild(cardPara);

    var br = document.createElement("br");
    cardDiv.appendChild(br);

    petContEL.append(cardDiv);
}

//clear container for next search
function clearcontent(elementID) {
    document.getElementById(elementID).innerHTML = "";
}

//when submit is clicked, find pets nearby
$("#submit").click(function() {
    console.log(userInputEL.value)
    findPetsNearby(userInputEL.value);
    return false;
})