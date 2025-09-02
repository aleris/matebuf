import { describe, it, expect } from 'vitest';
import { ro } from './ro';
import { en } from './en';

describe('Romanian Translation', () => {
  it('should have all required translation keys', () => {
    const englishKeys = Object.keys(en) as Array<keyof typeof en>;
    const romanianKeys = Object.keys(ro) as Array<keyof typeof ro>;
    
    expect(romanianKeys).toEqual(englishKeys);
  });

  it('should have different values than English for most keys', () => {
    const englishKeys = Object.keys(en) as Array<keyof typeof en>;
    
    let differentCount = 0;
    for (const key of englishKeys) {
      if (en[key] !== ro[key]) {
        differentCount++;
      }
    }
    
    // Most keys should be different (translated), except for 'Mate Buf' which might stay the same
    expect(differentCount).toBeGreaterThan(10);
  });

  it('should have proper Romanian translations for key phrases', () => {
    expect(ro['Start Game']).toBe('Începe Jocul');
    expect(ro['Gems Collected']).toBe('Pietre Prețioase Colectate');
    expect(ro['Question']).toBe('Întrebarea');
    expect(ro['Submit Answer']).toBe('Verifică Răspunsul');
    expect(ro['Correct!']).toBe('Corect!');
    expect(ro['Try again!']).toBe('Încearcă din nou!');
    expect(ro['Congratulations!']).toBe('Felicitări!');
    expect(ro['Ruby']).toBe('Rubin');
    expect(ro['Topaz']).toBe('Topaz');
    expect(ro['Sapphire']).toBe('Safir');
  });
});
