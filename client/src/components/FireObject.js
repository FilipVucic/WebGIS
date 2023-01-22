import React from "react";
import { GeoJSON } from "react-leaflet";

function FireObject({ fireId, data, objectName, style, pointToLayer }) {
    const onEachFireObject = (feature, layer) => {
        const properties = [];
        for (const f in feature.properties) {
            if (feature.properties[f])
                properties.push(`${f}: ${feature.properties[f]}`);
        }

        layer.on("click", function () {
            layer.bindPopup(properties.join("<br>")).openPopup();
        });
    };

    if (data) {
        return (
            <GeoJSON
                data={data}
                style={style}
                pointToLayer={pointToLayer}
                onEachFeature={onEachFireObject}
            />
        );
    } else {
        return null;
    }
}

export default FireObject;
