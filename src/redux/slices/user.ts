import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import firebase from 'firebase/compat/app';
import { ExpenseType, TripType } from '../../types';

interface UsersState {
  user : firebase.User | null;
  userLoading : boolean;
  trips : TripType[];
}

const initialState: UsersState = {
  user : null,
  userLoading : false,
  trips : [],
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser : (state , action: PayloadAction<any>) => {
        state.user = action.payload;
    },
    setUserLoading : (state , action : PayloadAction<boolean>) => {
        state.userLoading = action.payload
    },
    setTrips : (state , action : PayloadAction<TripType[] | TripType>) => {
      if (action.payload instanceof Array) {
        state.trips = action.payload
      } else {
        state.trips.unshift(action.payload);
      }
    },
  },
})

export const {setUser , setUserLoading, setTrips} = userSlice.actions
export default userSlice.reducer