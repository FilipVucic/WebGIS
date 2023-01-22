import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";

function FireObject({fireId, objectName}) {
	
	const [data, setData] = useState();
	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
				"http://localhost:3000/api/fire/" + fireId + "/details"
			);
			setData(response.data[objectName]);
		};
		getData();
	}, [fireId, objectName]);

	// render react-leaflet GeoJSON when the data is ready
	if (data) {
		console.log("FireObject " + fireId);
		return <GeoJSON data={data} />;
	} else {
		return null;
	}
}

export default FireObject;
