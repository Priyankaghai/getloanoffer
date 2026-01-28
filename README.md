# GetLoanOffer

A modern, responsive loan aggregator website built with HTML, CSS, JavaScript, and Python Flask.

## Features

- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Dark theme with purple/magenta gradient accents (inspired by PingPro)
- **EMI Calculator**: Interactive loan EMI calculator with visual chart
- **Lead Generation**: Contact forms that save leads to JSON/CSV
- **Multiple Pages**: Home, About, Services, Contact, Privacy Policy, Terms of Service
- **Smooth Animations**: CSS animations and scroll effects
- **SEO Optimized**: Meta tags and semantic HTML

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Python Flask
- **Charts**: Chart.js
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)

## Project Structure

```
getloanoffer/
├── index.html          # Main landing page
├── about.html          # About us page
├── services.html       # Loan services page
├── contact.html        # Contact and application form
├── privacy.html        # Privacy policy
├── terms.html          # Terms of service
├── thankyou.html       # Thank you page
├── styles.css          # Main stylesheet
├── script.js           # JavaScript functionality
├── app.py              # Flask backend
├── server.py           # Simple HTTP server
├── requirements.txt    # Python dependencies
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## Getting Started

### Option 1: Simple HTTP Server (No Backend)

```bash
# Using Python's built-in server
python server.py

# Or using Python directly
python -m http.server 8000
```

Visit `http://localhost:8000` in your browser.

### Option 2: Flask Backend (With Form Handling)

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the Flask server
python app.py
```

Visit `http://localhost:5000` in your browser.

## Features Breakdown

### Landing Page (index.html)
- Hero section with lead capture form
- Loan types overview
- 4-step process timeline
- Interactive EMI calculator
- Stats counter animation
- Customer testimonials
- Banking partners carousel
- Call-to-action section

### About Page (about.html)
- Company introduction
- Mission & Vision
- Core values
- Why choose us section

### Services Page (services.html)
- Personal Loan
- Home Loan
- Business Loan
- Car Loan
- Education Loan
- Gold Loan
- Fees and charges table

### Contact Page (contact.html)
- Contact information
- Detailed application form
- Documents required
- FAQ section

## Customization

### Colors
Edit the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #8B5CF6;
    --secondary-color: #EC4899;
    --bg-dark: #0F0F1A;
    /* ... more variables */
}
```

### Content
- Update text content in HTML files
- Replace placeholder phone numbers and emails
- Add actual banking partner logos
- Update company information

### Form Handling
The Flask backend saves leads to:
- `leads.json` - JSON format
- `leads.csv` - CSV format

## Deployment

### Static Hosting (Netlify, Vercel, GitHub Pages)
Simply upload the HTML, CSS, and JS files. Forms will redirect to thank you page but won't save data.

### Flask Deployment (Heroku, Railway, Render)

1. Create `Procfile`:
```
web: gunicorn app:app
```

2. Deploy using your preferred platform.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is for personal/commercial use. Feel free to modify and use as needed.

## Contact

For questions or support, contact: info@getloanoffer.com
