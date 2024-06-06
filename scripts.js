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
document.addEventListener("DOMContentLoaded", function() {
	const map = L.map('map').setView([1.3733,32.2903], 6); //Default to Uganda.

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
		maxZoom:19,
		attribution: '&copy;OpenStreetMap contributors'
	}).addTo(map);

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(
			position => {
				const userLocation = [position.coords.latitude,position.coords.longitude];
				map.setView(userLocation, 12);
				L.marker(userLocation).addTo(map)
				.bindPopup('You are here!')
				.openPopup();

				fetchWeather(userLocation);
				fetchNearbyPlaces(userLocation);
			},
			() => {
				handletLocationError(true);
			},
		);
	} else {
		handletLocationError(false);
	}

	function handletLocationError(browerHasGeolocation) {
		alert(browerHasGeolocation ? 'Geolocation service failed.':
			'Your browser doesn\'t support geolocation.');
	}

	function fetchNearbyPlaces(location) {
		//Example using Overpass API to fetch nearby amenities
		const query = `
		    [out:json];
		    (
		    node["tourism"="attraction"] (around:5000, ${location[0]}, ${location[1]});
            node["tourism"="hotel"] (around:5000, ${location[0]}, ${location[1]});
		    );
		    out body;
		`;

		const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

		fetch(url).then(response => response.json())
		           .then(data => {
		           	data.elements.forEach(place => {
		           		L.marker([place.lat, place.lon]).addTo(map)
		           		                                .bindPopup(`<strong>${place.tags.name}</strong><br>
		           		                                	${place.tags.tourism}`);
		           	});
		           })
		           .catch(error => console.error('Error fetching nearby places:',error));
	}

	function fetchWeather(location) {
		const corsProxy = 'https://cors-anywhere.herokuapp.com/';
		const metaWeatherUrl = `https://www.metaweather.com/api/location/search/?
		lattlong=${location[0]},${location[1]}`;

		fetch(corsProxy + metaWeatherUrl).then(response => response.json())
		.then(data => {
		   if(data && data.length > 0) {
		      const woeid = data[0].woeid;

		      return fetch(corsProxy + 
		        `https://www.metaweather.com/api/location/${woeid}/`)
		    } else {
		      throw new Error('No weather infomation found for the location.');
		    }
		})
		.then(response => response.json())
		.then(data => {
		 const weatherDiv = document.getElementById('weather');
		 const todayWeather = data.consolidated_weather[0];
		 weatherDiv.innerHTML = 
		     `
		     <h3>Current Weather</h3>
		     <p>Temperature: ${todayWeather.the_temp.toFixed(1)}&degC</p>
		        <p>Weather: ${todayWeather.weather_state_name}</p>
		                                 	`;
		})
		.catch(error => console.error('Error fetching weather data:',error));
	}
});

