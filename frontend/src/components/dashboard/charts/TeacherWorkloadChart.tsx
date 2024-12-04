import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { useTheme } from '@mui/material';

interface TeacherWorkloadChartProps {
    data: any[];
}

const TeacherWorkloadChart: React.FC<TeacherWorkloadChartProps> = ({ data }) => {
    const theme = useTheme();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
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
                    dataKey="name"
                    stroke={theme.palette.text.secondary}
                    style={{ fontSize: '0.75rem' }}
                />
                <YAxis
                    stroke={theme.palette.text.secondary}
                    style={{ fontSize: '0.75rem' }}
                />
                <Tooltip />
                <Legend />
                <Bar
                    dataKey="classes"
                    fill={theme.palette.primary.main}
                    name="Classes"
                />
                <Bar
                    dataKey="students"
                    fill={theme.palette.secondary.main}
                    name="Students"
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default TeacherWorkloadChart;
