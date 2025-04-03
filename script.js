mapboxgl.accessToken = 'pk.eyJ1IjoicG9saW5hLWdvcm4iLCJhIjoiY201eTZhdDJyMGc1ODJrcTU0ZmVqZDhmeSJ9.b3lqv0gV68Aikf5HHMdIoQ'; 

const map = new mapboxgl.Map({
    container: 'my-web-map', 
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-87.683448393991625, 16.18954820578937], 
    zoom: 2.25 
});

//setting up a metric scale for the map layout
const scale = new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: 'metric' 
});
map.addControl(scale);

// Adding zoom and rotation controls to the map
map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

map.on('load', () => {

    map.addSource('locations', {
        type: 'vector',
        url: 'mapbox://polina-gorn.cm7v32t21441u1oqs74whk6wt-1khr2'
    });

    // map.on('sourcedata', (e) => {
    //     if (e.sourceId === 'locations' && e.isSourceLoaded) {
    //         const features = map.querySourceFeatures('locations', {
    //             sourceLayer: 'Flight_Destinations_in_2024'
    //         });
    //         console.log(features[0].properties); // logging the first feature's properties
    //         console.log(features[0].properties['tickets, cad']); // logging the price
    //     }
    // });

    map.on('mouseenter', 'locations-plane', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'locations-plane', () => {
        map.getCanvas().style.cursor = '';
    });

    // adding a symbol layer with plane icons
    map.addLayer({
        'id': 'locations-plane',
        'type': 'symbol',
        'source': 'locations',
        'source-layer': 'Flight_Destinations_in_2024',
        'layout': {
            'text-field': '✈︎', 
            'text-size': 20, 
            'text-allow-overlap': true 
        },
        'paint': {
            'text-color': [
                'case',
                ['<', ['to-number', ['get', ' tickets, cad']], 100], '#1616ed',  
                ['<', ['to-number', ['get', ' tickets, cad']], 500], '#74cbd1',  
                // ['<', ['to-number', ['get', ' tickets, cad']], 1000], '#fdae61', 
                // ['<', ['to-number', ['get', ' tickets, cad']], 2000], '#d73027',  
                '#000000' // default colour if no match
            ]
        }
        });
    //adding a symbol layer with location names
    map.addLayer({
        'id': 'locations-symbol',
        'type': 'symbol',
        'source': 'locations',
        'source-layer': 'Flight_Destinations_in_2024',
        'layout': {
            'text-field': ['get', 'name'],
            'text-variable-anchor': ['bottom'],
            'text-radial-offset': 0.5,
            'text-justify': 'auto'
        },
        'paint': {
            'text-color': 'black'
        }
    });
    // //adding a geocoder for the countries I visited
    // const geocoder = new MapboxGeocoder({
    //     accessToken: mapboxgl.accessToken,
    //     mapboxgl: mapboxgl,
    //     countries: ("us"),
    // });
    // document.getElementById('geocoder').appendChild(geocoder.onAdd(map));
});

// enabling the click feature that will show a pop-up window of the location and zoom in on the point feature

let previousZoomLevel;

map.on('click', 'locations-plane', (e) => {
    const features = e.features[0].properties;
    
    // extracting relevant data
    const ticketPrice = features[' tickets, cad'];
    const memory = features['a memory'];

    const coordinates = e.lngLat;

    previousZoomLevel = map.getZoom();  // storing current zoom level

    map.zoomTo(6, {
        center: coordinates,  // centering the map on the clicked point
        duration: 1000          // making the zoom smoother
    });

    // Popup with the data on flight price and memory from the trip
    const popup = new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(`
            <div>
                <strong>Flight Cost:</strong> ${ticketPrice ? `$${ticketPrice}` : 'N/A'}<br>
                <strong>Memory:</strong> ${memory || 'No details available'}
            </div>
        `)
        .addTo(map);

    // calling back the stored zoom level to return to the original setting
    popup.on('close', () => {
        map.zoomTo(previousZoomLevel, {
            duration: 500
        });
    });
});

document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-106.66167408767583, 35.09541420369688], // starting position [lng, lat]
        zoom: 2.5 , // starting zoom level
        essential: true
    });
});


// filtering for the text and the plane symbol to disappear if they are not on the selected continent
let boundaryvalue;

document.getElementById("boundaryfieldset").addEventListener('change', (e) => {
    boundaryvalue = document.getElementById('boundary').value;

    if (boundaryvalue === 'All') {
        map.setFilter('locations-plane', ['has', 'Continent']);
        map.setFilter('locations-symbol', ['has', 'Continent']);
    } else {
        map.setFilter('locations-plane', ['==', ['get', 'Continent'], boundaryvalue]);
        map.setFilter('locations-symbol', ['==', ['get', 'Continent'], boundaryvalue]);
    }
});