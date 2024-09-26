import { configureStore } from '@reduxjs/toolkit'
import user from './slices/user'

export const store = configureStore({
  reducer: {
    user
  },
  middleware : (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch