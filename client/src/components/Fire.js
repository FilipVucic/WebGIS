import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";

function Fire() {
	const [data, setData] = useState();
	const onEachFire = (feature, layer) => {
		const properties = [];
		properties.push(
			"Fire area: " + feature.properties.area_ha,
			"Start Date: " + feature.properties.initialdate,
			"End Date: " + feature.properties.finaldate,
			"Location: " + feature.properties.place_name,
			"Providence: " + feature.properties.providence,
			"Number of bolts: " + feature.properties.bolt.length
		);
		layer.on("mouseover", function () {
			layer.bindPopup(properties.join("<br>")).openPopup();
		});
	};
	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
				"http://localhost:3000/api/fire?from=2022-08-06&to=2022-08-13"
			);
			setData(response.data);
		};
		getData();
	}, []);

	// render react-leaflet GeoJSON when the data is ready
	if (data) {
		return <GeoJSON onEachFeature={onEachFire} data={data} />;
	} else {
		return null;
	}
}

export default Fire;
