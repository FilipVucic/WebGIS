import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";
import L from "leaflet";

function Bolt({ dateFrom, dateTo }) {
	const [data, setData] = useState();

	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
				"http://localhost:3000/api/fire/bolts?from=" +
					dateFrom.toISOString().split("T")[0] +
					"&to=" +
					dateTo.toISOString().split("T")[0]
			);
			setData(response.data);
		};
		getData();
	}, [dateFrom, dateTo]);

	if (data) {
		return (
			<GeoJSON
				data={data}
				pointToLayer={(geoJsonPoint, latlng) =>
					L.marker(latlng, {
						icon: new L.Icon({
							iconUrl: require("../icons/bolt.png"),
							iconSize: [33,44],
						}),
					})
				}
			/>
		);
	} else {
		return null;
	}
}

export default Bolt;
