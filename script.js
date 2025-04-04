document.addEventListener('DOMContentLoaded', function() {
    // Initialize Map
    mapboxgl.accessToken = 'pk.eyJ1IjoicG9saW5hLWdvcm4iLCJhIjoiY201eTZhdDJyMGc1ODJrcTU0ZmVqZDhmeSJ9.b3lqv0gV68Aikf5HHMdIoQ';
    
    // View configurations
    const newMexicoView = {
        center: [-106.6504, 34.5], // Centered on New Mexico
        zoom: 6.5,
        pitch: 0,
        bearing: 0
    };

    const albuquerqueView = {
        center: [-106.6504, 35.0844], // Centered on Albuquerque
        zoom: 10,
        pitch: 0,
        bearing: 0
    };

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: newMexicoView.center,
        zoom: newMexicoView.zoom
    });

    // Store original view state
    const originalView = {
        center: albuquerqueView.center,
        zoom: albuquerqueView.zoom,
        pitch: 0,
        bearing: 0
    };
    let currentFeatureView = null;

    // Add controls
    map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');
    map.addControl(new mapboxgl.ScaleControl({ unit: 'metric' }));

    const welcomePopup = document.getElementById('welcome-popup');
    const closeWelcomeBtn = document.getElementById('close-welcome');
    const gotItBtn = document.getElementById('got-it-btn');

    // Show welcome popup on first visit
   // if (!localStorage.getItem('mapWelcomeSeen')) {
   if (true) {
        setTimeout(() => {
            welcomePopup.classList.add('active');
        }, 1000); // Show after 1 second delay
    }

    // Close welcome popup
    function closeWelcome() {
        welcomePopup.classList.remove('active');
        localStorage.setItem('mapWelcomeSeen', 'true');
    }

    closeWelcomeBtn.addEventListener('click', closeWelcome);
    gotItBtn.addEventListener('click', closeWelcome);

    // Add this inside your DOMContentLoaded event listener

// Suggestion Box Functionality
const suggestionBox = document.getElementById('suggestion-box');
const suggestionToggle = document.getElementById('suggestion-toggle');
const suggestionForm = document.getElementById('suggestion-form');
const formSuccess = document.createElement('div');
formSuccess.id = 'form-success';
formSuccess.textContent = 'Thanks! Your suggestion has been submitted.';
suggestionForm.appendChild(formSuccess);

// Toggle form visibility
suggestionToggle.addEventListener('click', () => {
    suggestionBox.classList.toggle('expanded');
});

// Form submission handler
suggestionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        email: document.getElementById('suggestion-email').value,
        location: document.getElementById('suggestion-location').value,
        moment: document.getElementById('suggestion-moment').value,
        topic: document.getElementById('suggestion-topic').value,
        timestamp: new Date().toISOString()
    };

    try {
        // Using FormSubmit.co service (free)
        const response = await fetch('https://formsubmit.co/ajax/YOUR_EMAIL@gmail.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        if (result.success) {
            formSuccess.style.display = 'block';
            suggestionForm.reset();
            setTimeout(() => {
                formSuccess.style.display = 'none';
                suggestionBox.classList.remove('expanded');
            }, 3000);
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit suggestion. Please try again later.');
    }
});

    // Get DOM elements
    const sidePanel = document.getElementById('side-panel');
    const panelContent = document.getElementById('panel-content');
    const closePanelBtn = document.getElementById('close-panel');
    const mapContainer = document.getElementById('map');

    // Close panel and return to original view
    function closePanel() {
        sidePanel.classList.remove('active');
        mapContainer.style.marginRight = '0';
        
        // Smoothly return to original view
        map.flyTo({
            center: originalView.center,
            zoom: originalView.zoom,
            bearing: originalView.bearing,
            pitch: originalView.pitch,
            speed: 1.2,
            curve: 1,
            essential: true
        });
    }

    // Close panel function
    closePanelBtn.addEventListener('click', closePanel);

    // Function to extract YouTube ID
    const getYouTubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Audio elements
const audioPlayer = document.getElementById('feature-audio');
const playBtn = document.getElementById('play-btn');
const muteBtn = document.getElementById('mute-btn');
const progressBar = document.querySelector('.progress-bar');
const timeDisplay = document.querySelector('.time');

// Format time (seconds to MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Update progress bar
function updateProgress() {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.setProperty('--progress', `${percent}%`);
    timeDisplay.textContent = formatTime(audioPlayer.currentTime);
}

// Play/pause toggle
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playBtn.classList.add('playing');
        playBtn.innerHTML = '<i class="play-icon">❚❚</i>';
    } else {
        audioPlayer.pause();
        playBtn.classList.remove('playing');
        playBtn.innerHTML = '<i class="play-icon">▶</i>';
    }
});

// Mute toggle
muteBtn.addEventListener('click', () => {
    audioPlayer.muted = !audioPlayer.muted;
    muteBtn.innerHTML = audioPlayer.muted ? 
        '<i class="volume-icon">🔇</i>' : 
        '<i class="volume-icon">🔊</i>';
});

// Update progress as audio plays
audioPlayer.addEventListener('timeupdate', updateProgress);

