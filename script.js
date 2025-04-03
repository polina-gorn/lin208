mapboxgl.accessToken = 'pk.eyJ1IjoicG9saW5hLWdvcm4iLCJhIjoiY201eTZhdDJyMGc1ODJrcTU0ZmVqZDhmeSJ9.b3lqv0gV68Aikf5HHMdIoQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v11',
    center: [-106.6504, 35.0844], // Albuquerque
    zoom: 11
});

// Add controls
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.ScaleControl());

map.on('load', () => {
    // Add GeoJSON source with direct URL
    map.addSource('breaking-bad', {
        type: 'geojson',
        data: 'https://raw.githubusercontent.com/polina-gorn/lin208/main/Breaking_Bad.geojson'
    });

    // Add circle layer
    map.addLayer({
        id: 'locations',
        type: 'circle',
        source: 'breaking-bad',
        paint: {
            'circle-radius': 8,
            'circle-color': '#e41a1c',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
        }
    });

    // Add labels
    map.addLayer({
        id: 'location-labels',
        type: 'symbol',
        source: 'breaking-bad',
        layout: {
            'text-field': ['get', 'name'],
            'text-size': 12,
            'text-offset': [0, 1]
        },
        paint: {
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 1
        }
    });

    // Popup on click
    map.on('click', 'locations', (e) => {
        new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`
                <h6>${e.features[0].properties.name}</h6>
                <p>${e.features[0].properties.description}</p>
                ${e.features[0].properties.season ? `<small>Season: ${e.features[0].properties.season}</small>` : ''}
            `)
            .addTo(map);
    });

    // Hover effects
    map.on('mouseenter', 'locations', () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty('locations', 'circle-radius', 10);
    });

    map.on('mouseleave', 'locations', () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty('locations', 'circle-radius', 8);
    });
});