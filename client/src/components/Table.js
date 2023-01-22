import axios from "axios";
import { useEffect, useState } from "react";
import "../App.css";

function Table({ dateFrom, dateTo }) {
	const [data, setData] = useState([]);

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

	return (
		<div>
			<h3>Number of fires: {data.length}</h3>
			<div className="App">
				<table>
					<thead>
						<tr>
							<th>Start Date</th>
							<th>End Date</th>
							<th>Area (ha)</th>
							<th>Location</th>
							<th>Province</th>
							<th>Number of bolts</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, index) => (
							<tr key={index}>
								<td>{item.properties.initialdate}</td>
								<td>{item.properties.finaldate}</td>
								<td>{item.properties.area_ha}</td>
								<td>{item.properties.place_name}</td>
								<td>{item.properties.providence}</td>
								<td>{item.properties.bolt.length}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Table;
