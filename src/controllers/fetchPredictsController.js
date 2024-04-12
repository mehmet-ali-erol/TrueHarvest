const axios = require('axios');

// Function to call the Django backend and fetch predictions
async function callDjangoBackend(params) {
    console.log('Sending request to Django with parameters:', params); // Log the parameters being sent
    try {
        const response = await axios.get('http://127.0.0.1:8000/export-and-predict/', { params });
        console.log('Received response from Django:', response.data); // Log successful response data
        return response.data;
    } catch (error) {
        console.error('Error calling Django backend:', error.response ? error.response.data : error.message); // Log detailed error response
        throw new Error('Failed to fetch predictions from Django backend.');
    }
}

// Controller function for handling the fetch predictions route
exports.fetchPredicts = async (req, res) => {
    console.log('Request params are:', req);
    // Extract parameters from the route path
    const { min_lon, max_lon, min_lat, max_lat, start_date, end_date } = req.params;

    try {
        const djangoParams = {
            min_lon: parseFloat(min_lon),
            max_lon: parseFloat(max_lon),
            min_lat: parseFloat(min_lat),
            max_lat: parseFloat(max_lat),
            start_date: start_date,
            end_date: end_date,
        };

        console.log('Request params:', djangoParams); // Log the parameters before the call
        const predictions = await callDjangoBackend(djangoParams);
        res.json(predictions); // Send the predictions back to the client
    } catch (error) {
        console.error('Failed to process the request:', error); // Log the error at the controller level
        res.status(500).json({ error: error.message });
    }
};
