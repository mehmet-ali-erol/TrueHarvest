const axios = require('axios');

exports.fetchDistricts = async (req, res) => {
    const { cityId } = req.params;
    const apiUrl = `https://cbsapi.tkgm.gov.tr/megsiswebapi.v3/api/idariYapi/ilceListe/${cityId}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;
        const districtList = [];

        for (const featureData of data.features || []) {
            let geometryType = 'none';
            let formattedCoordinates = [];

            const geometryData = featureData.geometry;
            if (geometryData) {
                geometryType = geometryData.type || 'none';

                const rawCoordinates = geometryData.coordinates[0] || [];
                formattedCoordinates = rawCoordinates.map(coord => ({ latitude: coord[1], longitude: coord[0] }));
            }

            const propertyData = featureData.properties || {};
            const propertyText = propertyData.text;
            const propertyId = propertyData.id;

            districtList.push({
                geometry_type: geometryType,
                coordinates: formattedCoordinates,
                property_text: propertyText,
                property_id: propertyId
            });
        }

        res.json({ districts: districtList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
