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
    Chip
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    FileDownload as ExportIcon,
    Search as SearchIcon
} from '@mui/icons-material';
import { studentService } from '../../services/studentService';
import { Student } from '../../types/student.types';
import { usePermissions } from '../../hooks/usePermissions';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const StudentList: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    const navigate = useNavigate();
    const { hasPermission } = usePermissions();

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentService.getAll(page, rowsPerPage);
            setStudents(response.content);
            setTotalElements(response.totalElements);
        } catch (err) {
            setError('Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (student: Student) => {
        navigate(`/students/edit/${student.id}`);
    };

    const handleDelete = (student: Student) => {
        setSelectedStudent(student);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedStudent) return;
        try {
            await studentService.delete(selectedStudent.id);
            fetchStudents();
            setDeleteDialogOpen(false);
        } catch (err) {
            setError('Failed to delete student');
        }
    };

    const handleExport = async () => {
        try {
            const blob = await studentService.exportToExcel();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'students.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to export students');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Student Management
                </Typography>
                <Box>
                    {hasPermission('STUDENT_CREATE') && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/students/new')}
                            sx={{ mr: 2 }}
                        >
                            Add Student
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
                placeholder="Search students..."
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
                            <TableCell>Student ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Class</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student.id}>
                                <TableCell>{student.studentId}</TableCell>
                                <TableCell>
                                    {student.firstName} {student.lastName}
                                </TableCell>
                                <TableCell>{student.className}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={student.isActive ? 'Active' : 'Inactive'}
                                        color={student.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {hasPermission('STUDENT_UPDATE') && (
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => handleEdit(student)}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    {hasPermission('STUDENT_DELETE') && (
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() => handleDelete(student)}
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
                title="Delete Student"
                content={`Are you sure you want to delete ${selectedStudent?.firstName} ${selectedStudent?.lastName}?`}
            />
        </Box>
    );
};

export default StudentList;
