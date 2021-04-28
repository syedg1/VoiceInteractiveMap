// Welcome the user after they click the start button
document.getElementById("start").onclick = function()
{
  voiceFeedback("Welcome to Hamilton, say a command from the commands list!"); 
}

if (annyang) {

  // Commands are defined as keys and values in an object, the key is the 
  // text for the command, and the value is callback function (i.e. event 
  // handler) to call for the command
  var commands = {

    // If "information about X" is uttered, we show on the page "Here is some
    // information about X".  
    "information about *subject" :
    function(subject) 
    {
        if (subject.includes("Hamilton")) {
            voiceFeedback("Hamilton is a Canadian port city on the western tip of Lake Ontario. The Niagara Escarpment, a huge, forested ridge known locally as the mountain dotted with conservation areas and waterfalls, divides the city");
        } else if (subject.includes("industry")) {
            voiceFeedback("Hamilton is one of Canada's leading industrial centres. Its iron and steel industry, which began in the mid 19th century, has grown to become Canada's largest");
        } else if  (subject.includes("population")) {
            voiceFeedback("Hamilton is Ontario’s fifth most-populous city, but it ranks 27th for population density.");
            voiceFeedback("This means that there is plenty of space for everybody. Properties can be large, with plenty of garden space, and a large share of the population lives in dispersed suburbs around the downtown core.")
        } else if (subject.includes("history")) {
            voiceFeedback("The site was visited by the French explorer René-Robert Cavelier in 1669. Settlement began with the arrival of loyalists fleeing the rebellious 13 American colonies in 1778. The city was named after George Hamilton, who laid out the original town in 1815 ");
        } else {
            voiceFeedback("Sorry, I did not get that!");
        }    
    },

    // If "show firestations" or "show libraries" are uttered, the map will 
    // be populated with pushpins for firestations or libraries
    //
    // We use the firestations.js and libraries.js data above to do so, note 
    // that we know how to access the data structure be examining the data 
    // structure... so we can see for example that firestations.features 
    // contains an array of objects with firestation data, and we can see 
    // that firestations.features[i].properties contains latitude, longitude
    // and name data.  
    //
    // You could use a tool like this to help you visualize the data:
    //    http://jsonviewer.stack.hu/
    //
    "show *type": 
    function(type)
    {    
        if (type.includes("parks")) {
            voiceFeedback("Here are some parks near you!");
            // loop through the array of libraries in the libraries.js data
            for (i = 0; i < parks.features.length; i++) 
            {
            
            if (parks.features[i].geometry.type == 'MultiPolygon') {
                console.log('multipolygon');
                var latitude = parks.features[i].geometry.coordinates[0][0][0][1];
                var longitude = parks.features[i].geometry.coordinates[0][0][0][0];
            } else if (parks.features[i].geometry.type == 'Polygon') {
                console.log('polygon');
                var latitude = parks.features[i].geometry.coordinates[0][0][1];
                var longitude = parks.features[i].geometry.coordinates[0][0][0];
            } else {
                console.log(parks.features[i].geometry.type);
                var latitude = parks.features[i].geometry.coordinates[0][1];
                var longitude = parks.features[i].geometry.coordinates[0][0];
            }

            console.log(latitude);
            // add a pushpin to the map for each library
            map.entities.push(
                new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                    // use the latitude & longitude data for the pushpin position
                    latitude, 
                    longitude
                ),
                // use the library name for the label 
                {title: parks.features[i].properties.NAME}
                ));
            }
        }  
        else if (type.includes("museums"))
        {
            voiceFeedback("Here are some museums near you!");
            // loop through the array of libraries in the libraries.js data
            for (i = 0; i < museums.features.length; i++) 
            {
            // add a pushpin to the map for each library
            map.entities.push(
                new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                    // use the latitude & longitude data for the pushpin position
                    museums.features[i].properties.LATITUDE,
                    museums.features[i].properties.LONGITUDE,
                ),
                // use the library name for the label 
                {title: museums.features[i].properties.NAME}
                ));
            }
        }  
        else if (type.includes("water"))
        {
            voiceFeedback("Here are some waterfalls near you!");
            // loop through the array of libraries in the libraries.js data
            for (i = 0; i < waterfalls.features.length; i++) 
            {
            // add a pushpin to the map for each library
            map.entities.push(
                new Microsoft.Maps.Pushpin(
                new Microsoft.Maps.Location(
                    // use the latitude & longitude data for the pushpin position
                    waterfalls.features[i].properties.LATITUDE,
                    waterfalls.features[i].properties.LONGITUDE,
                ),
                // use the library name for the label 
                {title: waterfalls.features[i].properties.NAME}
                ));
            }
        } else {
            voiceFeedback("Sorry, I did not get that!");       
        }   
        },

        // If "clear map" is uttered all pushpins are removed from the map
        "clear map" :
        function()
        {
            voiceFeedback("Clearing map!");
            // Code to remove all pushpins is taken directly from the API docs:
            // https://www.bing.com/api/maps/sdkrelease/mapcontrol/isdk/deletepushpins
            for (i = map.entities.getLength() - 1; i >= 0; i--) {
                var pushpin = map.entities.get(i);
                if (pushpin instanceof Microsoft.Maps.Pushpin) {
                map.entities.removeAt(i);
                }
            }
        },

        // Any other utterance will be caught by this case, and we use the 
        // Bing Maps geolocation service to find a latitude and longitude 
        // position based on the utterance:
        //  https://www.bing.com/api/maps/sdkrelease/mapcontrol/isdk/searchbyaddress#JS
        // We then place a pushpin on the map at that location.
        //
        // So if we say "Dundas, Ontario" or "Toronto, Ontario" it will 
        // attempt to find the location and put a pushpin on the map there
        "*catchall" :
        function(catchall) 
        {
            voiceFeedback("Sorry, I did not get that!");
        }
    };

  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start({ autoRestart: true, continuous: true });
}


// Loads the map, called after Bing map library finishes loading
function loadmap()
{
  // Create a map centered on Hamilton, Ontario
  map = new Microsoft.Maps.Map(document.getElementById("myMap"), 
    {
      center: new Microsoft.Maps.Location(43.2557, -79.8711),
      // we could set additional options when we create the map...
      // mapTypeId: Microsoft.Maps.MapTypeId.aerial,
      // zoom: 12        
    });

  // Load the search manager that allows us to search for locations 
  // (lat and long positions) based on an address, e.g. Toronto, Ontario
  Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
    searchManager = new Microsoft.Maps.Search.SearchManager(map);
  });
}

function voiceFeedback(string) {
    var synth = window.speechSynthesis;
    var utterText = string;
    var utterThis = new SpeechSynthesisUtterance(utterText);
    utterThis.pitch = 1.0;
    utterThis.rate = 0.9;
    synth.speak(utterThis);
}
