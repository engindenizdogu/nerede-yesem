# NeredeYesem?

A single-page web application that displays an interactive map using Leaflet.js, featuring location markers with detailed information.

## Features

- Interactive map with location markers
- Detailed location information in popups (shown on hover, can be pinned by click)
- Responsive design for mobile and desktop
- Navigation menu with Home, FAQ, Blog, and Contact pages
- Contact form for user inquiries
- FAQ section with common questions
- Minimal, modern map style using CartoDB VoyagerLabelsUnder tiles

## Project Structure

```
src/
├── html/           # HTML files and components
│   ├── index.html      # Main page with map
│   ├── faq.html        # FAQ page
│   ├── contact.html    # Contact page
│   └── components/     # Reusable HTML components
│       └── nav.html    # Navigation bar component
├── css/            # CSS files
│   ├── base.css        # Common styles
│   ├── nav.css         # Navigation styles
│   ├── map.css         # Map-specific styles
│   ├── forms.css       # Form styles
│   └── faq.css         # FAQ-specific styles
├── js/             # JavaScript files
│   ├── map.js          # Map initialization and functionality
│   └── components.js   # Loads HTML components (e.g., navigation)
├── assets/         # For images, icons, etc.
│   ├── marker-icon-iyi.svg   # Custom marker icon for "İyi restoran"
│   ├── marker-icon-super.svg # Custom marker icon for "Süper restoran"
│   └── tab-icon.png          # Favicon/logo
└── data/
    └── example.json   # Example location data
```

## Prerequisites

- Python 3.x (for local development server)
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Start a local development server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   ```

3. Open your web browser and navigate to:
   ```
   http://localhost:8000/src/html/index.html
   ```

## Usage

- **Map Navigation**:
  - Drag to pan
  - Scroll to zoom
  - Hover over markers to view location details

- **Location Information**:
  - Name
  - Description
  - Address
  - Phone number
  - Website (if available)
  - Rating and review count

## Development

### Adding New Locations

1. Edit the `data/example.json` file
2. Add new location objects with the following structure:
   ```json
   {
     "name": "Location Name",
     "description": "Location Description",
     "address": "Full Address",
     "phone": "Phone Number",
     "website": "Website URL",
     "rating": 4.5,
     "reviews": 100,
     "lat": 41.123456,
     "lng": 29.123456
   }
   ```

### Customizing Styles

- Edit CSS files in the `src/css/` directory
- Main color scheme is defined in `base.css` using CSS variables
- Component-specific styles are in their respective CSS files

### Map Tiles

- The map uses the [CartoDB VoyagerLabelsUnder](https://leaflet-extras.github.io/leaflet-providers/preview/) tile style for a minimal, modern look.
- You can change the tile style in `src/js/map.js` if you want a different appearance.

### Navigation Component

- The navigation bar is managed as a reusable HTML component (`src/html/components/nav.html`) and loaded dynamically on each page.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Acknowledgments

- [Leaflet.js](https://leafletjs.com/) for the interactive map functionality
- [CartoDB Voyager](https://carto.com/basemaps/) for map tiles
- [OpenStreetMap](https://www.openstreetmap.org/) for map data 
