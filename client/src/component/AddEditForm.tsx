import React, { useCallback } from 'react';
import { IconButton, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, AlertColor } from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAppDispatch } from '../app/hooks';
import { addUserAndFetchUserList, editUserAndFetchUserList } from '../features/user/userSlice';
import { AxiosError } from 'axios';

/**
 *
 * @param id id of record to update
 * @param handleToastClick function to open the toast
 * @param setToast function to make message
 *
 * This component is a pop up model to add or update the user record
 */
const AddEditForm = ({
    id = 'add',
    handleToastClick,
    setToast
}: {
    id: string;
    handleToastClick: () => void;
    setToast: React.Dispatch<
        React.SetStateAction<{
            message: string;
            severity: AlertColor;
        }>
    >;
}) => {
    const [open, setOpen] = React.useState(false);

    const validationSchema = yup.object({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email format').required('Email is required'),
        mobile: yup.string().required('Mobile is required'),
        password: yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
                'Password must contain at least one lowercase letter, one uppercase letter, and one special character'
            ),
        oldPassword: yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
                'Password must contain at least one lowercase letter, one uppercase letter, and one special character'
            ),
        newPassword: yup
            .string()
            .min(8, 'Password must be at least 8 characters')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/,
                'Password must contain at least one lowercase letter, one uppercase letter, and one special character'
            )
    });

    const dispatch = useAppDispatch();

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            mobile: '',
            password: '',
            oldPassword: '',
            newPassword: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const { name, email, mobile, password, oldPassword, newPassword } = values;
                if (id === 'add') {
                    await dispatch(addUserAndFetchUserList({ user: { name, email, mobile, password } }));
                    formik.resetForm();
                    setToast({ message: 'Added Successfully', severity: 'success' });
                } else {
                    const response: any = await dispatch(
                        editUserAndFetchUserList({
                            user: {
                                name,
                                email,
                                mobile,
                                oldPassword: oldPassword === '' ? undefined : oldPassword,
                                newPassword: newPassword === '' ? undefined : newPassword,
                                id
                            }
                        })
                    );
                    console.log({ response });
                    // This will catch the bad request error
                    if (response?.message) {
                        setToast({ message: response.message, severity: 'error' });
                    } else {
                        setToast({ message: 'Updated Successfully', severity: 'success' });
                        handleClose();
                        formik.resetForm();
                    }
                }
                handleToastClick();
            } catch (error) {
                if (error instanceof AxiosError) {
                    setToast({ message: error.response?.data?.message[0], severity: 'error' });
                } else {
                    setToast({ message: 'Something Went Wrong', severity: 'error' });
                }
                handleToastClick();
            }
        }
    });

    // Will fetch user detail we need to update
    const fetchDetail = useCallback(async () => {
        if (id !== 'add') {
            const user = await (
                await fetch(`http://localhost:3000/user/${id}`, {
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            ).json();

            formik.setFieldValue('email', user.email);
            formik.setFieldValue('name', user.name);
            formik.setFieldValue('mobile', user.mobile);
            formik.setFieldValue('password', '');
            formik.setFieldValue('newPassword', '');
            formik.setFieldValue('oldPassword', '');
        }
    }, [formik, id]);

    // Model state and handlers
    const handleOpen = () => {
        setOpen(true);
        fetchDetail();
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {/* Main Button  */}
            <IconButton onClick={handleOpen} color="primary" aria-label="Edit">
                {id === 'add' ? (
                    <>
                        <AddIcon />
                        <div className="text-sm">Add user</div>
                    </>
                ) : (
                    <EditIcon />
                )}
            </IconButton>

            {/* Dialog box */}
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{id === 'add' ? 'Add User' : 'Edit User'}</DialogTitle>
                <DialogContent>
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            variant="outlined"
                            margin="normal"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            variant="outlined"
                            margin="normal"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            fullWidth
                            id="mobile"
                            name="mobile"
                            label="Mobile"
                            variant="outlined"
                            margin="normal"
                            value={formik.values.mobile}
                            onChange={formik.handleChange}
                            error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                            helperText={formik.touched.mobile && formik.errors.mobile}
                        />
                        {/* Will show password if add */}
                        {/* And new password & old password if edit mode */}
                        {id === 'add' ? (
                            <TextField
                                fullWidth
                                type="password"
                                id="password"
                                name="password"
                                label="Password"
                                variant="outlined"
                                margin="normal"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                        ) : (
                            <>
                                <TextField
                                    fullWidth
                                    type="password"
                                    id="oldPassword"
                                    name="oldPassword"
                                    label="Old Password"
                                    variant="outlined"
                                    margin="normal"
                                    value={formik.values.oldPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                                    helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                                />
                                <TextField
                                    fullWidth
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    label="New Password"
                                    variant="outlined"
                                    margin="normal"
                                    value={formik.values.newPassword}
                                    onChange={formik.handleChange}
                                    error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                                    helperText={formik.touched.newPassword && formik.errors.newPassword}
                                />
                            </>
                        )}
                        <DialogActions>
                            <Button onClick={handleClose} color="error">
                                Cancel
                            </Button>
                            <Button type="submit" color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AddEditForm;
