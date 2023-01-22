import React, { useEffect, useState } from "react";

import axios from "axios";
import { GeoJSON } from "react-leaflet";
import L from "leaflet"

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
        return (
            <GeoJSON
                data={data}
                pointToLayer={(geoJsonPoint, latlng) =>
                    L.marker(latlng, {
                        icon: new L.Icon({
                            iconUrl: require("../icons/flash-thunder-icon.png"),
                            iconSize: [10, 22],
                        }),
                    })
                }
            />
        );
    } else {
        return null;
    }
}

export default Bolt;
