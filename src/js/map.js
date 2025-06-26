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
const GOOD_RATING_LIMIT = 4.5;
const SUPER_RATING_LIMIT = 4.8;
const group1 = L.layerGroup(); // iyi restoran (not added to map initially)
const group2 = L.layerGroup().addTo(map); // super restoranlar

// Create layer groups for different primary types
const typeGroups = {
    'Restoran': L.layerGroup(),
    'Çay/Kahve': L.layerGroup(),
    'Tatlı': L.layerGroup(),
    'Fırın': L.layerGroup(),
    'Bar': L.layerGroup(),
    'Türk Mutfağı': L.layerGroup(),
    'Kahvaltı': L.layerGroup(),
    'Pizza': L.layerGroup(),
    'Uzak Doğu Mutfağı': L.layerGroup(),
    'Hamburger': L.layerGroup(),
    'İtalyan Mutfağı': L.layerGroup(),
    'Orta Doğu Mutfağı': L.layerGroup(),
    'Amerikan Mutfağı': L.layerGroup(),
    'Diğer': L.layerGroup()
};

// Store all markers for custom filtering
const allMarkers = [];
const markerData = []; // Store marker data for filtering

// Track active filters
let activeRatingFilters = new Set(['Süper restoran 🤩']);
let activeTypeFilters = new Set(['Restoran']);

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

// Fetch and load the CSV data
fetch('../data/nearby_search_results_26062025_cleaned.csv')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(csvText => {
        // Parse CSV data with proper handling of quoted fields
        const rows = [];
        let currentRow = [];
        let inQuotes = false;
        let currentValue = '';
        
        // Process the CSV text character by character
        for (let i = 0; i < csvText.length; i++) {
            const char = csvText[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                currentRow.push(currentValue.trim());
                currentValue = '';
            } else if (char === '\n' && !inQuotes) {
                currentRow.push(currentValue.trim());
                rows.push(currentRow);
                currentRow = [];
                currentValue = '';
            } else {
                currentValue += char;
            }
        }
        
        // Add the last row if there's any data
        if (currentValue.trim() || currentRow.length > 0) {
            currentRow.push(currentValue.trim());
            rows.push(currentRow);
        }

        // Get headers from first row
        const headers = rows[0];
        
        // Convert rows to objects
        const data = rows.slice(1).map(row => {
            return headers.reduce((obj, header, index) => {
                let value = row[index] || '';
                // Remove quotes if present
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                obj[header.trim()] = value;
                return obj;
            }, {});
        });

        data.forEach((location, index) => {
            // Skip empty rows
            if (!location.name || !location.lat || !location.lon) return;

            // Validate and parse coordinates
            const lat = parseFloat(location.lat);
            const lon = parseFloat(location.lon);

            // Skip if coordinates are invalid
            if (isNaN(lat) || isNaN(lon)) {
                console.warn(`Skipping location "${location.name}" due to invalid coordinates: lat=${location.lat}, lon=${location.lon}`);
                return;
            }

            // Validate coordinate ranges
            if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
                console.warn(`Skipping location "${location.name}" due to coordinates out of range: lat=${lat}, lon=${lon}`);
                return;
            }

            // Create popup content
            /* Eklenebilir, simdilik disarida birakildi
            ${location.website ? `<strong>Website:</strong> <a href="${location.website}" target="_blank">${location.website}</a><br>` : ''}
            <strong>Address:</strong> ${location.address || 'N/A'}<br>
            <strong>Phone:</strong> ${location.national_phone || 'N/A'}<br>
            ${location.price_level ? `<strong>Price Level:</strong> ${'$'.repeat(parseInt(location.price_level))}<br>` : ''}
            */
            const popupContent = `
                <strong>${location.name}</strong><br>
                ${location.primary_type_display || ''}<br>
                <strong>Rating:</strong> ${location.rating || 'N/A'} (${parseInt(location.user_rating_count) || 0} reviews)<br>
                ${location.google_maps_uri ? `<a href="${location.google_maps_uri}" target="_blank">Google Maps'te Aç</a>` : ''}
            `;
            
            // Create marker with appropriate icon based on rating
            const rating = parseFloat(location.rating) || 0;
            const marker = L.marker([lat, lon], {
                icon: rating >= SUPER_RATING_LIMIT ? group2Icon : group1Icon
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
            
            // Store marker and its data for custom filtering
            allMarkers.push(marker);
            markerData.push({
                marker: marker,
                rating: rating,
                primaryType: location.primary_type_display || 'Diğer',
                ratingCategory: rating >= SUPER_RATING_LIMIT ? 'Süper restoran 🤩' : 
                               rating >= GOOD_RATING_LIMIT ? 'İyi restoran 🤤' : null
            });
        });

        // Add layer control
        const ratingOverlays = {
            "İyi restoran 🤤": group1,
            "Süper restoran 🤩": group2
        };

        const typeOverlays = Object.entries(typeGroups).reduce((acc, [type, group]) => {
            acc[type] = group;
            return acc;
        }, {});

        // Create separate layer controls for ratings and types
        const ratingControl = L.control.layers(null, ratingOverlays, {
            collapsed: false,
            position: 'topright'
        }).addTo(map);

        const typeControl = L.control.layers(null, typeOverlays, {
            collapsed: false,
            position: 'topright'
        }).addTo(map);

        // Fit the map bounds to show all markers
        const bounds = data.map(location => [parseFloat(location.lat), parseFloat(location.lon)]);
        map.fitBounds(bounds);
    })
    .catch(error => {
        console.error('Error loading the CSV data:', error);
        // Display error on the map
        L.popup()
            .setLatLng([41.205, 29.028])
            .setContent('Error loading location data. Check console for details.')
            .openOn(map);
    });