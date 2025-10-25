"use client";
import { Suspense } from 'react'
import KanjiCard from './components/KanjiCard'
import Spinner from '@/components/common/Spinner';

const KanjiPage = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <KanjiCard />
    </Suspense>
  )
}

export default KanjiPage
