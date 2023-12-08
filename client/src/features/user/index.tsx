import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
    fetchUserList,
    userList,
    sortAndFetchUserList,
    searchAndFetchUserList,
    pageAndFetchUserList,
    deleteUserAndFetchUserList
} from './userSlice'
import { DataGrid } from '@mui/x-data-grid'
import { Alert, AlertColor, Snackbar, Stack } from '@mui/material'
import DeleteButton from '../../component/DeleteButton'
import AddEditForm from '../../component/AddEditForm'
import { AxiosError } from 'axios'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import SearchIcon from '@mui/icons-material/Search'

const UserList = () => {
    const dispatch = useAppDispatch()

    const { page, limit, data, totalCount } = useAppSelector(userList)

    // To fetch initially
    useEffect(() => {
        dispatch(fetchUserList({ search: '', page: 0, limit: 10, sortBy: 'name', sortOrder: 'asc' }))
    }, [dispatch])

    // For toast message
    const [open, setOpen] = useState(false)
    const [{ message, severity }, setToast] = useState<{ message: string; severity: AlertColor }>({ message: '', severity: 'success' })
    const handleClick = () => {
        setOpen(true)
    }
    const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(false)
    }

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
                                await dispatch(deleteUserAndFetchUserList({ id }))
                                setToast({ message: 'Deleted Successfully', severity: 'success' })
                                handleClick()
                            } catch (error) {
                                if (error instanceof AxiosError) {
                                    const message = error.response?.data?.message
                                    if (Array.isArray(message)) setToast({ message: message[0], severity: 'error' })
                                    else setToast({ message: message, severity: 'error' })
                                } else {
                                    setToast({ message: 'Something Went Wrong', severity: 'error' })
                                }
                                handleClick()
                            }
                        }}
                        params={params}
                        key={params.row._id + 'delete'}
                    />
                </>
            )
        }
    ]

    return (
        <>
            {/* Toast */}
            <Stack spacing={2} sx={{ width: '100%' }}>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleToastClose}>
                    <Alert onClose={handleToastClose} severity={severity} sx={{ width: '100%', minWidth: '200px' }}>
                        {message}
                    </Alert>
                </Snackbar>
            </Stack>
            <div className="sm:m-2 md:m-20 lg:m-32" style={{ height: 400 }}>
                <div className="flex justify-between mx-7">
                    {/* Search box */}
                    <div className="m-0 p-0">
                        <IconButton type="submit" aria-label="search">
                            <SearchIcon />
                        </IconButton>
                        <TextField
                            id="search-bar"
                            className="text"
                            onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                dispatch(searchAndFetchUserList(e.target.value))
                            }}
                            label="Search name, email or mobile"
                            variant="standard"
                            placeholder="Search..."
                            size="small"
                        />
                    </div>
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
                        dispatch(pageAndFetchUserList({ limit: params.pageSize, page: params.page }))
                    }}
                    sortingMode="server"
                    onSortModelChange={(params) => {
                        dispatch(sortAndFetchUserList({ sortBy: params[0]?.field, sortOrder: params[0]?.sort ?? 'asc' }))
                    }}
                    disableColumnMenu
                    rowSelection={false}
                />
            </div>
        </>
    )
}

export default UserList
