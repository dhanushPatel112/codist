import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
    fetchUserList,
    userList,
    sortAndFetchUserList,
    searchAndFetchUserList,
    pageAndFetchUserList,
    deleteUserAndFetchUserList
} from './userSlice';
import { DataGrid } from '@mui/x-data-grid';
import { Alert, AlertColor, Snackbar, Stack, alpha, styled } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import DeleteButton from '../../component/DeleteButton';
import AddEditForm from '../../component/AddEditForm';
import { AxiosError } from 'axios';

// Styles Search component from mui
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto'
    }
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch'
        }
    }
}));

const UserList = () => {
    const dispatch = useAppDispatch();

    const { page, limit, data, totalCount } = useAppSelector(userList);

    // To fetch initially
    useEffect(() => {
        dispatch(fetchUserList({ search: '', page: 0, limit: 10, sortBy: 'name', sortOrder: 'asc' }));
    }, [dispatch]);

    // For toast message
    const [open, setOpen] = useState(false);
    const [{ message, severity }, setToast] = useState<{ message: string; severity: AlertColor }>({ message: '', severity: 'success' });
    const handleClick = () => {
        setOpen(true);
    };
    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    // Define the columns
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        { field: 'mobile', headerName: 'Mobile Number', flex: 1 },
        {
            field: 'actions',
            headerName: 'Actions',
            sortable: false,
            renderCell: (params: { row: { _id: string } }) => (
                <>
                    {/* Update user model */}
                    <AddEditForm key={params.row._id + 'edit'} id={params.row._id} handleToastClick={handleClick} setToast={setToast} />
                    {/* Delete popup */}
                    <DeleteButton
                        onDelete={async (id) => {
                            try {
                                await dispatch(deleteUserAndFetchUserList({ id }));
                                setToast({ message: 'Deleted Successfully', severity: 'success' });
                                handleClick();
                            } catch (error) {
                                if (error instanceof AxiosError) {
                                    setToast({ message: error.response?.data?.message, severity: 'error' });
                                    handleClick();
                                } else {
                                    setToast({ message: 'Something Went Wrong', severity: 'error' });
                                    handleClick();
                                }
                            }
                        }}
                        params={params}
                        key={params.row._id + 'delete'}
                    />
                </>
            )
        }
    ];

    return (
        <>
            {/* Toast */}
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleToastClose}>
                    <Alert onClose={handleToastClose} severity={severity} sx={{ width: '100%' }}>
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
            <div className="sm:m-2 md:m-20 lg:m-32" style={{ height: 400 }}>
                <div className="flex justify-between mx-7">
                    {/* Search box */}
                    <Search>
                        <SearchIconWrapper>
                            <SearchIcon />
                        </SearchIconWrapper>
                        <StyledInputBase
                            onChange={(e) => {
                                dispatch(searchAndFetchUserList(e.target.value));
                            }}
                            placeholder="Search…"
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </Search>
                    {/* Add user Model */}
                    <AddEditForm key={'add'} id="add" handleToastClick={handleClick} setToast={setToast} />
                </div>
                <DataGrid
                    rows={data as any}
                    columns={columns}
                    getRowId={(row) => row._id}
                    rowCount={totalCount}
                    pagination
                    paginationMode="server"
                    pageSizeOptions={[5, 10, 20, 100]}
                    paginationModel={{ page, pageSize: limit }}
                    onPaginationModelChange={(params) => {
                        dispatch(pageAndFetchUserList({ limit: params.pageSize, page: params.page }));
                    }}
                    sortingMode="server"
                    onSortModelChange={(params) => {
                        dispatch(sortAndFetchUserList({ sortBy: params[0]?.field, sortOrder: params[0]?.sort ?? 'asc' }));
                    }}
                    disableColumnMenu
                    rowSelection={false}
                />
            </div>
        </>
    );
};

export default UserList;
