import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";
import FireObject from "./FireObject"

function Fire() {
	const [data, setData] = useState();
	const [currentPowerId, setCurrentPowerId] = useState()
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
			setCurrentPowerId(feature.id);
			layer.bindPopup(properties.join("<br>")).openPopup();
		});
		layer.on('mouseout', function () {
			setCurrentPowerId();
		});
	};
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
		if (currentPowerId) {
			return (
				<div>
					<FireObject fireId={currentPowerId} objectName='powerStations' />
					<FireObject fireId={currentPowerId} objectName='powerTowers' />
					<FireObject fireId={currentPowerId} objectName='powerLines' />
					<GeoJSON onEachFeature={onEachFire} data={data} />;
				</div>
			)
		} else {
			return <GeoJSON onEachFeature={onEachFire} data={data} />;
		}
		
	} else {
		return null;
	}
}

export default Fire;
