// Initialize the map
var map = L.map('map', {
    center: [39.28, 35.32],
    zoom: 8
});

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15,
    minZoom: 3,
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Create layer groups for different rating ranges
const group1 = L.layerGroup().addTo(map); // 4.0 - 4.5, good rated
const group2 = L.layerGroup().addTo(map); // 4.5 - 5.0, best rated

// Create custom icons for different rating groups
const group1Icon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #0074e1; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

const group2Icon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: #CB2B3E; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white;"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8]
});

// Fetch and load the JSON data
fetch('data/example.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        //console.log('Loaded data:', data);
        data.forEach((location, index) => {
            // Create popup content
            const popupContent = `
                <strong>${location.name}</strong><br>
                ${location.description}<br>
                <strong>Address:</strong> ${location.address}<br>
                <strong>Phone:</strong> ${location.phone}<br>
                ${location.website ? `<strong>Website:</strong> <a href="${location.website}" target="_blank">${location.website}</a><br>` : ''}
                <strong>Rating:</strong> ${location.rating} (${location.reviews} reviews)
            `;
            
            // Create marker with appropriate icon based on rating, use this line if you want to use the default marker icon
            //const marker = L.marker([location.lat, location.lng]);

            // Create marker with appropriate icon based on rating, use this line if you want to use the custom icon
            const marker = L.marker([location.lat, location.lng], {
                icon: location.rating > 4.5 ? group2Icon : group1Icon
            });

            // Bind popup to marker
            marker.bindPopup(popupContent);
            
            // Add marker to appropriate layer group
            if (location.rating > 4.5) {
                group2.addLayer(marker);
            } else if (location.rating >= 4.0) {
                group1.addLayer(marker);
            }
        });

        // Add layer control
        const overlayMaps = {
            "İyi Restoran (4.0-4.5)": group1,
            "Süper Restoran (4.5-5.0)": group2
        };
        
        L.control.layers(null, overlayMaps, {collapsed: false}).addTo(map);

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