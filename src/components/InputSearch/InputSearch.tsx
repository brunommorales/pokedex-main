import axios from 'axios';
import React, { useContext, ChangeEvent } from 'react';
import { AppContext } from '../../context/AppContext';
import { MagnifyingGlass, X } from '@phosphor-icons/react';

export function InputSearch() {
  const {
    setList,
    inputValue,
    setInputValue,
    setIsLoading,
    setIsSearching,
    limit,
    offset,
  } = useContext(AppContext);

  function findPokemonInput() {
    if (inputValue.length !== 0) {
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${inputValue}`)
        .then((response) => {
          const { name } = response.data;
          setList([
            { name, url: `https://pokeapi.co/api/v2/pokemon/${inputValue}`, value: 0 },
          ]);
          setIsSearching(false);
        })
        .catch(() => {
          alert('Pokemon not found');
        });
    }
  }

  function clearInputValue() {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit${limit}`)
      .then((response) => {
        setTimeout(() => setIsLoading(false), 500);
        setList(response.data.results);
        setInputValue('');
        setIsSearching(true);
      });
  }

  function handleKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      findPokemonInput();
    }
  }

  return (
    <span className="mr-4 flex items-center justify-between">
      <MagnifyingGlass
        size={23}
        onClick={findPokemonInput}
        className="absolute ml-3 cursor-pointer text-red-600"
      />
      <input
        type="text"
        value={inputValue}
        placeholder="Search pokemon"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setInputValue(e.target.value)
        }
        onKeyDown={handleKeyPress}
        className="rounded-xl border-2 bg-red-100 py-3 pl-12 pr-4 text-sm outline-none transition ease-in-out focus:border-red-600 focus:outline-none focus:duration-500 min-[434px]:w-[22rem] sm:text-base"
      />
      <X
        size={18}
        onClick={clearInputValue}
        className="-ml-8 cursor-pointer text-red-600"
      />
    </span>
  );
}
