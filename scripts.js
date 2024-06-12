  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initButtons();
    initForms();
    initPaymentMethodSelection();
    initMap();
    getWeather();
});

function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    const contentDiv = document.querySelector('.content');

    navItems.forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const target = item.getAttribute('href').substring(1);
            loadContent(contentDiv, target);
        });
    });
}

function loadContent(contentDiv, target) {
    contentDiv.innerHTML = `<h1>${target.charAt(0).toUpperCase() + target.slice(1)} Page</h1><p>Content for ${target} page.</p>`;
}

function initButtons() {
    const buttons = [document.getElementById('historical'), document.getElementById('natural'), document.getElementById('cultural')];
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            window.location.href = `${button.id}.html`;
        });
    });
}

function initForms() {
    const bookingForm = document.getElementById('bookingForm');
    const testimonialForm = document.getElementById('testimonialForm');

    if (bookingForm) {
        bookingForm.addEventListener('submit', handleFormSubmission.bind(null, bookingForm, 'http://localhost:3000/api/bookings'));
    }

    if (testimonialForm) {
        testimonialForm.addEventListener('submit', handleFormSubmission.bind(null, testimonialForm, 'http://localhost:3000/api/testimonials'));
    }
}

async function handleFormSubmission(form, apiUrl, event) {
    event.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(apiUrl, {
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
        console.error(`Error submitting form: ${error}`);
        alert('An error occurred. Please check your internet connection and try again.');
    }
}

function initPaymentMethodSelection() {
    const paymentMethodSelect = document.getElementById('payment-method');
    const detailsMap = {
        'mobile-money': document.getElementById('mobile-money-details'),
        'visa-card': document.getElementById('visa-card-details'),
        'paypal': document.getElementById('paypal-details')
    };
    const mmNumberInput = document.getElementById('mm-number');
    const mmError = document.getElementById('mm-error');
    const bookingForm = document.getElementById('bookingForm');

    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', function() {
            Object.values(detailsMap).forEach(detail => detail.style.display = 'none');
            const selectedDetail = detailsMap[this.value];
            if (selectedDetail) selectedDetail.style.display = 'block';
        });

        if (bookingForm) {
            bookingForm.addEventListener('submit', function(event) {
                if (paymentMethodSelect.value === 'mobile-money') {
                    validateMobileMoney(mmNumberInput, mmError, event);
                }
                mmError.style.display = 'none';
                alert("Booking successful!");
                window.location.href = "index.html";
            });

            paymentMethodSelect.dispatchEvent(new Event('change'));
        }
    }
}

function validateMobileMoney(mmNumberInput, mmError, event) {
    const mmNumber = mmNumberInput.value;
    const operator = document.querySelector('input[name="mm-operator"]:checked').value;

    const airtelRegex = /^(075|070|074)[0-9]{7}$/;
    const mtnRegex = /^(077|078|076)[0-9]{7}$/;

    if ((operator === 'Airtel Money' && !airtelRegex.test(mmNumber)) || (operator === 'MTN Money' && !mtnRegex.test(mmNumber))) {
        mmError.textContent = `Please enter a valid ${operator} number.`;
        mmError.style.display = 'block';
        event.preventDefault();
    }
}

function initMap() {
    const map = L.map('map').setView([1.3733, 32.2903], 7);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([0.3476, 32.5825]).addTo(map)
        .bindPopup('Kampala, Uganda')
        .openPopup();
}

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
