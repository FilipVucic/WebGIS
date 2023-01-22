import React, { useState } from "react";
import "./App.css";
import {
    MapContainer,
    ScaleControl,
    TileLayer,
    ZoomControl,
} from "react-leaflet";
import Fire from "./components/Fire";
import Bolt from "./components/Bolt";
import Table from "./components/Table";

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

function App() {
    const [dateFrom, setDateFrom] = useState(new Date("2022-08-06"));
    const [dateTo, setDateTo] = useState(new Date("2022-08-14"));
    const [buttonText, setButtonText] = useState("Table view");
    const handleClick = () => {
        if (buttonText === "Map view") {
            setButtonText("Table view");
        } else {
            setButtonText("Map view");
        }
    };

    return (
        <div>
            <div
                id="portal-root"
                style={{
                    position: buttonText === "Map view" ? "static" : "absolute",
                    zIndex: "2",
                    marginLeft: "1vw",
                }}
            >
                <DatePicker
                    portalId="portal-root"
                    selected={dateFrom}
                    dateFormat="yyyy-MM-dd"
                    onChange={(date) => setDateFrom(date)}
                />
                <DatePicker
                    portalId="portal-root"
                    selected={dateTo}
                    dateFormat="yyyy-MM-dd"
                    onChange={(date) => setDateTo(date)}
                />
                <button onClick={handleClick}>{buttonText}</button>
            </div>

            {buttonText === "Map view" && (
                <Table dateFrom={dateFrom} dateTo={dateTo} />
            )}
            {buttonText === "Table view" && (
                <MapContainer
                    center={[44.5, 16]}
                    zoom={7}
                    zoomControl={false}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ScaleControl position="bottomleft" />
                    <ZoomControl position="bottomleft" />

                    <Fire dateFrom={dateFrom} dateTo={dateTo} />
                    <Bolt dateFrom={dateFrom} dateTo={dateTo} />
                </MapContainer>
            )}
        </div>
    );
}

export default App;
