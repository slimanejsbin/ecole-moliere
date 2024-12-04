import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material';

interface StudentAttendanceChartProps {
    data: any[];
}

const StudentAttendanceChart: React.FC<StudentAttendanceChartProps> = ({ data }) => {
    const theme = useTheme();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="date"
                    stroke={theme.palette.text.secondary}
                    style={{ fontSize: '0.75rem' }}
                />
                <YAxis
                    stroke={theme.palette.text.secondary}
                    style={{ fontSize: '0.75rem' }}
                />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="present"
                    stroke={theme.palette.primary.main}
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="absent"
                    stroke={theme.palette.error.main}
                />
                <Line
                    type="monotone"
                    dataKey="late"
                    stroke={theme.palette.warning.main}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StudentAttendanceChart;
