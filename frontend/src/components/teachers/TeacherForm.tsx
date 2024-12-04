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
    IconButton,
    Autocomplete,
    FormControlLabel,
    Switch
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TeacherDTO } from '../../types/teacher.types';
import { teacherService } from '../../services/teacherService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const specializations = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'French',
    'History',
    'Geography',
    'Computer Science',
    'Physical Education',
    'Art',
    'Music'
];

const TeacherForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [classes, setClasses] = useState<any[]>([]);

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<TeacherDTO>();
    const isClassTeacher = watch('isClassTeacher');

    useEffect(() => {
        if (id) {
            fetchTeacher();
        }
        fetchSubjectsAndClasses();
    }, [id]);

    const fetchTeacher = async () => {
        try {
            setLoading(true);
            const teacher = await teacherService.getById(parseInt(id!));
            reset(teacher);
            setPhotoUrl(teacher.photoUrl);
        } catch (err) {
            setError('Failed to fetch teacher details');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjectsAndClasses = async () => {
        try {
            // Implement subject and class fetching logic
            // const [subjectsResponse, classesResponse] = await Promise.all([
            //     subjectService.getAll(),
            //     classService.getAll()
            // ]);
            // setSubjects(subjectsResponse.data);
            // setClasses(classesResponse.data);
        } catch (err) {
            setError('Failed to fetch subjects and classes');
        }
    };

    const onSubmit = async (data: TeacherDTO) => {
        try {
            setLoading(true);
            if (id) {
                await teacherService.update(parseInt(id), data);
            } else {
                await teacherService.create(data);
            }
            navigate('/teachers');
        } catch (err) {
            setError('Failed to save teacher');
        } finally {
            setLoading(false);
        }
    };

    const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && id) {
            try {
                const response = await teacherService.uploadPhoto(parseInt(id), file);
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
                    {id ? 'Edit Teacher' : 'Add New Teacher'}
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
                                name="employeeId"
                                control={control}
                                rules={{ required: 'Employee ID is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Employee ID"
                                        error={!!errors.employeeId}
                                        helperText={errors.employeeId?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="specialization"
                                control={control}
                                rules={{ required: 'Specialization is required' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.specialization}>
                                        <InputLabel>Specialization</InputLabel>
                                        <Select {...field} label="Specialization">
                                            {specializations.map((spec) => (
                                                <MenuItem key={spec} value={spec}>
                                                    {spec}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.specialization && (
                                            <FormHelperText>{errors.specialization.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="dateOfJoining"
                                control={control}
                                rules={{ required: 'Date of joining is required' }}
                                render={({ field }) => (
                                    <DatePicker
                                        label="Date of Joining"
                                        value={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                fullWidth
                                                error={!!errors.dateOfJoining}
                                                helperText={errors.dateOfJoining?.message}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="isClassTeacher"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        }
                                        label="Is Class Teacher"
                                    />
                                )}
                            />
                        </Grid>

                        {isClassTeacher && (
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="assignedClassId"
                                    control={control}
                                    rules={{ required: 'Assigned class is required for class teacher' }}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.assignedClassId}>
                                            <InputLabel>Assigned Class</InputLabel>
                                            <Select {...field} label="Assigned Class">
                                                {classes.map((cls) => (
                                                    <MenuItem key={cls.id} value={cls.id}>
                                                        {cls.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            {errors.assignedClassId && (
                                                <FormHelperText>{errors.assignedClassId.message}</FormHelperText>
                                            )}
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Controller
                                name="subjects"
                                control={control}
                                render={({ field }) => (
                                    <Autocomplete
                                        multiple
                                        options={subjects}
                                        getOptionLabel={(option) => option.name}
                                        value={field.value || []}
                                        onChange={(_, newValue) => field.onChange(newValue)}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Assigned Subjects"
                                                placeholder="Select subjects"
                                            />
                                        )}
                                    />
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
                                    onClick={() => navigate('/teachers')}
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

export default TeacherForm;
