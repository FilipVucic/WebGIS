import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";
import FireObject from "./FireObject";
import L from "leaflet";

function Fire({ dateFrom, dateTo }) {
	const onEachFire = (feature, layer) => {
		const properties = [];
		properties.push(
			"Fire area: " + feature.properties.area_ha,
			"Start Time: " + feature.properties.initialdate,
			"End Time: " + feature.properties.finaldate,
			"Location: " + feature.properties.place_name,
			"Providence: " + feature.properties.providence,
			"Biomes before: " +
				JSON.stringify(feature.properties.biome.before, null, 2),
			"Biomes after: " + JSON.stringify(feature.properties.biome.after, null, 2)
		);
		layer.on("mouseover", function () {
			layer.bindPopup(properties.join("<br>")).openPopup();
		});
		layer.on("click", function () {
			setCurrentFireId(feature.id);
		});
	};

	const OnlyFires = () => (
		<GeoJSON onEachFeature={onEachFire} data={data} style={{ color: "#c00" }} />
	);
	const FiresWithFireObjects = () => (
		<div>
			<FireObject
				fireId={currentFireId}
				objectName="powerStations"
				pointToLayer={(geoJsonPoint, latlng) =>
					L.marker(latlng, {
						icon: new L.Icon({
							iconUrl: require("../icons/wind-turbine.png"),
							iconSize: [32, 32],
						}),
					})
				}
			/>
			<FireObject
				fireId={currentFireId}
				objectName="powerTowers"
				pointToLayer={(geoJsonPoint, latlng) =>
					L.marker(latlng, {
						icon: new L.Icon({
							iconUrl: require("../icons/power-pole-icon.png"),
							iconSize: [16, 32],
						}),
					})
				}
			/>
			<FireObject
				fireId={currentFireId}
				objectName="powerLines"
				style={{ dashArray: "5,10", color: "#777" }}
			/>
			<GeoJSON
				onEachFeature={onEachFire}
				data={data}
				style={{ color: "#f00", fillColor: "#DA740F" }}
			/>
			;
		</div>
	);
	const [data, setData] = useState();
	const [currentFireId, setCurrentFireId] = useState();
	const DynamicComp =
		currentFireId !== undefined ? FiresWithFireObjects : OnlyFires;

	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
				"http://localhost:3000/api/fire?from=" +
					dateFrom.toISOString().split("T")[0] +
					"&to=" +
					dateTo.toISOString().split("T")[0]
			);
			setData(response.data);
		};
		getData();
	}, [dateFrom, dateTo]);

	if (data) {
		return <DynamicComp />;
	} else {
		return null;
	}
}

export default Fire;
