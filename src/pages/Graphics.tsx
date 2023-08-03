import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Chart, registerables } from 'chart.js';
import { Header } from '../components/Header/Header';

Chart.register(...registerables);

interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  abilities: { ability: { name: string } }[];
}

const Graphics = () => {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);

  useEffect(() => {
    fetchAllPokemonsData();
  }, []);

  const fetchAllPokemonsData = async () => {
    try {
      const response = await axios.get(
        'https://pokeapi.co/api/v2/pokemon?limit=1000',
      );
      const pokemonsData = response.data.results;

      const pokemonPromises = pokemonsData.map(async (pokemonInfo: any) => {
        const response = await axios.get(pokemonInfo.url);
        return response.data as Pokemon;
      });

      const pokemons = await Promise.all(pokemonPromises);
      setPokemonData(pokemons);
    } catch (error) {
      console.error('Error fetching Pokémon data:', error);
    }
  };

  const getPokemonDataSummary = (): {
    [key: string]: {
      count: number;
      abilities: number;
      avgWeight: number;
      avgHeight: number;
    };
  } => {
    const summary: {
      [key: string]: {
        count: number;
        abilities: number;
        avgWeight: number;
        avgHeight: number;
      };
    } = {};

    pokemonData.forEach((pokemon) => {
      const { types, abilities, weight, height } = pokemon;
      types.forEach((type) => {
        if (!summary[type]) {
          summary[type] = {
            count: 0,
            abilities: 0,
            avgWeight: 0,
            avgHeight: 0,
          };
        }
        summary[type].count++;
        summary[type].abilities += abilities.length;
        summary[type].avgWeight += weight;
        summary[type].avgHeight += height;
      });
    });

    Object.keys(summary).forEach((type) => {
      summary[type].avgWeight /= summary[type].count;
      summary[type].avgHeight /= summary[type].count;
    });

    return summary;
  };

  useEffect(() => {
    const dataSummary = getPokemonDataSummary();

    if (Object.keys(dataSummary).length === 0) {
      return;
    }

    const chartData = {
      labels: Object.keys(dataSummary),
      datasets: [
        {
          label: 'Quantidade de Pokémon',
          data: Object.keys(dataSummary).map((type) => dataSummary[type].count),
          backgroundColor: 'rgba(75, 192, 192, 1)',
        },
        {
          label: 'Total de Habilidades',
          data: Object.keys(dataSummary).map((type) => dataSummary[type].abilities),
          backgroundColor: 'rgba(54, 162, 235, 1)',
        },
        {
          label: 'Média do Peso',
          data: Object.keys(dataSummary).map((type) => dataSummary[type].avgWeight),
          backgroundColor: 'rgba(255, 206, 86, 1)',
        },
      ],
    };

    const canvas = document.getElementById('pokemon-chart') as HTMLCanvasElement;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: (context) =>
                  context.dataset.label + ': ' + context.formattedValue,
              },
            },
          },
        },
      });
    }
  }, [pokemonData]);

  return (
    <>
    <Header />
      <h1 className="py-3 text-center text-xl font-bold">
        Visualização de gráficos dos Pokémons
      </h1>
      <div className="flex w-full flex-col items-center">
        <div className="mt-8">
          <p>Total de Pokémons: {pokemonData.length}</p>
          <div>
            <h2 className="text-xl font-bold">
              Quantidade de Pokémon, Total de Habilidades, Média do Peso e Média
              da Altura por Tipo:
            </h2>
            <canvas id="pokemon-chart" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Graphics;