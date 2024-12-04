import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Button,
    TextField,
    Tooltip,
    Typography,
    Chip,
    Stack
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    FileDownload as ExportIcon,
    Search as SearchIcon,
    School as SubjectIcon,
    Class as ClassIcon
} from '@mui/icons-material';
import { teacherService } from '../../services/teacherService';
import { Teacher } from '../../types/teacher.types';
import { usePermissions } from '../../hooks/usePermissions';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const TeacherList: React.FC = () => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

    const navigate = useNavigate();
    const { hasPermission } = usePermissions();

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const response = await teacherService.getAll(page, rowsPerPage);
            setTeachers(response.content);
            setTotalElements(response.totalElements);
        } catch (err) {
            setError('Failed to fetch teachers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, [page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (teacher: Teacher) => {
        navigate(`/teachers/edit/${teacher.id}`);
    };

    const handleDelete = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedTeacher) return;
        try {
            await teacherService.delete(selectedTeacher.id);
            fetchTeachers();
            setDeleteDialogOpen(false);
        } catch (err) {
            setError('Failed to delete teacher');
        }
    };

    const handleExport = async () => {
        try {
            const blob = await teacherService.exportToExcel();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'teachers.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to export teachers');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Teacher Management
                </Typography>
                <Box>
                    {hasPermission('TEACHER_CREATE') && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/teachers/new')}
                            sx={{ mr: 2 }}
                        >
                            Add Teacher
                        </Button>
                    )}
                    <Button
                        variant="outlined"
                        startIcon={<ExportIcon />}
                        onClick={handleExport}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                    startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
                sx={{ mb: 3 }}
            />

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Employee ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Specialization</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teachers.map((teacher) => (
                            <TableRow key={teacher.id}>
                                <TableCell>{teacher.employeeId}</TableCell>
                                <TableCell>
                                    {teacher.firstName} {teacher.lastName}
                                </TableCell>
                                <TableCell>{teacher.specialization}</TableCell>
                                <TableCell>{teacher.email}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Chip
                                            label={teacher.isActive ? 'Active' : 'Inactive'}
                                            color={teacher.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                        {teacher.isClassTeacher && (
                                            <Tooltip title="Class Teacher">
                                                <ClassIcon color="primary" fontSize="small" />
                                            </Tooltip>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="View Subjects">
                                        <IconButton
                                            onClick={() => navigate(`/teachers/${teacher.id}/subjects`)}
                                            size="small"
                                        >
                                            <SubjectIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {hasPermission('TEACHER_UPDATE') && (
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => handleEdit(teacher)}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {hasPermission('TEACHER_DELETE') && (
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() => handleDelete(teacher)}
                                                size="small"
                                                color="error"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={totalElements}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <DeleteConfirmationDialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Teacher"
                content={`Are you sure you want to delete ${selectedTeacher?.firstName} ${selectedTeacher?.lastName}?`}
            />
        </Box>
    );
};

export default TeacherList;
