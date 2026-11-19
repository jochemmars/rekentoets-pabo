import { describe, expect, it } from 'vitest';
import { tellerCode, veiligeUrl } from '../../src/config';

describe('instellingen', () => {
  it('accepteert alleen een https-link als doneerlink', () => {
    expect(veiligeUrl('https://ko-fi.com/voorbeeld')).toBe('https://ko-fi.com/voorbeeld');
    expect(veiligeUrl('  https://tikkie.me/pay/abc  ')).toBe('https://tikkie.me/pay/abc');
    expect(veiligeUrl('http://ko-fi.com/voorbeeld')).toBe('');
    expect(veiligeUrl('javascript:alert(1)')).toBe('');
    expect(veiligeUrl('geen link')).toBe('');
    expect(veiligeUrl(undefined)).toBe('');
  });
  it('accepteert alleen een gewone GoatCounter-code', () => {
    expect(tellerCode('rekentoets-pabo')).toBe('rekentoets-pabo');
    expect(tellerCode('Rekentoets')).toBe('');
    expect(tellerCode('a.b/c')).toBe('');
    expect(tellerCode('')).toBe('');
  });
});
