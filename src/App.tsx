import { useState } from 'react'
import { PokemonCard } from './components/Pokemon'
import { Header } from './components/Header'
import { FilterDrawer } from './components/FilterDrawer'

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [nameFilter, setNameFilter] = useState('')
  const [generationFilter, setGenerationFilter] = useState('all')
  const [typeFilter1, setTypeFilter1] = useState('all')
  const [typeFilter2, setTypeFilter2] = useState('all')

  const handleResetFilters = () => {
    setNameFilter('')
    setTypeFilter1('all')
    setTypeFilter2('all')
    setGenerationFilter('all')
  }

  return (
    <>
      <Header onMenuClick={() => setIsDrawerOpen(true)} />
      <FilterDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        nameFilter={nameFilter}
        generationFilter={generationFilter}
        typeFilter1={typeFilter1}
        typeFilter2={typeFilter2}
        onNameFilterChange={setNameFilter}
        onGenerationFilterChange={setGenerationFilter}
        onTypeFilter1Change={setTypeFilter1}
        onTypeFilter2Change={setTypeFilter2}
        onResetFilters={handleResetFilters}
      />
      <PokemonCard
        nameFilter={nameFilter}
        generationFilter={generationFilter}
        typeFilter1={typeFilter1}
        typeFilter2={typeFilter2}
      />
    </>
  )
}

export default App
