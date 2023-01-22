import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";
import FireObject from "./FireObject";
import L from "leaflet";

function Fire({ dateFrom, dateTo }) {
    const onEachFire = (feature, layer) => {
        const properties = [];
        properties.push(
            "Fire area: " + feature.properties.area_ha + " ha",
            "Start Time: " + feature.properties.initialdate,
            "End Time: " + feature.properties.finaldate,
            "Location: " + feature.properties.place_name,
            "Providence: " + feature.properties.providence
        );
        let biome = "";
        if (feature.id === currentFireId && fireDetails.biome) {
            let before = "";
            for (const f in fireDetails.biome.before) {
                before += `<li>${f}: ${fireDetails.biome.before[f]}%</li>`;
            }
            if (before)
                biome += `<br>Biome before:<ul style="margin: 0;">${before}</ul>`;

            let after = "";
            for (const f in fireDetails.biome.after) {
                after += `<li>${f}: ${fireDetails.biome.after[f]}%</li>`;
            }
            if (after)
                biome += `Biome after:<ul style="margin: 0;">${after}</ul>`;

            if (biome) properties.push(biome);
        }
        layer.on("mouseover", function () {
            layer.bindPopup(properties.join("<br>")).openPopup();
        });
        layer.on("click", async function () {
            const details = (
                await axios.get(
                    `http://localhost:3000/api/fire/${feature.id}/details`
                )
            ).data;
            setFireDetails(details);
            setCurrentFireId(feature.id);
        });
    };

    const OnlyFires = () => (
        <GeoJSON
            onEachFeature={onEachFire}
            data={data}
            style={{ color: "#c00" }}
        />
    );

    const FiresWithFireObjects = () => (
        <div>
            <FireObject
                fireId={currentFireId}
                data={fireDetails["powerStations"]}
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
                data={fireDetails["powerTowers"]}
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
                data={fireDetails["powerLines"]}
                objectName="powerLines"
                style={{ dashArray: "5,10", color: "#000", weight: "2" }}
            />
            <FireObject
                fireId={currentFireId}
                data={fireDetails["roads"]}
                objectName="roads"
                style={{ color: "#ff0", weight: "5" }}
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
    const [fireDetails, setFireDetails] = useState();
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
