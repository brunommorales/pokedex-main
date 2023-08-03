import { NavLink } from 'react-router-dom'
import Pokedex from '../../assets/pokedex.png'


export function Header() {

  return (
    <nav className="min-h-24 sticky top-0 z-10 flex flex-wrap items-center justify-center gap-5 bg-red-600 px-10 py-3 min-[340px]:justify-between">
      <a href="/">
        <img src={Pokedex} className="w-[11rem]"></img>
      </a>
      <NavLink to='/graphics' className='text-white hover:underline'>Página de Gráficos</NavLink>
    </nav>
  )
}
