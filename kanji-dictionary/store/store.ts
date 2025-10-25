import { configureStore } from '@reduxjs/toolkit'
import kanjiWordReducer from './slices/kanji-word'

const makeStore = () => {
  return configureStore({
    reducer: {
      kanjiWord: kanjiWordReducer,
    },
  })
}

export default makeStore
export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']