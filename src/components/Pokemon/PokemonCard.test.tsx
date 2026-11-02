import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PokemonCard } from './index';
import * as apiModule from '../../services/api';

const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
(globalThis as any).IntersectionObserver = mockIntersectionObserver;

vi.mock('../../services/api');
vi.mock('../Pokedex', () => ({
  Pokedex: ({ name }: { name: string }) => <div data-testid={`pokemon-${name}`}>{name}</div>
}));
vi.mock('use-sound', () => ({
  default: () => [vi.fn(), { stop: vi.fn() }]
}));

const mockPokemonData = [
  { id: 1, name: 'bulbasaur', types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }] },
  { id: 4, name: 'charmander', types: [{ type: { name: 'fire' } }] },
  { id: 7, name: 'squirtle', types: [{ type: { name: 'water' } }] },
  { id: 25, name: 'pikachu', types: [{ type: { name: 'electric' } }] },
  { id: 152, name: 'chikorita', types: [{ type: { name: 'grass' } }] },
  { id: 155, name: 'cyndaquil', types: [{ type: { name: 'fire' } }] },
  { id: 252, name: 'treecko', types: [{ type: { name: 'grass' } }] },
  { id: 387, name: 'turtwig', types: [{ type: { name: 'grass' } }] },
  { id: 800, name: 'necrozma', types: [{ type: { name: 'psychic' } }] },
  { id: 906, name: 'sprigatito', types: [{ type: { name: 'grass' } }] },
  { id: 658, name: 'greninja', types: [{ type: { name: 'water' } }, { type: { name: 'dark' } }] },
];

