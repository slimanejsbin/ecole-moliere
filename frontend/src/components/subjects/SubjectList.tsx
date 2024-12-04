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
    Person as TeacherIcon,
    Assessment as GradeIcon
} from '@mui/icons-material';
import { subjectService } from '../../services/subjectService';
import { Subject } from '../../types/subject.types';
import { usePermissions } from '../../hooks/usePermissions';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const SubjectList: React.FC = () => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

    const navigate = useNavigate();
    const { hasPermission } = usePermissions();

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const response = await subjectService.getAll(page, rowsPerPage);
            setSubjects(response.content);
            setTotalElements(response.totalElements);
        } catch (err) {
            setError('Failed to fetch subjects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, [page, rowsPerPage]);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEdit = (subject: Subject) => {
        navigate(`/subjects/edit/${subject.id}`);
    };

    const handleDelete = (subject: Subject) => {
        setSelectedSubject(subject);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedSubject) return;
        try {
            await subjectService.delete(selectedSubject.id);
            fetchSubjects();
            setDeleteDialogOpen(false);
        } catch (err) {
            setError('Failed to delete subject');
        }
    };

    const handleExport = async () => {
        try {
            const blob = await subjectService.exportToExcel();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'subjects.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to export subjects');
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorAlert message={error} />;

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" component="h1">
                    Subject Management
                </Typography>
                <Box>
                    {hasPermission('SUBJECT_CREATE') && (
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => navigate('/subjects/new')}
                            sx={{ mr: 2 }}
                        >
                            Add Subject
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
                placeholder="Search subjects..."
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
                            <TableCell>Code</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>Credits</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {subjects.map((subject) => (
                            <TableRow key={subject.id}>
                                <TableCell>{subject.code}</TableCell>
                                <TableCell>{subject.name}</TableCell>
                                <TableCell>{subject.grade}</TableCell>
                                <TableCell>{subject.credits}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={subject.isCore ? 'Core' : 'Elective'}
                                        color={subject.isCore ? 'primary' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={subject.isActive ? 'Active' : 'Inactive'}
                                        color={subject.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Assign Teacher">
                                            <IconButton
                                                onClick={() => navigate(`/subjects/${subject.id}/teacher`)}
                                                size="small"
                                            >
                                                <TeacherIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="View Grades">
                                            <IconButton
                                                onClick={() => navigate(`/subjects/${subject.id}/grades`)}
                                                size="small"
                                            >
                                                <GradeIcon />
                                            </IconButton>
                                        </Tooltip>
                                        {hasPermission('SUBJECT_UPDATE') && (
                                            <Tooltip title="Edit">
                                                <IconButton
                                                    onClick={() => handleEdit(subject)}
                                                    size="small"
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                        {hasPermission('SUBJECT_DELETE') && (
                                            <Tooltip title="Delete">
                                                <IconButton
                                                    onClick={() => handleDelete(subject)}
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
                title="Delete Subject"
                content={`Are you sure you want to delete ${selectedSubject?.name}?`}
            />
        </Box>
    );
};

export default SubjectList;
