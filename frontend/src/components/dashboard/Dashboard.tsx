import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    CircularProgress,
    Card,
    CardContent,
    useTheme
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    School as SchoolIcon,
    Person as PersonIcon,
    Class as ClassIcon,
    Book as BookIcon
} from '@mui/icons-material';
import { dashboardService } from '../../services/dashboardService';
import ErrorAlert from '../common/ErrorAlert';
import StatCard from './StatCard';
import StudentAttendanceChart from './charts/StudentAttendanceChart';
import GradeDistributionChart from './charts/GradeDistributionChart';
import TeacherWorkloadChart from './charts/TeacherWorkloadChart';
import RecentActivities from './RecentActivities';

const Dashboard: React.FC = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [gradeData, setGradeData] = useState<any[]>([]);
    const [attendanceData, setAttendanceData] = useState<any[]>([]);
    const [workloadData, setWorkloadData] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [
                dashboardStats,
                gradeDistribution,
                attendanceStats,
                teacherWorkload
            ] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getGradeDistribution(),
                dashboardService.getAttendanceStats(),
                dashboardService.getTeacherWorkload()
            ]);

            setStats(dashboardStats);
            setGradeData(gradeDistribution);
            setAttendanceData(attendanceStats);
            setWorkloadData(teacherWorkload);
        } catch (err) {
            setError('Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress />
        </Box>
    );

    if (error) return <ErrorAlert message={error} />;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            {/* Key Statistics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Students"
                        value={stats.totalStudents}
                        icon={<PersonIcon />}
                        color="#1976d2"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Teachers"
                        value={stats.totalTeachers}
                        icon={<SchoolIcon />}
                        color="#2e7d32"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Active Classes"
                        value={stats.activeClasses}
                        icon={<ClassIcon />}
                        color="#ed6c02"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total Subjects"
                        value={stats.totalSubjects}
                        icon={<BookIcon />}
                        color="#9c27b0"
                    />
                </Grid>
            </Grid>

            {/* Charts Row 1 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Student Attendance Trends
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <StudentAttendanceChart data={attendanceData} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>
                            Grade Distribution
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <GradeDistributionChart data={gradeData} />
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Charts Row 2 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Teacher Workload
                        </Typography>
                        <Box sx={{ height: 300 }}>
                            <TeacherWorkloadChart data={workloadData} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Recent Activities
                        </Typography>
                        <RecentActivities />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
