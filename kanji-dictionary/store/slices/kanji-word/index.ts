import { createSlice } from '@reduxjs/toolkit'
import { getKanjiThunk } from './thunk'
import kanjiInitialState from './initial-state'
import { KanjiData } from '@/types/kanji-word'

export const kanjiSlice = createSlice({
  name: 'kanji',
  initialState: kanjiInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getKanjiThunk.pending, (state) => {
        state.loading = true
      })
      .addCase(getKanjiThunk.fulfilled, (state, action) => {
        state.kanjiWord = action.payload as KanjiData
        state.loading = false
      })
      .addCase(getKanjiThunk.rejected, (state) => {
        state.loading = false
      })
  },
})

export default kanjiSlice.reducer