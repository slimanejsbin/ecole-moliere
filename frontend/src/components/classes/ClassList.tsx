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
    Group as StudentsIcon,
    Book as SubjectsIcon
} from '@mui/icons-material';
import { classService } from '../../services/classService';
import { Class } from '../../types/class.types';
import { usePermissions } from '../../hooks/usePermissions';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const ClassList: React.FC = () => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);

    const navigate = useNavigate();
    const { hasPermission } = usePermissions();

    const fetchClasses = async () => {
        try {
            setLoading(true);
            const response = await classService.getAll(page, rowsPerPage);
            setClasses(response.content);
            setTotalElements(response.totalElements);
        } catch (err) {
            setError('Failed to fetch classes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, [page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (classItem: Class) => {
        navigate(`/classes/edit/${classItem.id}`);
    };

    const handleDelete = (classItem: Class) => {
        setSelectedClass(classItem);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedClass) return;
        try {
            await classService.delete(selectedClass.id);
            fetchClasses();
            setDeleteDialogOpen(false);
        } catch (err) {
            setError('Failed to delete class');
        }
    };

    const handleExport = async () => {
        try {
            const blob = await classService.exportToExcel();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'classes.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to export classes');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Class Management
                </Typography>
                <Box>
                    {hasPermission('CLASS_CREATE') && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/classes/new')}
                            sx={{ mr: 2 }}
                        >
                            Add Class
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
                placeholder="Search classes..."
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
                            <TableCell>Name</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Section</TableCell>
                            <TableCell>Academic Year</TableCell>
                            <TableCell>Students</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {classes.map((classItem) => (
                            <TableRow key={classItem.id}>
                                <TableCell>{classItem.name}</TableCell>
                                <TableCell>{classItem.grade}</TableCell>
                                <TableCell>{classItem.section}</TableCell>
                                <TableCell>{classItem.academicYear}</TableCell>
                                <TableCell>{classItem.students}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={classItem.isActive ? 'Active' : 'Inactive'}
                                        color={classItem.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="View Students">
                                            <IconButton
                                                onClick={() => navigate(`/classes/${classItem.id}/students`)}
                                                size="small"
                                            >
                                                <StudentsIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Manage Subjects">
                                            <IconButton
                                                onClick={() => navigate(`/classes/${classItem.id}/subjects`)}
                                                size="small"
                                            >
                                                <SubjectsIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {hasPermission('CLASS_UPDATE') && (
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    onClick={() => handleEdit(classItem)}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {hasPermission('CLASS_DELETE') && (
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    onClick={() => handleDelete(classItem)}
                                                    size="small"
                                                    color="error"
                                                >
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Stack>
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
                title="Delete Class"
                content={`Are you sure you want to delete ${selectedClass?.name}?`}
            />
        </Box>
    );
};

export default ClassList;
