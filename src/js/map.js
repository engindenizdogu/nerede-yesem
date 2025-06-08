// Initialize the map
var map = L.map('map', {
    center: [39.28, 35.32],
    zoom: 8
});

/** Default map style
 // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 15,
    minZoom: 3,
    attribution: '© OpenStreetMap contributors'
    }).addTo(map);
 *
 * Possible tyle alternatives:
 *  Thunderforest.Neighbourhood
 */

// Tile style: CartoDB.VoyagerLabelsUnder from https://leaflet-extras.github.io/leaflet-providers/preview/
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Create layer groups for different rating ranges
const group1 = L.layerGroup().addTo(map); // 4.0 - 4.5, good rated
const group2 = L.layerGroup().addTo(map); // 4.5 - 5.0, best rated

// Define two default-style icons with different colors
const group1Icon = L.icon({
    iconUrl: 'src/assets/marker-icon-iyi.svg',
    iconSize:     [36, 36],
    iconAnchor:   [18, 36],
    popupAnchor:  [0, -36]
});

const group2Icon = L.icon({
    iconUrl: 'src/assets/marker-icon-super.svg',
    iconSize:     [36, 36],
    iconAnchor:   [18, 36],
    popupAnchor:  [0, -36]
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
            
            // Create marker with appropriate icon based on rating
            const marker = L.marker([location.lat, location.lng], {
                icon: location.rating > 4.5 ? group2Icon : group1Icon
            });

            // Bind popup to marker (show on hover, stay open on click)
            marker.bindPopup(popupContent);

            // Pin on click feature commented out but not deleted for reference
            /* let isPopupPinned = false; */

            // Show popup on hover, stay open on click
            marker.on('mouseover', function (e) {
                    this.openPopup();
            });
            /*
            // Close popup on 'mouseout' if not pinned
            marker.on('mouseout', function (e) { 
                if (!isPopupPinned) {
                    this.closePopup();
                }
            });
            // Pin popup on click
            marker.on('click', function (e) {
                isPopupPinned = true;
                this.openPopup();
            });
            */
            // Unpin popup on map click
            map.on('click', function (e) {
                /* isPopupPinned = false; */
                marker.closePopup();
            });
            
            // Add marker to appropriate layer group
            if (location.rating > 4.5) {
                group2.addLayer(marker);
            } else if (location.rating >= 4.0) {
                group1.addLayer(marker);
            }
        });

        // Add layer control
        const overlayMaps = {
            "İyi restoran 🤤": group1,
            "Süper restoran 🤩": group2
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