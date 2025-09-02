import { vi } from 'vitest';
import { en } from '../../locales/en';

export const mockUseTranslation = () => ({
  t: vi.fn((key: keyof typeof en) => en[key] || key),
  locale: 'en',
  changeLocale: vi.fn(),
  isLoading: false,
  supportedLocales: ['en', 'es', 'fr', 'ro'],
});

// Mock the hook for all tests
vi.mock('../../hooks/useTranslation', () => ({
  useTranslation: mockUseTranslation,
}));