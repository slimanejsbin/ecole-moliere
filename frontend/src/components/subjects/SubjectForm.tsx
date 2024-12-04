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
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    FormControlLabel,
    Switch
} from '@mui/material';
import { SubjectDTO } from '../../types/subject.types';
import { subjectService } from '../../services/subjectService';
import { teacherService } from '../../services/teacherService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const grades = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

const SubjectForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<any[]>([]);

    const { control, handleSubmit, reset, formState: { errors } } = useForm<SubjectDTO>();

    useEffect(() => {
        if (id) {
            fetchSubject();
        }
        fetchTeachers();
    }, [id]);

    const fetchSubject = async () => {
        try {
            setLoading(true);
            const subject = await subjectService.getById(parseInt(id!));
            reset(subject);
        } catch (err) {
            setError('Failed to fetch subject details');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachers = async () => {
        try {
            const response = await teacherService.getAll(0, 100);
            setTeachers(response.content);
        } catch (err) {
            setError('Failed to fetch teachers');
        }
    };

    const onSubmit = async (data: SubjectDTO) => {
        try {
            setLoading(true);
            if (id) {
                await subjectService.update(parseInt(id), data);
            } else {
                await subjectService.create(data);
            }
            navigate('/subjects');
        } catch (err) {
            setError('Failed to save subject');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {id ? 'Edit Subject' : 'Add New Subject'}
                </Typography>

                {error && <ErrorAlert message={error} sx={{ mb: 2 }} />}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Subject name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Subject Name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="code"
                                control={control}
                                rules={{ required: 'Subject code is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Subject Code"
                                        error={!!errors.code}
                                        helperText={errors.code?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="grade"
                                control={control}
                                rules={{ required: 'Grade is required' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.grade}>
                                        <InputLabel>Grade</InputLabel>
                                        <Select {...field} label="Grade">
                                            {grades.map((grade) => (
                                                <MenuItem key={grade} value={grade}>
                                                    {grade}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.grade && (
                                            <FormHelperText>{errors.grade.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="credits"
                                control={control}
                                rules={{ 
                                    required: 'Credits are required',
                                    min: { value: 1, message: 'Credits must be at least 1' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="number"
                                        label="Credits"
                                        error={!!errors.credits}
                                        helperText={errors.credits?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="teacherId"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel>Assigned Teacher</InputLabel>
                                        <Select {...field} label="Assigned Teacher">
                                            <MenuItem value="">None</MenuItem>
                                            {teachers.map((teacher) => (
                                                <MenuItem key={teacher.id} value={teacher.id}>
                                                    {`${teacher.firstName} ${teacher.lastName}`}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={3}
                                        label="Description"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="isCore"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        }
                                        label="Core Subject"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="isActive"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            />
                                        }
                                        label="Active"
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate('/subjects')}
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

export default SubjectForm;
