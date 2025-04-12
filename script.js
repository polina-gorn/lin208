document.addEventListener('DOMContentLoaded', function () {
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
        style: 'mapbox://styles/polina-gorn/cm98x01fw002y01s889steatu',
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

    // Get audio element (ADD THIS)
    const welcomeAudio = document.getElementById('welcome-audio');
    welcomeAudio.volume = 0.3; // Set volume to 30%

    const welcomePopup = document.getElementById('welcome-popup');
    const closeWelcomeBtn = document.getElementById('close-welcome');
    const gotItBtn = document.getElementById('got-it-btn');
    const muteWelcomeBtn = document.getElementById('mute-welcome-btn');
    let isWelcomeMuted = false;

    muteWelcomeBtn.addEventListener('click', () => {
        isWelcomeMuted = !isWelcomeMuted;
        welcomeAudio.muted = isWelcomeMuted;
        muteWelcomeBtn.textContent = isWelcomeMuted ? "🔊" : "🔇";
        muteWelcomeBtn.title = isWelcomeMuted ? "Unmute" : "Mute";
    });

    // Show welcome popup on first visit - MODIFY THIS BLOCK
    if (true) { // Change to false after testing
        setTimeout(() => {
            welcomePopup.classList.add('active');

            // Try to autoplay (ADD THIS)
            const playPromise = welcomeAudio.play();

            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    // Autoplay was prevented - show play button
                    showAudioFallback();
                });
            }
        }, 1000);
    }

    // Add this new function (ADD THIS)
    function showAudioFallback() {
        const playBtn = document.createElement('button');
        playBtn.innerHTML = '▶ PLAY THEME MUSIC';
        playBtn.style.cssText = `
              position: absolute;
              top: 10px;
              right: 80px;
              background: #7b3294;
              color: white;
              border: none;
              padding: 5px 10px;
              border-radius: 5px;
              cursor: pointer;
              z-index: 1001;
          `;
        playBtn.onclick = () => {
            welcomeAudio.play();
            playBtn.remove();
        };
        welcomePopup.querySelector('.popup-content').appendChild(playBtn);
    }

    // Close welcome popup - MODIFY THIS FUNCTION
    function closeWelcome() {
        welcomePopup.classList.remove('active');
        welcomeAudio.pause(); // ADD THIS
        welcomeAudio.currentTime = 0; // ADD THIS (rewind to start)
        localStorage.setItem('mapWelcomeSeen', 'true');
    }

    closeWelcomeBtn.addEventListener('click', closeWelcome);
    gotItBtn.addEventListener('click', closeWelcome);

    // Suggestion Box Functionality (rest of your existing code continues...)
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
        // ... existing form submission code ...
    });

    // Get DOM elements
    const sidePanel = document.getElementById('side-panel');
    const panelContent = document.getElementById('panel-content');
    const closePanelBtn = document.getElementById('close-panel');
    const mapContainer = document.getElementById('map');
    const mapVideoContainer = document.querySelector('.map-video-container');
    const mapVideo = document.getElementById('map-video');

    // Close panel and return to original view
    function closePanel() {
        sidePanel.classList.remove('active');
        mapContainer.style.marginRight = '0';
        mapVideoContainer.style.display = 'none';
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

    // Audio control event listeners
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

    muteBtn.addEventListener('click', () => {
        audioPlayer.muted = !audioPlayer.muted;
        muteBtn.innerHTML = audioPlayer.muted ?
            '<i class="volume-icon">🔇</i>' :
            '<i class="volume-icon">🔊</i>';
    });

    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', () => {
        playBtn.classList.remove('playing');
        playBtn.innerHTML = '<i class="play-icon">▶</i>';
        progressBar.style.setProperty('--progress', '0%');
        timeDisplay.textContent = '0:00';
    });

    // Map load handler
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

            // Set initial filters
            map.setFilter('locations', ['has', 'Topic']);
            map.setFilter('location-labels', ['has', 'Topic']);

            // Click handler for locations
            function offsetCoordinate(coords, distanceMeters, bearingDegrees) {
                const earthRadius = 6378137; // Earth's radius in meters
                const lat = coords[1];
                const lng = coords[0];
                const bearing = bearingDegrees * (Math.PI / 180); // Convert to radians

                // Calculate new longitude (east/west offset)
                const newLng = lng + (distanceMeters / earthRadius) * Math.cos(bearing) / Math.cos(lat * (Math.PI / 180));

                // Calculate new latitude (north/south offset)
                const newLat = lat + (distanceMeters / earthRadius) * Math.sin(bearing);

                return [newLng, newLat];
            }

            map.on('click', 'locations', (e) => {
                const props = e.features[0].properties;
                const originalCoords = e.features[0].geometry.coordinates.slice();

                // Calculate new coordinates (50m east of original point)
                const offsetMeters = 50; // Adjust this value as needed
                const offsetCoords = offsetCoordinate(originalCoords, offsetMeters, 90); // 90° = east

                // Move map and open panel
                mapContainer.style.marginRight = '400px';
                map.flyTo({
                    center: offsetCoords, // Use offset coordinates instead
                    zoom: 17,
                    speed: 1.2,
                    curve: 1,
                    essential: true
                });

                // Store both original and offset views
                currentFeatureView = {
                    originalCenter: originalCoords,
                    offsetCenter: offsetCoords,
                    zoom: 16
                };

                updateSidePanel(e.features[0]);
            });

            // Return to original view when clicking map background
            map.on('click', (e) => {
                if (!sidePanel.classList.contains('active')) return;
                const features = map.queryRenderedFeatures(e.point, { layers: ['locations'] });
                if (features.length === 0) closePanel();
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

            // Function to handle in-text links between locations
            function setupGeoLinks() {
                document.body.addEventListener('click', function (e) {
                    if (e.target.classList.contains('geo-link')) {
                        e.preventDefault();
                        const targetLocation = e.target.getAttribute('data-feature-id');

                        const features = map.querySourceFeatures('breaking-bad', {
                            filter: ['==', ['get', 'Location'], targetLocation]
                        });

                        if (features.length > 0) {
                            const targetFeature = features[0];
                            map.flyTo({
                                center: targetFeature.geometry.coordinates,
                                zoom: 16,
                                speed: 1.2,
                                essential: true
                            });
                            updateSidePanel(targetFeature);
                        }
                    }
                });
            }

            // Function to update side panel content
            function updateSidePanel(feature) {
                const props = feature.properties;
                const coordinates = feature.geometry.coordinates.slice();
                currentFeatureView = { center: coordinates, zoom: 16 };
                document.getElementById('map').style.marginRight = '400px';

                // Handle video display
                if (props.Video) {
                    const videoUrls = props.Video.split(';').map(url => url.trim());
                    const firstVideoUrl = videoUrls[0];
                    const videoId = getYouTubeId(firstVideoUrl);

                    if (videoId) {
                        mapVideo.innerHTML = `
                            <iframe src="https://www.youtube.com/embed/${videoId}" 
                                    frameborder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen></iframe>
                        `;
                        mapVideoContainer.style.display = 'block';
                    } else {
                        mapVideo.innerHTML = `<p><a href="${firstVideoUrl}" target="_blank">View Video</a></p>`;
                        mapVideoContainer.style.display = 'block';
                    }
                } else {
                    mapVideoContainer.style.display = 'none';
                }

                // Update panel content with text only
                panelContent.innerHTML = `
                <div class="analysis-section">
                    <h4>${props.Location}</h4>
                  <i><p><strong>Moment:</strong> ${props.Moment}</p></i>
                        <p>${props.Analysis}</p>
                    </div>
                `;

                sidePanel.classList.add('active');

                // Handle audio if available
                if (props.Audio) {
                    audioPlayer.src = props.Audio;
                    document.querySelector('.audio-player-container').style.display = 'block';
                    document.querySelector('.audio-player-container h4').textContent = 'Audio Analysis';
                    audioPlayer.addEventListener('loadedmetadata', () => {
                        document.querySelector('.time').textContent = formatTime(audioPlayer.duration);
                    });
                } else {
                    document.querySelector('.audio-player-container').style.display = 'none';
                }
            }

            // Initialize the in-text linking functionality
            setupGeoLinks();

        } catch (error) {
            console.error('Error loading map data:', error);
            alert('Failed to load map data. Please check console for details.');
        }
    });
});