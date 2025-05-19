// Initialize the map centered on Istanbul
const map = L.map('map').setView([41.205, 29.028], 14);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Fetch and load the JSON data
fetch('/data/example.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Loaded data:', data);
        
        data.forEach((location, index) => {
            // Create a marker for each location
            const marker = L.marker([location.lat, location.lng])
                .addTo(map);
            
            // Create popup content
            const popupContent = `
                <strong>${location.name}</strong><br>
                ${location.description}<br>
                <strong>Address:</strong> ${location.address}<br>
                <strong>Phone:</strong> ${location.phone}<br>
                ${location.website ? `<strong>Website:</strong> <a href="${location.website}" target="_blank">${location.website}</a><br>` : ''}
                <strong>Rating:</strong> ${location.rating} (${location.reviews} reviews)
            `;
            
            // Bind popup to marker
            marker.bindPopup(popupContent);
        });

        // Fit the map bounds to show all markers
        const bounds = data.map(location => [location.lat, location.lng]);
        map.fitBounds(bounds);
    })
    .catch(error => {
        console.error('Error loading the JSON data:', error);
        // Display error on the map
        L.popup()
            .setLatLng([41.205, 29.028])
            .setContent('Error loading location data. Check console for details.')
            .openOn(map);
    }); 