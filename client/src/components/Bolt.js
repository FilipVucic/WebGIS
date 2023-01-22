import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";

function Bolt() {

	const [data, setData] = useState();
	
	useEffect(() => {
		const getData = async () => {
			const response = await axios.get(
				"http://localhost:3000/api/fire/bolts"
			);
			setData(response.data);
		};
		getData();
	}, []);

	if (data) {
		return <GeoJSON data={data}/>
	} else {
		return null;
	}
}

export default Bolt;
