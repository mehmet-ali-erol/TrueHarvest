const axios = require('axios');

exports.fetchCities = async (req, res) => {
    try {
        const response = await axios.get('https://parselsorgu.tkgm.gov.tr/app/modules/administrativeQuery/data/ilListe.json');
        const data = response.data;
        const cityList = [];

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

            cityList.push({
                geometry_type: geometryType,
                coordinates: formattedCoordinates,
                property_text: propertyText,
                property_id: propertyId
            });
        }

        res.json({ cities: cityList });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while fetching city data');
    }
};
