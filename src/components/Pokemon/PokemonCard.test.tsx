import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { PokemonCard } from './index';

vi.mock('../../services/api', () => ({
    api: {
        get: vi.fn(),
    },
}));

vi.mock('../Pokedex/useSound', () => ({
    __esModule: true,
    default: vi.fn(() => ({
        playSound: vi.fn(),
        stopSound: vi.fn(),
    })),
}));


const mockPokemonData = [
    { id: 1, name: 'bulbasaur', types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }] },
    { id: 4, name: 'charmander', types: [{ type: { name: 'fire' } }] },
    { id: 7, name: 'squirtle', types: [{ type: { name: 'water' } }] },
    { id: 25, name: 'pikachu', types: [{ type: { name: 'electric' } }] },
    { id: 152, name: 'chikorita', types: [{ type: { name: 'grass' } }] },
    { id: 155, name: 'cyndaquil', types: [{ type: { name: 'fire' } }] },
    { id: 252, name: 'treecko', types: [{ type: { name: 'grass' } }] },
];

const mockApiGet = vi.mocked(await import('../../services/api')).api.get;

describe('PokemonCard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock implementation for the initial list fetch
        mockApiGet.mockImplementation(async (url: string) => {
            if (url === '?limit=386') {
                return {
                    data: {
                        results: mockPokemonData.map(p => ({ name: p.name, url: `/${p.name}` }))
                    }
                };
            }
            // Mock for individual Pokemon fetches
            const pokemonName = url.substring(url.lastIndexOf('/') + 1);
            const pokemon = mockPokemonData.find(p => p.name === pokemonName);
            if (pokemon) {
                return { data: pokemon };
            }
            return { data: null }; // Should not happen in these tests if data is consistent
        });
    });

    test('displays loading state initially and then renders Pokemon', async () => {
        render(<PokemonCard />);
        expect(screen.getByText('Loading Pokemon...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
        });

        mockPokemonData.forEach(pokemon => {
            expect(screen.getByText(pokemon.name)).toBeInTheDocument();
        });
    });

    test('renders all Pokemon initially when no filters are applied', async () => {
        render(<PokemonCard />);
        await waitFor(() => {
            expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
        });
        mockPokemonData.forEach(pokemon => {
            expect(screen.getByText(pokemon.name)).toBeInTheDocument();
        });
        // Assuming Pokedex component renders something identifiable like a list item or an article
        // For this example, we'll assume each Pokedex item has a role or identifiable text.
        // If Pokedex renders a simple div with name, screen.getByText is enough.
    });

    describe('Name Filter', () => {
        test('filters Pokemon by full name (case-insensitive)', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const nameInput = screen.getByPlaceholderText('Search by name');
            fireEvent.change(nameInput, { target: { value: 'Pikachu' } });

            expect(screen.getByText('pikachu')).toBeInTheDocument();
            expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
            expect(screen.queryByText('charmander')).not.toBeInTheDocument();
        });

        test('filters Pokemon by partial name', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const nameInput = screen.getByPlaceholderText('Search by name');
            fireEvent.change(nameInput, { target: { value: 'char' } });

            expect(screen.getByText('charmander')).toBeInTheDocument();
            expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
        });

        test('shows no Pokemon if name filter matches none', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const nameInput = screen.getByPlaceholderText('Search by name');
            fireEvent.change(nameInput, { target: { value: 'nonexistent' } });

            mockPokemonData.forEach(pokemon => {
                expect(screen.queryByText(pokemon.name)).not.toBeInTheDocument();
            });
        });
    });

    describe('Type Filter', () => {
        test('filters Pokemon by selected type', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const typeSelect = screen.getByRole('combobox', { name: /all types/i }); // More robust selector if label exists or by displayed value
            fireEvent.change(typeSelect, { target: { value: 'fire' } });

            expect(screen.getByText('charmander')).toBeInTheDocument();
            expect(screen.getByText('cyndaquil')).toBeInTheDocument();
            expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
            expect(screen.queryByText('pikachu')).not.toBeInTheDocument();
        });

        test('shows all Pokemon when "All Types" is selected', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const typeSelect = screen.getByRole('combobox', { name: /all types/i });
            fireEvent.change(typeSelect, { target: { value: 'fire' } }); // Filter first
            expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();

            fireEvent.change(typeSelect, { target: { value: 'all' } }); // Then reset
            mockPokemonData.forEach(pokemon => {
                expect(screen.getByText(pokemon.name)).toBeInTheDocument();
            });
        });
    });

    describe('Generation Filter', () => {
        test('filters Pokemon by selected generation (Gen 1)', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const genSelect = screen.getByRole('combobox', { name: /all generations/i });
            fireEvent.change(genSelect, { target: { value: 'gen1' } });

            expect(screen.getByText('bulbasaur')).toBeInTheDocument(); // ID 1
            expect(screen.getByText('charmander')).toBeInTheDocument(); // ID 4
            expect(screen.getByText('squirtle')).toBeInTheDocument(); // ID 7
            expect(screen.getByText('pikachu')).toBeInTheDocument(); // ID 25
            expect(screen.queryByText('chikorita')).not.toBeInTheDocument(); // ID 152 (Gen 2)
            expect(screen.queryByText('treecko')).not.toBeInTheDocument(); // ID 252 (Gen 3)
        });

        test('filters Pokemon by selected generation (Gen 2)', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const genSelect = screen.getByRole('combobox', { name: /all generations/i });
            fireEvent.change(genSelect, { target: { value: 'gen2' } });

            expect(screen.getByText('chikorita')).toBeInTheDocument(); // ID 152
            expect(screen.getByText('cyndaquil')).toBeInTheDocument(); // ID 155
            expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
            expect(screen.queryByText('treecko')).not.toBeInTheDocument();
        });

        test('shows all Pokemon when "All Generations" is selected', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const genSelect = screen.getByRole('combobox', { name: /all generations/i });
            fireEvent.change(genSelect, { target: { value: 'gen1' } }); // Filter first
            expect(screen.queryByText('chikorita')).not.toBeInTheDocument();

            fireEvent.change(genSelect, { target: { value: 'all' } }); // Then reset
            mockPokemonData.forEach(pokemon => {
                expect(screen.getByText(pokemon.name)).toBeInTheDocument();
            });
        });
    });

    describe('Combined Filters', () => {
        test('filters by name and type', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const nameInput = screen.getByPlaceholderText('Search by name');
            fireEvent.change(nameInput, { target: { value: 'saur' } });

            const typeSelect = screen.getByRole('combobox', { name: /all types/i });
            fireEvent.change(typeSelect, { target: { value: 'grass' } });

            expect(screen.getByText('bulbasaur')).toBeInTheDocument();
            expect(screen.queryByText('charmander')).not.toBeInTheDocument();
            expect(screen.queryByText('chikorita')).not.toBeInTheDocument(); // Also grass, but name doesn't match 'saur'
        });

        test('filters by type and generation', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const typeSelect = screen.getByRole('combobox', { name: /all types/i });
            fireEvent.change(typeSelect, { target: { value: 'grass' } });

            const genSelect = screen.getByRole('combobox', { name: /all generations/i });
            fireEvent.change(genSelect, { target: { value: 'gen2' } });

            expect(screen.getByText('chikorita')).toBeInTheDocument();
            expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument(); // Grass, but Gen 1
            expect(screen.queryByText('treecko')).not.toBeInTheDocument(); // Grass, but Gen 3
            expect(screen.queryByText('cyndaquil')).not.toBeInTheDocument(); // Gen 2, but not Grass
        });

        test('filters by name, type, and generation', async () => {
            render(<PokemonCard />);
            await waitFor(() => {
                expect(screen.queryByText('Loading Pokemon...')).not.toBeInTheDocument();
            });

            const nameInput = screen.getByPlaceholderText('Search by name');
            fireEvent.change(nameInput, { target: { value: 'c' } }); // char, chi, cyn

            const typeSelect = screen.getByRole('combobox', { name: /all types/i });
            fireEvent.change(typeSelect, { target: { value: 'fire' } }); // charmander, cyndaquil

            const genSelect = screen.getByRole('combobox', { name: /all generations/i });
            fireEvent.change(genSelect, { target: { value: 'gen1' } }); // charmander

            expect(screen.getByText('charmander')).toBeInTheDocument();
            expect(screen.queryByText('cyndaquil')).not.toBeInTheDocument();
            expect(screen.queryByText('chikorita')).not.toBeInTheDocument();
            expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
        });
    });
});
