const Code = require('code');

const expect   = Code.expect;

const FixRule = require('../index');

const testCases = {
  none: {
    description: 'No rule',
    config:      {},
    found:       { a: 'a', abc: 'abc' },
    notFound:    [],
  },
  emptyInclude: {
    description: 'Empty include, exclude',
    config:      { include: {}, exclude: {} },
    found:       { a: 'a', abc: 'abc' },
    notFound:    [],
  },
  includeOnly: {
    description: 'Include only',
    config:      { include: { prefixes: 'a', exceptPrefixes: 'aa', replacePrefix: true, replaceSuffix: true } },
    found:       { a: '', abc: 'bc' },
    notFound:    ['ba', ' a', 'A', 'aabc'],
  },

  excludeOnly: {
    description: 'Exclude only',
    config:      { exclude: { prefixes: 'a', exceptPrefixes: 'aa', replacePrefix: true, replaceSuffix: true } },
    found:       { ba: 'ba', ' a': ' a', A: 'A', aabc: 'bc' },
    notFound:    ['a', 'abc'],
  },

  includeExclude: {
    description: 'Include and exclude combined',
    config:      {
      include: { prefixes: 'a', exceptPrefixes: 'aaaa', replacePrefix: true, replaceSuffix: true },
      exclude: { prefixes: 'aa', exceptPrefixes: 'aaa', replacePrefix: true, replaceSuffix: true },
    },
    found:    { aAge: 'Age', aaaAge: 'aaAge' }, // include rule is prioritized in naming, exclude rule is prioritized in decision.
    notFound: ['aaAge', 'aaaaAge'],
  },
};

// Execute test cases:
Object.keys(testCases).forEach((key) => {
  const testCase = testCases[key];

  describe(testCase.description, () => {
    const rule = new FixRule(testCase.config);

    Object.keys(testCase.found).forEach((field, i) => {
      const expected = testCase.found[field];
      it(`should return element name in sample index ${i}.`, (done) => {
        expect(rule.has(field)).to.be.true();
        expect(rule.getName(field)).to.equal(expected);
        done();
      });
    });

    testCase.notFound.forEach((element, i) => {
      it(`should report non-compliant elements as false in sample index ${i}`, (done) => {
        expect(rule.has(element)).to.be.false();
        expect(rule.getName(element)).to.undefined();
        done();
      });
    });
  });
});

describe('getName method', () => {
  it('should allow optional replacement of prefix and suffix.', (done) => {
    const rule = new FixRule({ include: { prefixes: 'a', suffixes: 'z', replacePrefix: true, replaceSuffix: true } });
    const result = rule.getName('abbz', { replacePrefix: false, replaceSuffix: false });

    expect(result).to.equal('abbz');
    done();
  });
});
