# Interactive Map Application

A single-page web application that displays an interactive map using Leaflet.js, featuring location markers with detailed information.

## Features

- Interactive map with location markers
- Detailed location information in popups
- Responsive design for mobile and desktop
- Navigation menu with Home, FAQ, and Contact pages
- Contact form for user inquiries
- FAQ section with common questions

## Project Structure

```
src/
├── html/           # HTML files
│   ├── index.html  # Main page with map
│   ├── faq.html    # FAQ page
│   └── contact.html# Contact page
├── css/            # CSS files
│   ├── base.css    # Common styles
│   ├── nav.css     # Navigation styles
│   ├── map.css     # Map-specific styles
│   ├── forms.css   # Form styles
│   └── faq.css     # FAQ-specific styles
├── js/             # JavaScript files
│   └── script.js   # Map initialization and functionality
└── assets/         # For images, icons, etc.
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
  - Click markers to view location details

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

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Leaflet.js](https://leafletjs.com/) for the interactive map functionality
- [OpenStreetMap](https://www.openstreetmap.org/) for map tiles 