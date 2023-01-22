import React, { useState } from "react";
import "./App.css";
import { MapContainer, ScaleControl, TileLayer } from "react-leaflet";
import Fire from "./components/Fire";
import Bolt from "./components/Bolt";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function App() {
	const [dateFrom, setDateFrom] = useState(new Date("2022-08-06"));
	const [dateTo, setDateTo] = useState(new Date("2022-08-13"));

	return (
		<div>
			<div style={{ position: "absolute", zIndex: "2" }}>
				<DatePicker
					selected={dateFrom}
					onChange={(date) => setDateFrom(date)}
				/>
				<DatePicker selected={dateTo} onChange={(date) => setDateTo(date)} />
			</div>

			<MapContainer center={[44.5, 16]} zoom={7} scrollWheelZoom={true}>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<Fire dateFrom={dateFrom} dateTo={dateTo} />
				<Bolt dateFrom={dateFrom} dateTo={dateTo} />
				<ScaleControl position="topleft" />
			</MapContainer>
		</div>
	);
}

export default App;
