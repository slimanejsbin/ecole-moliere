import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    return (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: (theme) => theme.shadows[4],
                    transition: 'all 0.3s ease-in-out',
                },
            }}
        >
            <Box
                sx={{
                    position: 'absolute',
                    right: -20,
                    top: -20,
                    opacity: 0.2,
                    transform: 'rotate(30deg)',
                }}
            >
                <Box
                    sx={{
                        fontSize: 100,
                        color: color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {icon}
                </Box>
            </Box>
            <Box>
                <Typography
                    variant="h6"
                    sx={{
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="h4"
                    sx={{
                        color: color,
                        fontWeight: 600,
                        mt: 1,
                    }}
                >
                    {value}
                </Typography>
            </Box>
        </Paper>
    );
};

export default StatCard;
