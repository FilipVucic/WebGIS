import React from "react";
import { GeoJSON } from "react-leaflet";

function FireObject({ fireId, data, objectName, style, pointToLayer }) {
    if (data) {
        return (
            <GeoJSON data={data} style={style} pointToLayer={pointToLayer} />
        );
    } else {
        return null;
    }
}

export default FireObject;
