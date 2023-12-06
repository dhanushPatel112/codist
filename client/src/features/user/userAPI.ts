import axios from 'axios';
import { AddUser, PaginationState, EditUser } from './userSlice';

export async function fetchUserApi({ limit, page, sortOrder, sortBy, search }: Partial<PaginationState>) {
    const response = await axios.get(`${import.meta.env.VITE_API}/user`, {
        params: {
            limit,
            page,
            sortOrder,
            sortBy,
            search
        }
    });

    return response.data;
}

export async function deleteUserApi(id: string) {
    const response = await axios.delete(`${import.meta.env.VITE_API}/user/${id}`);
    return response.data;
}

export async function addUserApi(data: AddUser): Promise<{ [x: string]: string | number }> {
    const response = await axios.post(`${import.meta.env.VITE_API}/user`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}

export async function editUserApi(data: EditUser): Promise<{ [x: string]: string | number }> {
    const response = await axios.put(`${import.meta.env.VITE_API}/user`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.data;
}
