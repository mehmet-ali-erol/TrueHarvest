const axios = require('axios');

exports.fetchLocationByPoint = async (req, res) => {
    const { lat, lng } = req.params;
    const apiUrl = `https://backend-track.tarla.io/v1.1/farms/location/info?lat=${lat}&lng=${lng}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