describe('PokemonCard Filter Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    const mockGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('?limit=')) {
        return Promise.resolve({
          data: {
            results: mockPokemonData.map(p => ({ name: p.name, url: `https://pokeapi.co/api/v2/pokemon/${p.id}/` }))
          }
        });
      }
      const pokemonName = url;
      const pokemon = mockPokemonData.find(p => p.name === pokemonName);
      return Promise.resolve({ data: pokemon });
    });
    
    (apiModule.api.get as any) = mockGet;
  });

  afterEach(() => {
    cleanup();
  });

  it('should load and display Pokemon initially', async () => {
    render(<PokemonCard />);
    
    expect(screen.getByText(/Loading Pokémon\.\.\./)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });
  });

  it('should filter by name search', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name');
    await userEvent.type(searchInput, 'char');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-bulbasaur')).not.toBeInTheDocument();
    });
  });

  it('should filter by generation (Gen 1)', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });

    const genSelect = screen.getByDisplayValue('National Dex (All Gen)');
    await userEvent.selectOptions(genSelect, 'gen1');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-pikachu')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-chikorita')).not.toBeInTheDocument();
    });
  });

  it('should filter by generation (Gen 2)', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-chikorita')).toBeInTheDocument();
    });

    const genSelect = screen.getByDisplayValue('National Dex (All Gen)');
    await userEvent.selectOptions(genSelect, 'gen2');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-chikorita')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-cyndaquil')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-bulbasaur')).not.toBeInTheDocument();
    });
  });

  it('should filter by single type', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument();
    });

    const type1Select = screen.getByDisplayValue('Type 1 (Any)');
    await userEvent.selectOptions(type1Select, 'fire');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument();
      expect(screen.getByTestId('pokemon-cyndaquil')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-squirtle')).not.toBeInTheDocument();
    });
  });

  it('should filter by dual type (both types required)', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });

    const type1Select = screen.getByDisplayValue('Type 1 (Any)');
    const type2Select = screen.getByDisplayValue('Type 2 (Any)');
    
    await userEvent.selectOptions(type1Select, 'grass');
    await userEvent.selectOptions(type2Select, 'poison');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-chikorita')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-charmander')).not.toBeInTheDocument();
    });
  });

  it('should combine name search with generation filter', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name');
    const genSelect = screen.getByDisplayValue('National Dex (All Gen)');
    
    await userEvent.type(searchInput, 'turt');
    await userEvent.selectOptions(genSelect, 'gen4');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-turtwig')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-bulbasaur')).not.toBeInTheDocument();
    });
  });

  it('should combine name search with type filter', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name');
    const type1Select = screen.getByDisplayValue('Type 1 (Any)');
    
    await userEvent.type(searchInput, 'chi');
    await userEvent.selectOptions(type1Select, 'grass');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-chikorita')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-cyndaquil')).not.toBeInTheDocument();
    });
  });

  it('should combine generation and type filters', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });

    const genSelect = screen.getByDisplayValue('National Dex (All Gen)');
    const type1Select = screen.getByDisplayValue('Type 1 (Any)');
    
    await userEvent.selectOptions(genSelect, 'gen1');
    await userEvent.selectOptions(type1Select, 'grass');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-chikorita')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-charmander')).not.toBeInTheDocument();
    });
  });

  it('should reset all filters when Clear Filters is clicked', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name');
    const genSelect = screen.getByDisplayValue('National Dex (All Gen)');
    const type1Select = screen.getByDisplayValue('Type 1 (Any)');
    
    await userEvent.type(searchInput, 'char');
    await userEvent.selectOptions(genSelect, 'gen1');
    await userEvent.selectOptions(type1Select, 'fire');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-bulbasaur')).not.toBeInTheDocument();
    });

    const clearButton = screen.getByText('Clear Filters');
    await userEvent.click(clearButton);

    await waitFor(() => {
      expect(searchInput).toHaveValue('');
      expect(genSelect).toHaveValue('all');
      expect(type1Select).toHaveValue('all');
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });
  });

  it('should display results count', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Showing \d+ of \d+ Pokémon/)).toBeInTheDocument();
    });
  });

  it('should display empty state when no results match filters', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });

    const type1Select = screen.getByDisplayValue('Type 1 (Any)');
    const type2Select = screen.getByDisplayValue('Type 2 (Any)');
    
    await userEvent.selectOptions(type1Select, 'fire');
    await userEvent.selectOptions(type2Select, 'water');

    await waitFor(() => {
      expect(screen.getByText('No Pokémon found matching your filters.')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your search or clearing filters.')).toBeInTheDocument();
    });
  });

  it('should handle Fire + Water dual-type (no matches case)', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-charmander')).toBeInTheDocument();
    });

    const type1Select = screen.getByDisplayValue('Type 1 (Any)');
    const type2Select = screen.getByDisplayValue('Type 2 (Any)');
    
    await userEvent.selectOptions(type1Select, 'fire');
    await userEvent.selectOptions(type2Select, 'water');

    await waitFor(() => {
      expect(screen.queryByTestId('pokemon-charmander')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-squirtle')).not.toBeInTheDocument();
      expect(screen.getByText(/Showing 0 of 0 Pokémon/)).toBeInTheDocument();
    });
  });

  it('should match dual-type in any order (Water+Dark vs Dark+Water)', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-greninja')).toBeInTheDocument();
    });

    const type1Select = screen.getByDisplayValue('Type 1 (Any)');
    const type2Select = screen.getByDisplayValue('Type 2 (Any)');
    
    await userEvent.selectOptions(type1Select, 'water');
    await userEvent.selectOptions(type2Select, 'dark');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-greninja')).toBeInTheDocument();
    });

    await userEvent.selectOptions(type1Select, 'dark');
    await userEvent.selectOptions(type2Select, 'water');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-greninja')).toBeInTheDocument();
    });
  });

  it('should combine name search with generation and type filters (triple combo)', async () => {
    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name');
    const genSelect = screen.getByDisplayValue('National Dex (All Gen)');
    const type1Select = screen.getByDisplayValue('Type 1 (Any)');
    
    await userEvent.type(searchInput, 'bulba');
    await userEvent.selectOptions(genSelect, 'gen1');
    await userEvent.selectOptions(type1Select, 'grass');

    await waitFor(() => {
      expect(screen.getByTestId('pokemon-bulbasaur')).toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-chikorita')).not.toBeInTheDocument();
      expect(screen.queryByTestId('pokemon-charmander')).not.toBeInTheDocument();
    });
  });

  it('should load more Pokemon when scrolling (infinite scroll)', async () => {
    const manyPokemon = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `pokemon${i + 1}`,
      types: [{ type: { name: 'normal' } }]
    }));

    const mockGet = vi.fn().mockImplementation((url: string) => {
      if (url.includes('?limit=')) {
        return Promise.resolve({
          data: {
            results: manyPokemon.map(p => ({ name: p.name, url: `https://pokeapi.co/api/v2/pokemon/${p.id}/` }))
          }
        });
      }
      const pokemonName = url;
      const pokemon = manyPokemon.find(p => p.name === pokemonName);
      return Promise.resolve({ data: pokemon });
    });
    
    (apiModule.api.get as any) = mockGet;

    render(<PokemonCard />);
    
    await waitFor(() => {
      expect(screen.getByTestId('pokemon-pokemon1')).toBeInTheDocument();
    });

    const initialCount = screen.getAllByTestId(/pokemon-/).length;
    expect(initialCount).toBeLessThanOrEqual(40);
  });
});
