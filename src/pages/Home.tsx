import { useContext, useEffect } from 'react'

import { AppContext } from '../context/AppContext'

import { useNavigate } from 'react-router-dom'


import { fetchPokemons } from '../api/fetchPokemons'
import { addPokemon } from '../utils/addPokemon'
import { Header } from '../components/Header/Header'
import { InputSearch } from '../components/InputSearch/InputSearch'
import { Loader } from '../components/Loader/Loader'
import { Card } from '../components/Card/Card'

export function Home() {
  const history = useNavigate()

  const {
    list,
    setList,
    pokemonTypeName,
    isLoading,
    setIsLoading,
    limit,
    offset,
  } = useContext(AppContext)

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 500)
      setList(await fetchPokemons(offset, limit))
    })()
  }, [offset])

  return (
    <>
      <Header />
      <div className="mx-auto flex w-[85%] flex-wrap items-center justify-center gap-5 py-10 min-[829px]:justify-between">
        <InputSearch />
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <main className="mx-auto w-[85%]">
          <div className="mb-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {list.map((item, index) => (
              <Card
                typePokemon={pokemonTypeName}
                setRotate={false}
                key={`${item.name}-${index}`}
                name={item.name}
                url={item.url}
                handleClick={() => addPokemon(item.name, item.url, history)}
              />
            ))}
          </div>
        </main>
      )}
    </>
  )
}
