// Document ready function to ensure functions just run after everything is loaded in the document.
$(document).ready(function(){

    // Global variables for the API keys that will be used in different AJAX calls.
    const APIWeatherKey = "b37332257de420fc6dfcda2bbba28fbd";
    const APIParkKey = "IeMPkZS36TxiVcv1TUIT5yzANx6szGLJE5BsDsZA";

    // Global variable to store user state input.
    let inputStateCode

    // Global variable to save the city where the park is located, captured on address function, inside AJAX call for parks.
    let parkCity

    // Global variable to hold park code.
    let parkCode

    // Global variable to hold park alerts URL to be used in the event listener for the park button.
    let parkAlertsURL

    // Global variable to hold park campground URL to be used in the event listener for the park button.
    let parkCampURL

    // Global variable to hold park things to do URL to be used in the event listener for the park button.
    let parkThingsToDoURL

    // Global variable to hold 5-day forecast URL to be used in the event listener for the park button.
    let fiveDayWeatherURL

    // Array to store saved favorite parks.
    let favParkArray = [];
    // console.log(favParkArray);    

    // Event listner to the state options drop down menu.
    $("#stateCode").on("change", function(){
        const state = $(this).val();
        // console.log(state);
        // Update the global variable inputStateCode with the selected state.
        inputStateCode = state;
        // Call function getParks and use the select state in it.
        getParks(state);
    })

    // Call initial function.
    initial();
    
    // Function initial sets how the page should look when it is first loaded or refreshed by user.
    function initial(){
        // variable created to get items storage in the local storage and update favParkArray.
        const storedFav = JSON.parse(localStorage.getItem("favParkArray"));
        // If the saved objected in the local storage is not empty, then push the saved information to the favParkArray.
        if (storedFav !== null){
            favParkArray = storedFav;
        }
        // Call function that created button with the elements in the favParkArray.
        createFavoritesBtn();        
    }
    
    // Function that saves the favorite parks in the local storage.
    function storeParks(){
        localStorage.setItem("favParkArray", JSON.stringify(favParkArray));
    }

    // Function that list all parks for the selected state, from input on #stateCode listner event.
    function getParks(state){
    // Park API URL query by state code.
    const parkURL = "https://developer.nps.gov/api/v1/parks?api_key=" + APIParkKey + "&stateCode=" + state;
    // AJAX call for parks.
    $.ajax({
        url: parkURL,
        method: "GET"
    }).then(parkRes => {
        // console.log(parkRes);
        
        // Remove the div with class statePark to avoide duplication of buttons.
        $(".statePark").remove();

        // Create new div with class statePark.
        const stateParkDiv = $("<div class='statePark'>");

        // Attach new div to the div id left.
        $("#left").append(stateParkDiv);
        
        // forEach function that loops through API response.
        // forEach function that loops through API response.
        parkRes.data.forEach(data => {
          
            // Create a button with the name of each park returned in the response, and add class parkBtn.
            const newParkBtn = $("<button class='parkBtn waves-effect waves-light btn-small'>").text(data.name);

            // Add a data-name attribute with each park name.
            newParkBtn.attr("data-name", data.parkCode);

            // forEach function to loop through the address array and take the city name to add as a value to each button.
            data.addresses.forEach(address => {
                // console.log(address.city);
                newParkBtn.attr("data-city", address.city);                
                })

            // Append the button to section id left (we can change it later).
            $(".statePark").append(newParkBtn);
            
        })
    })}

    // Function that looks for the park alerts.
    function parkAlerts(url){
        // console.log(url)
    // AJAX call for park alerts
        $.ajax({
            url: url,
            method: "GET"
        }).then(alertRes => {
            // console.log(alertRes);

            // Remove div with class alertDiv.
            $(".alertDiv").remove();

            // Created new div and h4.
            const newAlertDiv = `<div class="alertDiv">
            <h4>Park Alerts</h4>
            </div>`;

            // Append the new div to the div with class alert. 
            $(".alert").append(newAlertDiv);

            // In case the API return without any information for that park, then display a message.
            if (alertRes.data.length === 0){
                const newAlertP1 = `<p>There are no alert messages for this park at this time.</p>`;
                $(".alertDiv").append(newAlertP1);
            }
            else {
                // If API has a populated response, than loop through it.
                alertRes.data.forEach( alert => {
                    // Create new h5, p, and if there is an url it also creates a "a" tag.
                    const newAlert = `<h5>${alert.title}</h5>
                    <p>${alert.description}</p>`;
                    
                    let newAlertA;
                    if (alert.url !== ""){newAlertA = `<a href=${alert.url}>${alert.title}</a>`};
                    // Append the new tags to the new div.
                    $(".alertDiv").append(newAlert, newAlertA);  
                })
            }
        })
    }

    // Function that looks for the park campground information.
    function parkCamp(url){
        // console.log(url);
    // AJAX call for park campgrounds
        $.ajax({
            url: url,
            method: "GET"
        }).then(campRes => {
            // console.log(campRes);

            // Remove div with class campDiv.
            $(".campDiv").remove();

            // Created new div and h4.
            const newCampDiv = `<div class="campDiv">
            <h4>Campgrounds</h4>
            </div>`;

            // Append the new div to the div with class camp. 
            $(".camp").append(newCampDiv);

            // In case the API return without any information for that park, then display a message.
            if (campRes.data.length === 0){
                const newCampP1 = `<p>There is no campground information for this park.</p>`;
                $(".campDiv").append(newCampP1);
            }
            else{
                // If API has a populated response, than loop through it.
                campRes.data.forEach(camp => {
                    // Create new h5, p, and if there is an url for reservation it also creates a "a" tag.
                    const newCamph5 = `<h5>${camp.name}</h5>
                    <p>${camp.description}`;

                    let newCampA;
                    if (camp.reservationUrl !== ""){newCampA = `<a href=${camp.reservationUrl}>Click Here for Reservation</a>`};
                    // Append the new tags to the new div.
                    $(".campDiv").append(newCamph5, newCampA);
                })
            }
        })
    }

    // Function that looks for the park activities.
    function thingsTodo(url){
        // console.log(url);
    // AJAX call for park to do
        $.ajax({
            url: url,
            method: "GET"
        }).then(toDoRes => {
            // console.log(toDoRes);

            // Remove div with class toDoDiv.
            $(".toDoDiv").remove();

            // variable to save the response path.
            const activities = toDoRes.data;

            // Created new div and h4.
            const toDoDiv = `<div class="toDoDiv">
            <h4>Park Activites</h4>
            </div>`;

            // Append the new div to the div with class toDo. 
            $(".toDo").append(toDoDiv);

            // In case the API return without any information for that park, then display a message.
            if (toDoRes.data.length === 0){
                const toDoP = `<p>There are no activities listed for this park at this time.</p>`;
                $(".toDoDiv").append(toDoP);
            }
            else{
                // Create a new ul tag and add class list to it.
                const actList = $("<ul class='list'>");
                // Append the new ul tag to the div created at variable toDoDiv.          
                $(".toDoDiv").append(actList);
                // If API has a populated response, than loop through it.
                for(let i=0; i < activities.length; i++){
                    // console.log(activities[i].activities[0].name + activities[i].title);
                    // Create a new list item for each activity type along with the activity title.
                    let listItem = `<li>${activities[i].activities[0].name} - ${activities[i].title}`;
                    // Append each new list item to the ul tag.
                    actList.append(listItem);
                }
            }
        })
    }

    // Event listner to the button that saves the favorite parks.
    $(document).on("click", ".favBtn", function(event){
        event.preventDefault();

        // Create a new object to save the information for the favorite park.
        // Grab current parkName, parkCode, parkCity and inputStateCode to be added in the new favorite parks buttons.
        const newFavorite = {
            text: parkName,
            dataName: parkCode,
            dataCity: parkCity,
            dataState: inputStateCode,
        };
        
        // Create a variable with a boolean "true" to be used as a check before creating a button.
        let notFound = true

        // forEach loop through the favParkArray objects looking if the parkName inside the object property "text" already exist with that same name. If it does, then update the variable notFound to false.
        favParkArray.forEach(fav => {
            if(fav.text === newFavorite.text){
            notFound = false}
        })
        
        // If notFound is true than push the object to the favParkArray.
        if(notFound){
         favParkArray.push(newFavorite);
        }
        // console.log(favParkArray);
        
        // Call function to store the new object in the local storage.
        storeParks();
        // Call function that creates a new button for each favorite park.
        createFavoritesBtn();
    })

    // Function that creates a new button for each favorite park.
    function createFavoritesBtn(){

        // Create a new div.
        const newFavDiv = `<div class="favButtons"></div>`;
        // Inside div with class favParkList find buttons with class favButtons and remove them. This is to avoid duplication.
        $(".favParkList").find(".favButtons").remove();

        // Append the new div to the div with class favParkList.
        $(".favParkList").append(newFavDiv);
        
        // forEach loop through each object inside the favParkArray to create a new button.
        favParkArray.forEach(favLoop => {

            // Create a button, give class favParkBtn, add text and attributes saved in the object properties so the favorite park function just like the park buttons.
            const favoritesBtn = `<button class="favParkBtn waves-effect waves-light btn-small" data-name="${favLoop.dataName}" data-city="${favLoop.dataCity}" data-state="${favLoop.dataState}">${(favLoop.text)}</button>`;
            // Append the new buttons to the div created at variable newFavDiv.
            $(".favButtons").append(favoritesBtn);
        })        
    }

    // Event listener for the button created inside the parkRes.data.forEach loop.
    $(document).on("click", ".parkBtn", function (event){
        event.preventDefault();
        
        // Updates parkCode accordingly with the button clicked.
        parkCode = $(this).attr("data-name");
        // console.log(parkCode);

        // Grab button value to update the global variable parkCity.
        parkCity = $(this).attr("data-city");
        // console.log(parkCity);

        // Grab button text to update the global variable parkName.
        parkName = $(this).text();
        
        // Create a new h4 with the park name.
        const parkNameH4 = `<h4 class="header">${parkName} National Park</h4>`;
        
        // Everytime a park name button is clicked the header is updated with the current clicked park name.
        $("header").empty().append(parkNameH4);

        // Create a button that gives the user the option to save the current park as favorite.
        const favBtn = `<button class="favBtn waves-effect waves-light btn-large">Save this park as Favorite</button>`;
        // Attach this button to the div with class favBtnDiv.
        $(".favBtnDiv").empty().append(favBtn);       

        // Update weather URL with currenty city.
        fiveDayWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial" + "&appid=" + APIWeatherKey + "&q=" + parkCity;
        // Call function forecast.
        forecast(fiveDayWeatherURL);

        // Update things to do URL with current state code and park code.
        parkThingsToDoURL = "https://developer.nps.gov/api/v1/thingstodo?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        // Call function thingsTodo.
        thingsTodo(parkThingsToDoURL);

        // Update campgrounds URL with current state code and park code.
        parkCampURL = "https://developer.nps.gov/api/v1/campgrounds?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        // Call function parkCamp.
        parkCamp(parkCampURL);

        // Update alerts URL with current state code and park code.
        parkAlertsURL = "https://developer.nps.gov/api/v1/alerts?api_key=" + APIParkKey+ "&stateCode=" + inputStateCode + "&parkCode=" + parkCode;
        // Call function parkAlerts.
        parkAlerts(parkAlertsURL);
    })

    // Event listener for the favorite parks button. Very similar to the event listner to the button "parkBtn"; however, here we do not need to create a button to save park as favorite, as it is already saved as favorite.
    $(document).on("click", ".favParkBtn", function (event){
        event.preventDefault();
        // Empty divs before appending the following to clean them before add new information.
        $(".favBtnDiv").empty();

        // Updates parkCode accordingly with the button clicked.
        parkCode = $(this).attr("data-name");
        // console.log(parkCode);

        // Updates parkCode accordingly with the button clicked.
        parkState = $(this).attr("data-state");
        // console.log(parkState);

        // Grab button value to update the global variable parkCity.
        parkCity = $(this).attr("data-city");
        // console.log(parkCity);

        // Grab button text to update the global variable parkName.
        parkName = $(this).text();
        
        // Create a new h4 with the park name.
        const parkNameH4 = `<h4 class="header">${parkName} National Park</h4>`;
        
        // Everytime a park name button is clicked the header is updated with the current clicked park name.
        $("header").empty().append(parkNameH4);

        // Update weather URL with currenty city.
        fiveDayWeatherURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial" + "&appid=" + APIWeatherKey + "&q=" + parkCity;
        // Call function forecast.
        forecast(fiveDayWeatherURL);

        // Update things to do URL with current state code and park code.
        parkThingsToDoURL = "https://developer.nps.gov/api/v1/thingstodo?api_key=" + APIParkKey+ "&stateCode=" + parkState + "&parkCode=" + parkCode;
        // Call function thingsTodo.
        thingsTodo(parkThingsToDoURL);

        // Update campgrounds URL with current state code and park code.
        parkCampURL = "https://developer.nps.gov/api/v1/campgrounds?api_key=" + APIParkKey+ "&stateCode=" + parkState + "&parkCode=" + parkCode;
        // Call function parkCamp.
        parkCamp(parkCampURL);

        // Update alerts URL with current state code and park code.
        parkAlertsURL = "https://developer.nps.gov/api/v1/alerts?api_key=" + APIParkKey+ "&stateCode=" + parkState + "&parkCode=" + parkCode;
        // Call function parkAlerts.
        parkAlerts(parkAlertsURL);
    })

    // Function created to clean the favorite parks buttons.
    $(".cleanFav").on("click", event => {
        event.preventDefault();
        // Clean local storage.
        localStorage.clear();
        // Remove the buttons for the saved favorite parks.
        $(".favParkBtn").remove();
        // Empty favParkArray.
        favParkArray = [];
    })
    
    // FFunction that looks for the forecast data.
    function forecast(url){
        // console.log(url);
        // AJAX call for the 5 days forecast.
        $.ajax({
            url: url,
            method: "GET"
        }).then(fiveDayRes => {
            // console.log(fiveDayRes);

            // Variable to hold the forecast array.
            const forecastArray = fiveDayRes.list
            // Create a new h4, h5 and div tag.
            const newDay = `<h4>5-Day Forecast</h4>
            <h5>${parkCity}</h5>
            <div class="card-deck"></div>`

            // Clean the div with id forecast-weather and append the new h5, h6, and div.
            $("#forecast-weather").empty().append(newDay);

            // For loop to take the one day out of forecast array.
            for (let i=0; i < forecastArray.length; i+=8){
                // variable to hold date and format it to javaScript.
                const date = new Date (forecastArray[i].dt_txt);

                // variable to hold icon name.
                const icon = forecastArray[i].weather[0].icon;
                
                // Create a new div with class card-body to place each day inside one.
                const newDivCardBody = `<div class="card-body">
                <p class="bold">${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png"></img>           
                <p>Temperature: <span class="bold">${forecastArray[i].main.temp}</span> ℉
                <br>Wind Speed: <span class="bold">${forecastArray[i].wind.speed}</span> mph <br>Humidity: <span class="bold">${forecastArray[i].main.humidity}</span>%
                </p>
                </div>`
                // Append the div newDivCardBody to the div created at variable newCardDeck.
                $(".card-deck").append(newDivCardBody);
            }
        })
    }
})