// Reset when audio ends
audioPlayer.addEventListener('ended', () => {
    playBtn.classList.remove('playing');
    playBtn.innerHTML = '<i class="play-icon">▶</i>';
    progressBar.style.setProperty('--progress', '0%');
    timeDisplay.textContent = '0:00';
});

// In your feature click handler:
map.on('click', 'locations', (e) => {
    const props = e.features[0].properties;
    
    // ... existing code to show panel ...
    
    // Set audio source if available
    if (props.voice) {
        audioPlayer.src = props.voice;
        document.querySelector('.audio-player-container h4').textContent = 
            props.audioTitle || 'Audio Analysis';
        
        // Load metadata to get duration
        audioPlayer.addEventListener('loadedmetadata', () => {
            timeDisplay.textContent = formatTime(audioPlayer.duration);
        });
    } else {
        document.querySelector('.audio-player-container').style.display = 'none';
    }
});

    map.on('load', async () => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/polina-gorn/lin208/main/Breaking_Bad.geojson');
            if (!response.ok) throw new Error('Failed to fetch GeoJSON');
            const data = await response.json();

            map.addSource('breaking-bad', {
                type: 'geojson',
                data: data
            });

            // Add circle layer for locations
            map.addLayer({
                id: 'locations',
                type: 'circle',
                source: 'breaking-bad',
                paint: {
                    'circle-radius': 8,
                    'circle-color': [
                        'match',
                        ['get', 'Topic'],
                        'Subverting', '#008837',
                        'Reinforcing', '#7b3294',
                        '#777'
                    ],
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff',
                    'circle-opacity': 1
                }
            });

            // Add labels
            map.addLayer({
                id: 'location-labels',
                type: 'symbol',
                source: 'breaking-bad',
                layout: {
                    'text-field': ['get', 'Location'],
                    'text-size': 14,
                    'text-offset': [1, 1],
                    'text-allow-overlap': false
                },
                paint: {
                    'text-color': '#000000',
                    'text-halo-color': '#ffffff',
                    'text-halo-width': 2
                }
            });

            // Set initial filters to show all locations
            map.setFilter('locations', ['has', 'Topic']);
            map.setFilter('location-labels', ['has', 'Topic']);

            // Click handler for locations
            map.on('click', 'locations', (e) => {
                const props = e.features[0].properties;
                const coordinates = e.features[0].geometry.coordinates.slice();
                
                // Store current feature view
                currentFeatureView = {
                    center: coordinates,
                    zoom: 16
                };
                
                // Move map to the left and zoom in
                mapContainer.style.marginRight = '400px';
                map.flyTo({
                    center: coordinates,
                    zoom: 16,
                    speed: 1.2,
                    curve: 1,
                    essential: true
                });

                // Create panel content
                let videoEmbed = '';
                if (props.Video) {
                    const videoUrls = props.Video.split(';').map(url => url.trim());
                    videoEmbed = videoUrls.map(url => {
                        const videoId = getYouTubeId(url);
                        return videoId ? `
                            <div class="video-container">
                                <iframe src="https://www.youtube.com/embed/${videoId}" 
                                        frameborder="0" 
                                        allowfullscreen></iframe>
                            </div>
                        ` : `<p><a href="${url}" target="_blank">View Video</a></p>`;
                    }).join('');
                }
                
                panelContent.innerHTML = `
                    <h3>${props.Location}</h3>
                    <p><strong>Moment:</strong> ${props.Moment}</p>
                    ${videoEmbed}
                    <div class="analysis-section">
                        <h4>Analysis</h4>
                        <p>${props.Analysis}</p>
                    </div>
                `;
                
                sidePanel.classList.add('active');
            });

            // Return to original view when clicking map background
            map.on('click', (e) => {
                if (!sidePanel.classList.contains('active')) return;
                
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ['locations']
                });
                
                if (features.length === 0) {
                    closePanel();
                }
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

            // Filter and zoom handler
            document.getElementById("boundaryfieldset").addEventListener('change', (e) => {
                const selectedValue = document.getElementById('boundary').value;
                
                // Apply filters and adjust view
                if (selectedValue === 'All') {
                    map.setFilter('locations', ['has', 'Topic']);
                    map.setFilter('location-labels', ['has', 'Topic']);
                    map.flyTo(newMexicoView);
                    originalView.center = newMexicoView.center;
                    originalView.zoom = newMexicoView.zoom;
                } 
                else if (selectedValue === 'Subverting') {
                    map.setFilter('locations', ['==', ['get', 'Topic'], 'Subverting']);
                    map.setFilter('location-labels', ['==', ['get', 'Topic'], 'Subverting']);
                    map.flyTo(newMexicoView);
                    originalView.center = newMexicoView.center;
                    originalView.zoom = newMexicoView.zoom;
                }
                else if (selectedValue === 'Reinforcing') {
                    map.setFilter('locations', ['==', ['get', 'Topic'], 'Reinforcing']);
                    map.setFilter('location-labels', ['==', ['get', 'Topic'], 'Reinforcing']);
                    map.flyTo(albuquerqueView);
                    originalView.center = albuquerqueView.center;
                    originalView.zoom = albuquerqueView.zoom;
                }
            });

        } catch (error) {
            console.error('Error loading map data:', error);
            alert('Failed to load map data. Please check console for details.');
        }
    });
});