// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// const data = [
//     { name: 'Jan', uv: 400 },
//     { name: 'Feb', uv: 300 },
//     { name: 'Mar', uv: 200 },
// ];

// function MyChart() {
//     return (
//         <LineChart width={400} height={300} data={data}>
//             <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//         </LineChart>
//     );
// }
// export default MyChart;

// 2nd chart example

// import { Line } from 'react-chartjs-2';
// import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

// // Register the required components
// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

// const data = {
//   labels: ['Jan', 'Feb', 'Mar'],
//   datasets: [
//     {
//       label: 'Dataset',
//       data: [50, 40, 70],
//       borderColor: 'blue',
//     },
//   ],
// };

// export default function MyLineChart() {
//   return <Line data={data} />;
// }


// 3rd chart example

// PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
        {
            label: 'My Dataset',
            data: [300, 50, 100],
            backgroundColor: ['red', 'blue', 'yellow'],
            borderWidth: 1,
        },
    ],
};

const PieChart = () => {
    return (
        <div style={{ width: '300px', height: '300px' }}>
            <Pie data={data} />
        </div>
    );
};

export default PieChart;

