import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../../app/store';
import { fetchUserApi, deleteUserApi, addUserApi, editUserApi } from './userAPI';

export interface PaginationState {
    page: number;
    limit: number;
    search: string;
    sortBy: string;
    sortOrder: string;
    data: { [x: string]: string }[];
    totalCount: number;
    status: 'idle' | 'loading' | 'failed';
}

export interface AddUser {
    name: string;
    email: string;
    mobile: string;
    password: string;
}

export interface EditUser {
    id: string;
    name: string;
    email: string;
    mobile: string;
    newPassword: string | undefined;
    oldPassword: string | undefined;
}

const initialState: PaginationState = {
    page: 0,
    limit: 10,
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
    data: [],
    status: 'idle',
    totalCount: 0
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        sortHandler: (state, action: PayloadAction<{ sortBy: string; sortOrder: string }>) => {
            state.sortBy = action.payload.sortBy;
            state.sortOrder = action.payload.sortOrder;
        },
        searchHandler: (state, action: PayloadAction<string>) => {
            state.search = action.payload;
        },
        pageHandler: (state, action: PayloadAction<{ limit: number; page: number }>) => {
            state.limit = action.payload.limit;
            state.page = action.payload.page;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserList.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserList.fulfilled, (state, action) => {
                state.status = 'idle';
                state.data = action.payload.users;
                state.totalCount = action.payload.totalCount;
            })
            .addCase(fetchUserList.rejected, (state) => {
                state.status = 'failed';
            });
    }
});

export const { sortHandler, searchHandler, pageHandler } = userSlice.actions;

export const userList = (state: RootState) => state.user;

// This will update sort in store and will fetch the user list again
export const sortAndFetchUserList =
    (payload: { sortBy: string; sortOrder: string }): AppThunk =>
    (dispatch, getState) => {
        dispatch(sortHandler(payload));
        dispatch(fetchUserList(getState().user));
    };

// This will update search in store and will fetch the user list again
export const searchAndFetchUserList =
    (payload: string): AppThunk =>
    (dispatch, getState) => {
        dispatch(searchHandler(payload));
        dispatch(fetchUserList(getState().user));
    };

// This will update pagination in store and will fetch the user list again
export const pageAndFetchUserList =
    (payload: { limit: number; page: number }): AppThunk =>
    (dispatch, getState) => {
        dispatch(pageHandler(payload));
        dispatch(fetchUserList(getState().user));
    };

// This is use to fetch the user list
export const fetchUserList = createAsyncThunk(
    'user/fetchUserList',
    async ({ limit, page, search, sortBy, sortOrder }: Partial<PaginationState>) => {
        const response = await fetchUserApi({ limit, page, search, sortBy, sortOrder });
        return response;
    }
);

// Delete the user & fetch the user list
export const deleteUserAndFetchUserList =
    (payload: { id: string }): AppThunk =>
    async (dispatch, getState) => {
        const response = await deleteUserApi(payload.id);
        await dispatch(fetchUserList(getState().user));
        return response;
    };

// Add the user and fetch the user list
export const addUserAndFetchUserList =
    (payload: { user: AddUser }): AppThunk =>
    async (dispatch, getState) => {
        const response = await addUserApi(payload.user);
        await dispatch(fetchUserList(getState().user));
        return response;
    };

// Update the user and fetch the user list
export const editUserAndFetchUserList =
    (payload: { user: EditUser }): AppThunk =>
    async (dispatch, getState) => {
        const response = await editUserApi(payload.user);
        await dispatch(fetchUserList(getState().user));
        return response;
    };

export default userSlice.reducer;
