import React, { useState, useEffect } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Typography,
    Divider,
    Box,
    CircularProgress
} from '@mui/material';
import {
    PersonAdd as PersonAddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    School as SchoolIcon,
    Class as ClassIcon,
    Book as BookIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { dashboardService } from '../../services/dashboardService';

interface Activity {
    id: number;
    type: string;
    description: string;
    timestamp: string;
    user: string;
}

const getActivityIcon = (type: string) => {
    switch (type) {
        case 'CREATE':
            return <PersonAddIcon />;
        case 'UPDATE':
            return <EditIcon />;
        case 'DELETE':
            return <DeleteIcon />;
        case 'TEACHER':
            return <SchoolIcon />;
        case 'CLASS':
            return <ClassIcon />;
        case 'SUBJECT':
            return <BookIcon />;
        default:
            return <EditIcon />;
    }
};

const getActivityColor = (type: string) => {
    switch (type) {
        case 'CREATE':
            return '#4caf50';
        case 'UPDATE':
            return '#2196f3';
        case 'DELETE':
            return '#f44336';
        case 'TEACHER':
            return '#9c27b0';
        case 'CLASS':
            return '#ff9800';
        case 'SUBJECT':
            return '#795548';
        default:
            return '#757575';
    }
};

const RecentActivities: React.FC = () => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const data = await dashboardService.getRecentActivities();
            setActivities(data);
        } catch (err) {
            setError('Failed to fetch recent activities');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Typography color="error" sx={{ p: 2 }}>
                {error}
            </Typography>
        );
    }

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {activities.map((activity, index) => (
                <React.Fragment key={activity.id}>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar sx={{ bgcolor: getActivityColor(activity.type) }}>
                                {getActivityIcon(activity.type)}
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={activity.description}
                            secondary={
                                <React.Fragment>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {activity.user}
                                    </Typography>
                                    {' — '}
                                    {format(new Date(activity.timestamp), 'PPp')}
                                </React.Fragment>
                            }
                        />
                    </ListItem>
                    {index < activities.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
            ))}
        </List>
    );
};

export default RecentActivities;
