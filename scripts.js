//Home page navigation menu
function toggleMenu() {
    const menu = document.getElementById('nav-menu');
    menu.classList.toggle('show');
}


//Smooth scrolling
function scrollToSection(id) {
	const section = document.getElementById(id);
	if (section) {
		section.scrollIntoView({behavior:'smooth'});
	}
}


document.addEventListener('DOMContentLoaded', () => {
	const historicalButton = document.getElementById('historical');
	const naturalButton = document.getElementById('natural');
	const culturalButton = document.getElementById('cultural');

	historicalButton.addEventListener('click',() => {
		window.location.href = 'historical.html';
	});

	naturalButton.addEventListener('click',() => {
		window.location.href = 'natural.html';
	});

	culturalButton.addEventListener('click',() => {
		window.location.href = 'cultural.html'
	});
});

//Booking

//Handling form submission store the booking, and redirect the user
document.addEventListener('DOMContentLoaded',() => {
	const bookingForm = document.getElementById('bookingForm');

	bookingForm.addEventListener('submit', async(event) => {
		event.preventDefault();

		const formData = new formData(bookingForm);
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
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			const result = await response.json();
			if (response.ok) {
				alert(result.message);

				window.location.href = 'index.html';
			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error('Error submitting booking:', error);
			alert('Oops! Please check your internet connection')
		}
	});
});

//Payment methods
document.addEventListener("DOMContentLoaded", function() {
	const paymentMethodSelect = document.getElementById('payment-method');
	const mobileMoneyDetails = document.getElementById('mobile-money-details');
	const visaCardDetails = document.getElementById('visa-card-details');
	const paypalDetails = document.getElementById('paypal-details');
	const airtelRadio = document.getElementById('airtel-money');
	const mtnRadio = document.getElementById('mtn-money');
	const mmNumberInput = document.getElementById('mm-number');
	const mmError = document.getElementById('mm-error');
	const bookingForm = document.getElementById('booking-form');


	paymentMethodSelect.addEventListener('change',function() {
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
		if(paymentMethodSelect.value === 'mobile-money') {
			const mmNumber = mmNumberInput.value;
			const operator = document.querySelector('input[name="mm-operator"]:checked').value;

			if(operator === 'Airtel Money' && !/^(075|070|074)[0-9]{7}$/.test(mmNumber)) {
				mmError.textContent = 
				"Please enter a valid Airtel Money number starting with 075, 070 or 074.";

				mmError.style.display = 'block';
				event.preventDefault();
				return;
			} else if (operator === 'MTN Money' && !/^(077|078|076)[0-9]{7}$/.test(mmNumber)) {
				mmError.textContent = 
				"Please enter a valid MTN Money number starting with 077, 078 or 076.";
				mmError.style.display = 'block';
				event.preventDefault();
				return;
			}
		}

		//Hide error message if validation passes
		mmError.style.display = 'none';

		//Show success message and redirect to home page
		alert("Booking successful!");
		window.location.href = "index.html";
	});
	//Show the correct payment method details based on initial selection

	paymentMethodSelect.dispatchEvent(new Event('change'));
});


//Testimonial-form
//Handle the Form Submission and Redirect with a Success Message
document.addEventListener('DOMContentLoaded', () => {
	const testimonialForm = document.getElementById('testimonialForm');

	testimonialForm.addEventListener('submit', async (event) => {
		event.preventDefault();

		const formData = new formData(testimonialForm);
		const data = {
			name: formData.get('name'),
			photo: formData.get('photo'),
			quote: formData.get('quote')
		};

		try {
			const response = await fetch('http://localhost:3000/api/testimonials', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});

			const result = await response.json();
			if (response.ok) {
				alert(result.message);
				window.location.href = 'index.html';
			} else {
				alert(result.message);
			}
		} catch (error) {
			console.error('Error submitting testimonial:' ,error);

			alert('An error occured while submitting your testimonial.Please try again');
		}
	});
});


//Map and Weather Page
// Initialize the map
const map = L.map('map').setView([1.3733, 32.2903], 7); // Coordinates for Uganda

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Add a marker for a sample tourist attraction
L.marker([0.3476, 32.5825]).addTo(map) // Coordinates for Kampala
    .bindPopup('Kampala, Uganda')
    .openPopup();

// Function to fetch weather data from MetaWeather API
async function getWeather() {
    const response = await fetch('https://www.metaweather.com/api/location/search/?query=kampala');
    const location = await response.json();

    if (location.length > 0) {
        const woeid = location[0].woeid;
        const weatherResponse = await fetch(`https://www.metaweather.com/api/location/${woeid}/`);
        const weatherData = await weatherResponse.json();
        displayWeather(weatherData);
    }
}

// Function to display weather data
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

// Fetch and display weather data
getWeather();

