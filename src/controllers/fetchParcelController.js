const axios = require('axios');

exports.fetchParcel = async (req, res) => {
    const { neighbourhoodId, landId, parcelId } = req.params;
    const apiUrl = `https://cbsapi.tkgm.gov.tr/megsiswebapi.v3/api/parsel/${neighbourhoodId}/${landId}/${parcelId}`;

    try {
        const response = await axios.get(apiUrl);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
