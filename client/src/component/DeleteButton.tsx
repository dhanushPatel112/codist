import React from 'react'
import { IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'

const DeleteButton = ({ params, onDelete }: { params: { row: { _id: string } }; onDelete: (userId: string) => void }) => {
    const [open, setOpen] = React.useState(false)

    const handleOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
    }

    const handleDelete = () => {
        const userId = params.row._id
        onDelete(userId)
        handleClose()
    }

    return (
        <>
            <IconButton onClick={handleOpen} color="error" aria-label="Delete">
                <DeleteIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Confirmation</DialogTitle>
                <DialogContent>Are you sure you want to delete this item?</DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DeleteButton
