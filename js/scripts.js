// Smooth scrolling
function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Booking and Testimonial Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = document.getElementById('bookingForm');
    const testimonialForm = document.getElementById('testimonialForm');
    const paymentMethodSelect = document.getElementById('payment-method');
    const mobileMoneyDetails = document.getElementById('mobile-money-details');
    const visaCardDetails = document.getElementById('visa-card-details');
    const paypalDetails = document.getElementById('paypal-details');
    const mmNumberInput = document.getElementById('mm-number');
    const mmError = document.getElementById('mm-error');

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(bookingForm);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                date: formData.get('date'),
                package: formData.get('package')
            };

            try {
                const response = await fetch('http://localhost:3000/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                alert(result.message);
                if (response.ok) {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Error submitting booking:', error);
                alert('Oops! Please check your internet connection.');
            }
        });
    }

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const formData = new FormData(testimonialForm);
            const data = {
                name: formData.get('name'),
                photo: formData.get('photo'),
                quote: formData.get('quote')
            };

            try {
                const response = await fetch('http://localhost:3000/api/testimonials', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();
                alert(result.message);
                if (response.ok) {
                    window.location.href = 'index.html';
                }
            } catch (error) {
                console.error('Error submitting testimonial:', error);
                alert('An error occurred while submitting your testimonial. Please try again.');
            }
        });
    }

    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', function() {
            mobileMoneyDetails.style.display = 'none';
            visaCardDetails.style.display = 'none';
            paypalDetails.style.display = 'none';

            if (this.value === 'mobile-money') {
                mobileMoneyDetails.style.display = 'block';
            } else if (this.value === 'visa-card') {
                visaCardDetails.style.display = 'block';
            } else if (this.value === 'paypal') {
                paypalDetails.style.display = 'block';
            }
        });

        bookingForm.addEventListener('submit', function(event) {
            if (paymentMethodSelect.value === 'mobile-money') {
                const mmNumber = mmNumberInput.value;
                const operator = document.querySelector('input[name="mm-operator"]:checked').value;

                if (operator === 'Airtel Money' && !/^(075|070|074)[0-9]{7}$/.test(mmNumber)) {
                    mmError.textContent = "Please enter a valid Airtel Money number starting with 075, 070, or 074.";
                    mmError.style.display = 'block';
                    event.preventDefault();
                    return;
                } else if (operator === 'MTN Money' && !/^(077|078|076)[0-9]{7}$/.test(mmNumber)) {
                    mmError.textContent = "Please enter a valid MTN Money number starting with 077, 078, or 076.";
                    mmError.style.display = 'block';
                    event.preventDefault();
                    return;
                }
            }

            mmError.style.display = 'none';
            alert("Booking successful!");
            window.location.href = "index.html";
        });

        paymentMethodSelect.dispatchEvent(new Event('change'));
    }

    // Navigation and Content Loading
    const navItems = document.querySelectorAll('.nav-item');
    const contentDiv = document.querySelector('.content');

    function loadContent(target) {
        contentDiv.innerHTML = `<h1>${target.charAt(0).toUpperCase() + target.slice(1)} Page</h1><p>Content for ${target} page.</p>`;
    }

    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();

            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            const target = item.getAttribute('href').substring(1);
            loadContent(target);
        });
    });

    document.addEventListener('DOMContentLoaded', () => {
    const historicalButton = document.getElementById('historical');
    const naturalButton = document.getElementById('natural');
    const culturalButton = document.getElementById('cultural');

    const buttons = [historicalButton, naturalButton, culturalButton];

    buttons.forEach(button => {
        if (button) {
            button.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default action for links
                window.location.href = `${button.id}.html`;
            });
        } else {
            console.warn('One of the navigation buttons was not found in the DOM.');
        }
    });


    // Map and Weather Integration
    const map = L.map('map').setView([1.3733, 32.2903], 10); // Default to Uganda.

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLocation = [position.coords.latitude, position.coords.longitude];
                map.setView(userLocation, 12);
                L.marker(userLocation).addTo(map)
                    .bindPopup('You are here!')
                    .openPopup();

                fetchWeather(userLocation);
                fetchNearbyPlaces(userLocation);
            },
            () => {
                handleLocationError(true);
            },
        );
    } else {
        handleLocationError(false);
    }

    function handleLocationError(browserHasGeolocation) {
        alert(browserHasGeolocation ? 'Geolocation service failed.' : 'Your browser doesn\'t support geolocation.');
    }

    function fetchNearbyPlaces(location) {
        const query = `
            [out:json];
            (
                node["tourism"="attraction"](around:5000, ${location[0]}, ${location[1]});
                node["tourism"="hotel"](around:5000, ${location[0]}, ${location[1]});
            );
            out body;
        `;

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        fetch(url).then(response => response.json())
            .then(data => {
                data.elements.forEach(place => {
                    L.marker([place.lat, place.lon]).addTo(map)
                        .bindPopup(`<strong>${place.tags.name}</strong><br>${place.tags.tourism}`);
                });
            })
            .catch(error => console.error('Error fetching nearby places:', error));
    }

    function fetchWeather(location) {
                const corsProxy = 'https://cors-anywhere.herokuapp.com/';
                const metaWeatherUrl = `https://www.metaweather.com/api/location/search/?lattlong=${location[0]},${location[1]}`;

                fetch(corsProxy + metaWeatherUrl).then(response => response.json())
                    .then(data => {
                        if (data && data.length > 0) {
                            const woeid = data[0].woeid;
                            return fetch(corsProxy + `https://www.metaweather.com/api/location/${woeid}/`);
                        } else {
                            throw new Error('No weather information found for the location.');
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        const weatherDiv = document.getElementById('weather');
                        const todayWeather = data.consolidated_weather[0];
                        weatherDiv.innerHTML = `
                            <h3>Current Weather</h3>
                            <p>Temperature: ${todayWeather.the_temp.toFixed(1)}&deg;C</p>
                            <p>Weather: ${todayWeather.weather_state_name}</p>
                        `;
                    })
                    .catch(error => console.error('Error fetching weather data:', error));
            }
    });
});