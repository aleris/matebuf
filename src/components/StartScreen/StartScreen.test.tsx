import { render, screen } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { StartScreen } from './StartScreen';
import type { GemCount } from '../../types';

// Mock the SCSS module
vi.mock('./StartScreen.module.scss', () => ({
  default: {
    container: 'container',
    owlContainer: 'owlContainer',
    owl: 'owl',
    title: 'title',
    gemCounter: 'gemCounter',
    gemTitle: 'gemTitle',
    gemCount: 'gemCount',
    gemBreakdown: 'gemBreakdown',
    gemItem: 'gemItem',
    gemImage: 'gemImage',
    gemName: 'gemName',
    startButton: 'startButton',
  },
}));

// Mock the images
vi.mock('../../assets/owl_start.png', () => ({
  default: 'mocked-owl-start.png',
}));

vi.mock('../../assets/gems/ruby_small.png', () => ({
  default: 'mocked-ruby-small.png',
}));

vi.mock('../../assets/gems/topaz_small.png', () => ({
  default: 'mocked-topaz-small.png',
}));

vi.mock('../../assets/gems/sapphire_small.png', () => ({
  default: 'mocked-sapphire-small.png',
}));

describe('StartScreen', () => {
  const mockOnStart = vi.fn();

  it('displays individual gem counts correctly', () => {
    const gems: GemCount = {
      ruby_small: 3,
      topaz_small: 2,
      sapphire_small: 1,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    // Check that individual gem counts are displayed correctly
    expect(screen.getByText('3')).toBeInTheDocument(); // ruby_small count
    expect(screen.getByText('2')).toBeInTheDocument(); // topaz_small count
    expect(screen.getByText('1')).toBeInTheDocument(); // sapphire_small count
  });

  it('displays individual gem counts for all gem types', () => {
    const gems: GemCount = {
      ruby_small: 2,
      topaz_small: 1,
      sapphire_small: 0,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    // Check that individual gem counts are displayed for all types
    expect(screen.getByText('2')).toBeInTheDocument(); // ruby_small count
    expect(screen.getByText('1')).toBeInTheDocument(); // topaz_small count
    expect(screen.getByText('0')).toBeInTheDocument(); // sapphire_small count
  });

  it('displays zero counts when no gems are collected', () => {
    const gems: GemCount = {
      ruby_small: 0,
      topaz_small: 0,
      sapphire_small: 0,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    // Check that individual gem counts are 0 (there should be 3 zeros total: 3 individual)
    const zeroElements = screen.getAllByText('0');
    expect(zeroElements).toHaveLength(3);
  });

  it('displays all gem types even when counts are zero', () => {
    const gems: GemCount = {
      ruby_small: 0,
      topaz_small: 0,
      sapphire_small: 0,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    // All gem types should be displayed with their counts (including zeros)
    expect(screen.getByText('Ruby')).toBeInTheDocument();
    expect(screen.getByText('Topaz')).toBeInTheDocument();
    expect(screen.getByText('Sapphire')).toBeInTheDocument();
    
    // Check that all counts (including zeros) are displayed
    const gemCounts = screen.getAllByText('0');
    expect(gemCounts).toHaveLength(3); // 3 individual gem counts only
  });

  it('calls onStart when start button is clicked', () => {
    const gems: GemCount = {
      ruby_small: 0,
      topaz_small: 0,
      sapphire_small: 0,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    const startButton = screen.getByText('Start Game');
    startButton.click();

    expect(mockOnStart).toHaveBeenCalledTimes(1);
  });

  it('displays the game title', () => {
    const gems: GemCount = {
      ruby_small: 0,
      topaz_small: 0,
      sapphire_small: 0,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    expect(screen.getByText('Mate Buf')).toBeInTheDocument();
  });

  it('displays the gems collected heading', () => {
    const gems: GemCount = {
      ruby_small: 0,
      topaz_small: 0,
      sapphire_small: 0,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    expect(screen.getByText('Gems Collected')).toBeInTheDocument();
  });

  it('displays gem images for all gem types', () => {
    const gems: GemCount = {
      ruby_small: 1,
      topaz_small: 2,
      sapphire_small: 3,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    // Check that gem images are displayed
    const rubyImage = screen.getByAltText('Ruby');
    const topazImage = screen.getByAltText('Topaz');
    const sapphireImage = screen.getByAltText('Sapphire');

    expect(rubyImage).toBeInTheDocument();
    expect(topazImage).toBeInTheDocument();
    expect(sapphireImage).toBeInTheDocument();

    // Check that images have correct src attributes
    expect(rubyImage).toHaveAttribute('src', 'mocked-ruby-small.png');
    expect(topazImage).toHaveAttribute('src', 'mocked-topaz-small.png');
    expect(sapphireImage).toHaveAttribute('src', 'mocked-sapphire-small.png');
  });

  it('displays gem names for all gem types', () => {
    const gems: GemCount = {
      ruby_small: 0,
      topaz_small: 0,
      sapphire_small: 0,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    // Check that gem names are displayed
    expect(screen.getByText('Ruby')).toBeInTheDocument();
    expect(screen.getByText('Topaz')).toBeInTheDocument();
    expect(screen.getByText('Sapphire')).toBeInTheDocument();
  });

  it('displays correct individual counts for each gem type', () => {
    const gems: GemCount = {
      ruby_small: 5,
      topaz_small: 3,
      sapphire_small: 7,
    };

    render(<StartScreen gems={gems} bestTime={null} onStart={mockOnStart} />);

    // Check that individual counts are displayed correctly
    const gemCounts = screen.getAllByText(/\d+/);
    expect(gemCounts).toHaveLength(3); // 3 individual counts only
    
    // Check specific counts
    expect(screen.getByText('5')).toBeInTheDocument(); // ruby_small
    expect(screen.getByText('3')).toBeInTheDocument(); // topaz_small
    expect(screen.getByText('7')).toBeInTheDocument(); // sapphire_small
  });
});