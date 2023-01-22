import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";
import FireObject from "./FireObject"
import { map } from "leaflet";

function Fire({count, handler}) {
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
		layer.on("click", function () {
			setCurrentFireId(feature.id);
			handler();
		});

	};

	const OnlyFires = () => (
		<GeoJSON onEachFeature={onEachFire} data={data} />
	);
	const FiresWithFireObjects = () => (
		<div>
					<FireObject fireId={currentFireId} objectName='powerStations' />
					<FireObject fireId={currentFireId} objectName='powerTowers' />
					<FireObject fireId={currentFireId} objectName='powerLines' />
					<GeoJSON onEachFeature={onEachFire} data={data} />;
				</div>
	);
	const [data, setData] = useState();
	const [currentFireId, setCurrentFireId] = useState();
	const DynamicComp = currentFireId !== undefined ? FiresWithFireObjects : OnlyFires;
	
	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
				"http://localhost:3000/api/fire?from=2022-08-06&to=2022-11-13"
			);
			setData(response.data);
		};
		getData();
	}, []);

	if (data) {
		console.log(currentFireId);

		return (<DynamicComp />);
	} else {
		return null;
	}
}

export default Fire;
