import React from "react";
import "./App.css";
import { MapContainer, TileLayer } from "react-leaflet";
import Fire from "./components/Fire";

function App() {
	return (
		<MapContainer center={[44.5, 16]} zoom={7} scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Fire/>
		</MapContainer>
	);
}

export default App;
