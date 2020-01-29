/** These are the Temple & Town listings that will be shown to the user.*/
var map, infowindow, bounds;
var marker = [];
//FourSquare API URL details
var BaseUrl = "https://api.foursquare.com/v2/venues/",
    fs_client_id = "client_id=J4JTA0KKSKB50R1ONPYB3W4H532SPS403IHJKL4VQMNMNKT0",
    fs_client_secret = "&client_secret=W5FBT3FTE1X4RVJXPSJJDNNXCYHXL0OMH1TPVINZ40NO0LX5",
    fs_version = "&v=20161507";

var locations = [{
        "name": "Sri yoga Anjaneyar Temple",
        "location": {
            "lat": 13.0886254,
            "lng": 79.4181792
        },
        "info": " Yoga Anjaneyar Temple is a Hindu temple devoted to Lord Hanuman ",
        "type": "temple",
        "foursquareid": "4d7d818579c4b1f76fe90ef3"
    },
    {
        "name": "Sri Yoga Narasimhar Temple",
        "location": {
            "lat": 13.0888476,
            "lng": 79.4183762
        },
        "info": " Yoga Narasimhar Temple is a Hindu temple devoted to Lord Vishnu ",
        "type": "temple",
        "foursquareid": "52f8693c498e31ec88d2fd33"
    },
    {
        "name": "Golden Temple, Sripuram",
        "location": {
            "lat": 12.8741475,
            "lng": 79.0883521
        },
        "info": " The golden temple complex inside the Sripuram (Tamil: திருபுரம்) spiritual park " +
            "is situated at the foot of a small range of green hills at Thirumalaikodi (or simply Malaikodi) village," +
            "8 km from Vellore",
        "type": "temple",
        "foursquareid": "4c219558502b952126cc6d21"
    },
    {
        "name": "Ratnagiri Murugan Temple",
        "location": {
            "lat": 12.9414012,
            "lng": 79.2448379
        },
        "info": " Ratnagiri Balamurugan temple is an ancient Murugan temple situated in Thirumanikundram,Vellore, India. ",
        "type": "temple",
        "foursquareid": "50ecff36e4b0ffbaa91f8002"
    },
    {
        "name": "Sri Murugan Temple",
        "location": {
            "lat": 12.9382566,
            "lng": 79.15478689999999
        },
        "info": " Sri Murugan Temple is a Hindu temple and one of the Six Abodes of Murugan",
        "type": "temple",
        "foursquareid": "500fece2e4b083b16d63650d"
    },
    {
        "name": "Arakkonam",
        "location": {
            "lat": 13.0752392,
            "lng": 79.6558242
        },
        "info": " Arakkonam is a municipality town in the Indian state of Tamil Nadu," +
            "with a population of about 101,626 as per the census 2011.",
        "type": "town",
        "foursquareid": "515d02cbe4b0fab89d92ded3"
    },
    {
        "name": "Vellore",
        "location": {
            "lat": 12.9214967,
            "lng": 79.1280402
        },
        "info": " Vellore (formerly known as Rayavelur or Vellaimaanagar) is a sprawling city" +
            " and the administrative headquarters of Vellore District in the South Indian state of Tamil Nadu. ",
        "type": "town",
        "foursquareid": "4c8c815e509e370400533455"
    }
];
//assigning two different icons for temple and town separately
var icons = {
    temple: {
        icon: 'img/temple.png'
    },
    town: {
        icon: 'img/town.png'
    }
};
//googleSuccess() is called when page is loaded
function googleSuccess() {
    //Google map elements - set map options
    var mapOptions = {
        "center": {
            "lat": 13.1115847,
            "lng": 79.4310052
        },
        zoom: 13,
        styles: [{
            featureType: 'water',
            stylers: [{
                color: '#19a0d8'
            }]
        }, {
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [{
                    color: '#ffffff'
                },
                {
                    weight: 6
                }
            ]
        }, {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [{
                color: '#e85113'
            }]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{
                    color: '#efe9e4'
                },
                {
                    lightness: -40
                }
            ]
        }, {
            featureType: 'transit.station',
            stylers: [{
                    weight: 9
                },
                {
                    hue: '#e85113'
                }
            ]
        }, {
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [{
                visibility: 'off'
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{
                lightness: 100
            }]
        }, {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{
                lightness: -100
            }]
        }, {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{
                    visibility: 'on'
                },
                {
                    color: '#f0e4d3'
                }
            ]
        }, {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{
                    color: '#efe9e4'
                },
                {
                    lightness: -25
                }
            ]
        }],
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        }
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //info window
    infowindow = new google.maps.InfoWindow({
        maxWidth: 200,
        content: ""
    });
    // Recenter map upon window resize
    var center;

    function calculateCenter() {
        center = map.getCenter();
    }
    google.maps.event.addDomListener(map, 'idle', function() {
        calculateCenter();
    });
    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(center);
    });

    google.maps.event.addDomListener(window, 'resize', function() {
        map.setCenter(center);
    });
    bounds = new google.maps.LatLngBounds();
    //creating the Temple Town object
    var tempTown = function(data, id, map) {
        var self = this;
        this.name = ko.observable(data.name);
        this.location = data.location;
        this.type = data.type;
        this.info = data.info;
        this.foursquareid = data.foursquareid;
        this.photoUrl = "";
        this.show = ko.observable(true);

    };
    // Get content  for the infowindows
    function getinfoWindowContent(tempTown) {
        var content = "<h3>" + tempTown.name + "<hr>" + tempTown.info +
            "</h3><br><div style='width:200px;min-height:120px'><img src=" + '"' +
            tempTown.photoUrl + '"></div><div><a href="' +
            '" target="_blank">More info in Foursquare</a><img src="img/foursquare_150.png">';
        if (tempTown.name.length > 0) {
            return content;
        }
    }
    //Animation for markers
    function toggleBounce(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout((function() {
                marker.setAnimation(null);
            }).bind(this), 750);
        }
    }

    function myViewModel() {
        var self = this;
        this.locationList = ko.observableArray([]);
        this.reducedInput = ko.observable('');
        //creating list elements from Location List
        locations.forEach(function(item) {
            self.locationList.push(new tempTown(item));
        });
        //Creating Markers, their infowindow and bounce when selected
        this.locationList().forEach(function(tempTown) {
            marker = new google.maps.Marker({
                position: tempTown.location,
                icon: icons[tempTown.type].icon,
                animation: google.maps.Animation.DROP,
                map: map
            });
            tempTown.marker = marker;
            marker.addListener('click', function(e) {
                map.setZoom(12);
                map.panTo(this.position);
                infowindow.setContent(getinfoWindowContent(tempTown));
                infowindow.open(map, marker);
                toggleBounce(marker);

            });
        });
        // Filtering the Space list
        self.filter = ko.observable("");

        this.filteredLocationList = ko.dependentObservable(function() {
            var search = this.filter().toLowerCase();
            if (!search) {
                return ko.utils.arrayFilter(self.locationList(), function(item) {
                    item.marker.setVisible(true);
                    return true;
                });
            } else {
                return ko.utils.arrayFilter(this.locationList(), function(item) {
                    if (item.name.toLowerCase().indexOf(search) >= 0) {
                        return true;
                    } else {
                        item.marker.setVisible(false);
                        return false;
                    }
                });
            }
        }, this);

        this.showLocation = function(locationList) {
            google.maps.event.trigger(locationList.marker, 'click');
        };
        //Foursquare API request
        self.getFoursquareData = ko.computed(function() {
            self.locationList().forEach(function(tempTown) {
                var venueId = tempTown.foursquareid + "/?";
                var api_url = BaseUrl + venueId + fs_client_id + fs_client_secret + fs_version;
                //// AJAX call to Foursquare
                $.ajax({
                    type: "GET",
                    url: api_url,
                    dataType: "json",
                    success: function(data) {
                        var response = data.response ? data.response : "";
                        var venue = response.venue ? data.venue : "";
                        tempTown.name = response.venue.name;
                        tempTown.photoUrl = response.venue.bestPhoto["prefix"] + "height150" +
                response.venue.bestPhoto["suffix"];
                    }
                });
            });
        });
    }

    function mapError() {
        alert("Google maps  could not be loaded.Kindly try again later");
    }

    ko.applyBindings(myViewModel);
}