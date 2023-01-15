import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";


function App() {
	return (
		<MapContainer center={[44.5, 16]} zoom={7} scrollWheelZoom={true}>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker position={[45.815, 15.9819]}>
				<Popup>Grad Zagreb</Popup>
			</Marker>
		</MapContainer>
	);
}

export default App;
