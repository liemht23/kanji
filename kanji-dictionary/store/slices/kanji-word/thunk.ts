import { createAsyncThunk } from '@reduxjs/toolkit'
import { getKanji } from '@/app/(pages)/kanji/apis'

export const getKanjiThunk = createAsyncThunk(
  'kanji/getKanji',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await getKanji(id)
      return response
    } catch (error) {
      return rejectWithValue(error)
    }
  }
)