document.addEventListener('DOMContentLoaded', () => {
    const navItems = document.querySelectorAll('.nav-item');
    const contentDiv = document.querySelector('.content');
    const historicalButton = document.getElementById('historical');
    const naturalButton = document.getElementById('natural');
    const culturalButton = document.getElementById('cultural');
    const bookingForm = document.getElementById('bookingForm');
    const testimonialForm = document.getElementById('testimonialForm');
    const paymentMethodSelect = document.getElementById('payment-method');
    const mobileMoneyDetails = document.getElementById('mobile-money-details');
    const visaCardDetails = document.getElementById('visa-card-details');
    const paypalDetails = document.getElementById('paypal-details');
    const mmNumberInput = document.getElementById('mm-number');
    const mmError = document.getElementById('mm-error');
    
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

    [historicalButton, naturalButton, culturalButton].forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `${button.id}.html`;
        });
    });

    if (bookingForm) {
        bookingForm.addEventListener('submit', async(event) => {
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

    // Initialize the map
    const map = L.map('map').setView([1.3733, 32.2903], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([0.3476, 32.5825]).addTo(map)
        .bindPopup('Kampala, Uganda')
        .openPopup();

    async function getWeather() {
        try {
            const response = await fetch('https://www.metaweather.com/api/location/search/?query=kampala');
            const location = await response.json();

            if (location.length > 0) {
                const woeid = location[0].woeid;
                const weatherResponse = await fetch(`https://www.metaweather.com/api/location/${woeid}/`);
                const weatherData = await weatherResponse.json();
                displayWeather(weatherData);
            }
        } catch (error) {
            console.error('Error fetching weather data:', error);
        }
    }

    function displayWeather(data) {
        const weatherInfo = document.getElementById('weather-info');
        const today = data.consolidated_weather[0];
        const weatherHtml = `
            <div class="weather-info">
                <div>Temperature: ${Math.round(today.the_temp)}°C</div>
                <div>Weather: ${today.weather_state_name}</div>
            </div>
            <div class="weather-info">
                <div>Min Temp: ${Math.round(today.min_temp)}°C</div>
                <div>Max Temp: ${Math.round(today.max_temp)}°C</div>
            </div>
        `;
        weatherInfo.innerHTML = weatherHtml;
    }

    getWeather();
});
