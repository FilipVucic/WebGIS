import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";

function Fire() {
	const [data, setData] = useState();
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
		return <GeoJSON data={data} />;
	} else {
		return null;
	}
}

export default Fire;
