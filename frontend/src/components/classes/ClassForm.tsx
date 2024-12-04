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
    Autocomplete,
    FormControlLabel,
    Switch
} from '@mui/material';
import { ClassDTO } from '../../types/class.types';
import { classService } from '../../services/classService';
import { teacherService } from '../../services/teacherService';
import { subjectService } from '../../services/subjectService';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const grades = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
const sections = ['A', 'B', 'C', 'D', 'E'];

const ClassForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [teachers, setTeachers] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);

    const { control, handleSubmit, reset, watch, formState: { errors } } = useForm<ClassDTO>();

    useEffect(() => {
        if (id) {
            fetchClass();
        }
        fetchTeachersAndSubjects();
    }, [id]);

    const fetchClass = async () => {
        try {
            setLoading(true);
            const classData = await classService.getById(parseInt(id!));
            reset(classData);
        } catch (err) {
            setError('Failed to fetch class details');
        } finally {
            setLoading(false);
        }
    };

    const fetchTeachersAndSubjects = async () => {
        try {
            const [teachersResponse, subjectsResponse] = await Promise.all([
                teacherService.getAll(0, 100),
                subjectService.getAll(0, 100)
            ]);
            setTeachers(teachersResponse.content);
            setSubjects(subjectsResponse.content);
        } catch (err) {
            setError('Failed to fetch teachers and subjects');
        }
    };

    const onSubmit = async (data: ClassDTO) => {
        try {
            setLoading(true);
            if (id) {
                await classService.update(parseInt(id), data);
            } else {
                await classService.create(data);
            }
            navigate('/classes');
        } catch (err) {
            setError('Failed to save class');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    {id ? 'Edit Class' : 'Add New Class'}
                </Typography>

                {error && <ErrorAlert message={error} sx={{ mb: 2 }} />}

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="name"
                                control={control}
                                rules={{ required: 'Class name is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Class Name"
                                        error={!!errors.name}
                                        helperText={errors.name?.message}
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
                                name="section"
                                control={control}
                                rules={{ required: 'Section is required' }}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.section}>
                                        <InputLabel>Section</InputLabel>
                                        <Select {...field} label="Section">
                                            {sections.map((section) => (
                                                <MenuItem key={section} value={section}>
                                                    {section}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {errors.section && (
                                            <FormHelperText>{errors.section.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="academicYear"
                                control={control}
                                rules={{ required: 'Academic year is required' }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Academic Year"
                                        error={!!errors.academicYear}
                                        helperText={errors.academicYear?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="capacity"
                                control={control}
                                rules={{ 
                                    required: 'Capacity is required',
                                    min: { value: 1, message: 'Capacity must be at least 1' }
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="number"
                                        label="Capacity"
                                        error={!!errors.capacity}
                                        helperText={errors.capacity?.message}
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
                                        <InputLabel>Class Teacher</InputLabel>
                                        <Select {...field} label="Class Teacher">
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
                                                label="Subjects"
                                                placeholder="Select subjects"
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
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
                                    onClick={() => navigate('/classes')}
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

export default ClassForm;
