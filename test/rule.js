import Code from 'code';
import Rule from '../src/rule';

const { expect }  = Code;

const testCases = {
  prefixes: {
    description: 'Prefix only',
    config:      { prefixes: 'a', replacePrefix: true, replaceSuffix: true },
    found:       { a: '', abc: 'bc' },
    notFound:    { ba: 'ba', ' a': ' a', A: 'A' },
  },

  suffixes: {
    description: 'Suffix only',
    config:      { suffixes: '=', replacePrefix: true, replaceSuffix: true },
    found:       { 'A=': 'A', 'bdf=': 'bdf' },
    notFound:    { aaa: 'aaa', mnd: 'mnd' },
  },

  prefixSuffixes: {
    description: 'Prefix and suffixes combined',
    config:      {
      prefixes:      ['a', 'x', 'zul'], suffixes:      ['=', '?'], replacePrefix: true, replaceSuffix: true,
    },
    found: {
      'A=':   'A', 'bdf=': 'bdf', 'a=':   '', xs:     's', 'xjd=': 'jd', 'ss?':  'ss', 'xd?':  'd', 'x?':   '', zulb:   'b',
    },
    notFound: { 'df=w': 'df=w', Adh: 'Adh' },
  },

  exceptPrefixElements: {
    description: 'Elements and except prefixes combined',
    config:      {
      elements:       ['abc', 'def'], exceptPrefixes: 'a', replacePrefix:  true, replaceSuffix:  true,
    },
    found:    { abc: 'abc', def: 'def' },
    notFound: { ab: 'b' },
  },

  prefixAndexceptSuffixes: {
    description: 'Prefix and except suffixes combined',
    config:      {
      prefixes:       'a', exceptSuffixes: '!', replacePrefix:  true, replaceSuffix:  true,
    },
    found:    { a: '', ab: 'b' },
    notFound: { 'a!': 'a', 'bf!': 'bf', jj: 'jj' },
  },

  exceptAndSuffixes: {
    description: 'Except and suffixes combined',
    config:      {
      prefixes:      'a', except:        'abc', replacePrefix: true, replaceSuffix: true,
    },
    found:    { a: '', ab: 'b' },
    notFound: { abc: 'abc', sd: 'sd' },
  },

  prefixSuffixesNoReplace: {
    description: 'Prefix and suffixes combined without replace',
    config:      { prefixes: ['a', 'x', 'zul'], suffixes: ['=', '?'] },
    found:       {
      'A=':   'A=', 'bdf=': 'bdf=', 'a=':   'a=', xs:     'xs', 'xjd=': 'xjd=', 'ss?':  'ss?', 'xd?':  'xd?', 'x?':   'x?', zulb:   'zulb',
    },
    notFound: { 'df=w': 'df=w', Adh: 'Adh' },
  },
};

// Execute test cases:
Object.keys(testCases).forEach((key) => {
  const testCase = testCases[key];

  describe(testCase.description, () => {
    const rule = new Rule(testCase.config);

    Object.keys(testCase.found).forEach((field, i) => {
      const expected = testCase.found[field];
      it(`should find name in sample index ${i}.`, (done) => {
        expect(rule.has(field)).to.equal({ found: true, name: expected });
        done();
      });
    });

    Object.keys(testCase.notFound).forEach((field, i) => {
      const expected = testCase.notFound[field];
      it(`should not find name in sample index ${i}.`, (done) => {
        expect(rule.has(field)).to.equal({ found: false, name: expected });
        done();
      });
    });
  });
});

describe('has method', () => {
  it('should allow optional replacement of prefix and suffix - 1.', (done) => {
    const rule = new Rule({
      prefixes:      'a', suffixes:      'z', replacePrefix: true, replaceSuffix: true,
    });
    const result = rule.has('abbz', { replacePrefix: false, replaceSuffix: false });

    expect(result).to.equal({ found: true, name: 'abbz' });
    done();
  });

  it('should allow optional replacement of prefix and suffix - 2.', (done) => {
    const rule = new Rule();
    const result = rule.has('abbz');

    expect(result).to.equal({ found: true, name: 'abbz' });
    done();
  });
});
