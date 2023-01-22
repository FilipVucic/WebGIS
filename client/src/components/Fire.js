import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";
import FireObject from "./FireObject";
import L from "leaflet";

function Fire({ count, handler }) {
    const onEachFire = (feature, layer) => {
        const properties = [];
        properties.push(
            "Fire area: " + feature.properties.area_ha,
            "Start Date: " + feature.properties.initialdate,
            "End Date: " + feature.properties.finaldate,
            "Location: " + feature.properties.place_name,
            "Providence: " + feature.properties.providence,
            "Number of bolts: " + feature.properties.bolt.length
        );
        layer.on("mouseover", function () {
            layer.bindPopup(properties.join("<br>")).openPopup();
        });
        layer.on("click", function () {
            setCurrentFireId(feature.id);
            handler();
        });
    };

    const OnlyFires = () => <GeoJSON onEachFeature={onEachFire} data={data} style={{color:"#c00"}} />;
    const FiresWithFireObjects = () => (
        <div>
            <FireObject
                fireId={currentFireId}
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
                objectName="powerLines"
                style={{ dashArray: "5,10", color: "#777" }}
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
    const DynamicComp =
        currentFireId !== undefined ? FiresWithFireObjects : OnlyFires;

    useEffect(() => {
        const getData = async () => {
            const response = await axios.get(
                "http://localhost:3000/api/fire?from=2022-08-06&to=2022-11-13"
            );
            setData(response.data);
        };
        getData();
    }, []);

    if (data) {
        console.log(currentFireId);

        return <DynamicComp />;
    } else {
        return null;
    }
}

export default Fire;
