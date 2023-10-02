const overpassURL = 'https://overpass-api.de/api/interpreter';

export const fetchWaterData = () => {
    const query = `
    [out:json];
    (
      node["amenity"="drinking_water"](30.0987,-98.0258,30.5169,-97.5684);
      way["amenity"="drinking_water"](30.0987,-98.0258,30.5169,-97.5684);
      relation["amenity"="drinking_water"](30.0987,-98.0258,30.5169,-97.5684);
    );
    out body;
    >;
    out skel qt;
    `;

    fetch(overpassURL, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
};
