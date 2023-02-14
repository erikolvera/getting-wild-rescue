//GLOBAL ELEMENT VARIABLES
var userInputEL = document.getElementById("userInput");
var submitBtnEL = document.getElementById("submit");

//API keys
const petAPIkey = 'XGikDxKLCfIT8eGinrzrmJ5aSNQc2Wd0UkWHPMN0GRDzH5J4pA';
const secret = 'hI7Kyt4lVjtoOIywuub9YEMIzvaylnoscXD3BUzb';

let token = "";

//dog api keys

const url = "https://api.thedogapi.com/v1/images/search?limit=10";
const api_key = "live_tixKAnEqLJ2vdEof1D0C20MT6WhTiOxVaDKJ1buCcBaDJQzYgvNLYGVsaFHs25zT";

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
        //sort through all the data
        for(var i = 0; i < data.animals.length; i++) {
            //determine what page the user is currently on
            if(isDogPage) {
                //obtain only data for dogs
                if(data.animals[i].type == "Dog") {
                    console.log(data.animals[i]);
                }
            } else if(isCatPage) {
                //obtain only data for cats
                if(data.animals[i].type == "Cat") {
                    console.log(data.animals[i]);
                }
            }
        }
    })
}

//when submit is clicked, find pets nearby
$("#submit").click(function() {
    console.log(userInputEL.value)
    findPetsNearby(userInputEL.value);
    return false;
})

function setImages(){
    fetch(url,{headers:{
        "live_tixKAnEqLJ2vdEof1D0C20MT6WhTiOxVaDKJ1buCcBaDJQzYgvNLYGVsaFHs25zT": api_key
        }})
        .then((response) => {
            return response.json();
        })
        .then((data) => $(".img").attr("src", data[0].url))
}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

setImages();

