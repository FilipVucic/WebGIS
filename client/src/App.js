import React, {useState} from "react";
import "./App.css";
import { MapContainer, TileLayer } from "react-leaflet";
import Fire from "./components/Fire";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function App() {

	const [startDate, setStartDate] = useState(new Date());
	return (
			<MapContainer center={[44.5, 16]} zoom={7} scrollWheelZoom={true}>
			
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
				<Fire/>
			</MapContainer>
		
	);
}

export default App;
