import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Paper,
    Grid,
    TextField,
    Button,
    Typography,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormHelperText,
    Avatar,
    IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StudentDTO } from '../../types/student.types';
import { studentService } from '../../services/studentService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const StudentForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<StudentDTO>();

    useEffect(() => {
        if (id) {
            fetchStudent();
        }
    }, [id]);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            const student = await studentService.getById(parseInt(id!));
            reset(student);
            setPhotoUrl(student.photoUrl);
        } catch (err) {
            setError('Failed to fetch student details');
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data: StudentDTO) => {
        try {
            setLoading(true);
            if (id) {
                await studentService.update(parseInt(id), data);
            } else {
                await studentService.create(data);
            }
            navigate('/students');
        } catch (err) {
            setError('Failed to save student');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && id) {
            try {
                const response = await studentService.uploadPhoto(parseInt(id), file);
                setPhotoUrl(response.photoUrl);
            } catch (err) {
                setError('Failed to upload photo');
            }
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {id ? 'Edit Student' : 'Add New Student'}
                </Typography>

                {error && <ErrorAlert message={error} sx={{ mb: 2 }} />}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        {id && (
                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Box sx={{ position: 'relative' }}>
                                    <Avatar
                                        src={photoUrl || undefined}
                                        sx={{ width: 100, height: 100 }}
                                    />
                                    <IconButton
                                        color="primary"
                                        aria-label="upload picture"
                                        component="label"
                                        sx={{
                                            position: 'absolute',
                                            bottom: -10,
                                            right: -10,
                                            backgroundColor: 'background.paper'
                                        }}
                                    >
                                        <input
                                            hidden
                                            accept="image/*"
                                            type="file"
                                            onChange={handlePhotoUpload}
                                        />
                                        <PhotoCamera />
                                    </IconButton>
                                </Box>
                            </Grid>
                        )}

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{ required: 'First name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="First Name"
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{ required: 'Last name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Last Name"
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="email"
                                control={control}
                                rules={{
                                    required: 'Email is required',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'Invalid email address'
                                    }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Email"
                                        error={!!errors.email}
                                        helperText={errors.email?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="studentId"
                                control={control}
                                rules={{ required: 'Student ID is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Student ID"
                                        error={!!errors.studentId}
                                        helperText={errors.studentId?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="dateOfBirth"
                                control={control}
                                rules={{ required: 'Date of birth is required' }}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Date of Birth"
                                        value={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!errors.dateOfBirth}
                                                helperText={errors.dateOfBirth?.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="gender"
                                control={control}
                                rules={{ required: 'Gender is required' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.gender}>
                                        <InputLabel>Gender</InputLabel>
                                        <Select {...field} label="Gender">
                                            <MenuItem value="MALE">Male</MenuItem>
                                            <MenuItem value="FEMALE">Female</MenuItem>
                                        </Select>
                                        {errors.gender && (
                                            <FormHelperText>{errors.gender.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="address"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Address"
                                        multiline
                                        rows={3}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/students')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default StudentForm;
