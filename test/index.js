import Code from 'code';
import FixSet from '../src/index';

const { expect }  = Code;

const testCases = {
  noRule: {
    description: 'No rule',
    found:       { a: 'a', abc: 'abc' },
    notFound:    [],
  },
  emptyRule: {
    description: 'Empty rule',
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
  undefinedInclude: {
    description: 'Undefined include, exclude',
    config:      { include: undefined },
    found:       { a: 'a', abc: 'abc' },
  },
  undefinedPrefixes: {
    description: 'Undefined prefixes',
    config:      { include: { prefixes: undefined } },
    found:       { a: 'a', abc: 'abc' },
  },
  includeOnly: {
    description: 'Include only',
    config:      {
      include: {
        prefixes:       'a', exceptPrefixes: 'aa', replacePrefix:  true, replaceSuffix:  true,
      },
    },
    found:    { a: '', abc: 'bc' },
    notFound: ['ba', ' a', 'A', 'aabc'],
  },
  includeAndExceptOnly: {
    description: 'Include and except only',
    config:      {
      include: {
        exceptPrefixes: 'aa', replacePrefix:  true, replaceSuffix:  true,
      },
    },
    found:    { a: 'a', abc: 'abc' },
    notFound: ['aabc'],
  },
  excludeAndExceptOnly: {
    description: 'Exclude and except only',
    config:      {
      exclude: {
        exceptPrefixes: 'aa', replacePrefix:  true, replaceSuffix:  true,
      },
    },
    found:    { aabc: 'bc' },
    notFound: ['abc', 'bc'],
  },
  excludeOnly: {
    description: 'Exclude only',
    config:      {
      exclude: {
        prefixes:       'a', exceptPrefixes: 'aa', replacePrefix:  true, replaceSuffix:  true,
      },
    },
    found: {
      ba:   'ba', ' a': ' a', A:    'A', aabc: 'bc',
    },
    notFound: ['a', 'abc'],
  },

  includeExclude: {
    description: 'Include and exclude combined',
    config:      {
      include: {
        prefixes:       'a', exceptPrefixes: 'aaaa', replacePrefix:  true, replaceSuffix:  true,
      },
      exclude: {
        prefixes:       'aa', exceptPrefixes: 'aaa', replacePrefix:  true, replaceSuffix:  true,
      },
    },
    found:    { aAge: 'Age', aaaAge: 'aaAge' }, // include rule is prioritized in naming, exclude rule is prioritized in decision.
    notFound: ['aaAge', 'aaaaAge'],
  },

  includeExcludeRegExp: {
    description: 'Include and exclude combined with regular expression.',
    config:      {
      include: {
        suffixes:       /=(.+?)=$/, exceptSuffixes: '=forbidden=', replacePrefix:  true, replaceSuffix:  true,
      },
      exclude: {
        suffixes:       new RegExp('==(.+?)=$'), exceptSuffixes: '==include=', replacePrefix:  true, replaceSuffix:  true,
      },
    },
    found:    { 'name=eq=': 'name', 'name==include=': 'name' }, // include rule is prioritized in naming, exclude rule is prioritized in decision.
    notFound: ['name==other=', 'name=forbidden='],
  },
};

// Execute test cases:
Object.keys(testCases).forEach((key) => {
  const testCase = testCases[key];

  describe(testCase.description, () => {
    const rule = new FixSet(testCase.config);

    if (testCase.found) {
      Object.keys(testCase.found).forEach((field, i) => {
        const expected = testCase.found[field];
        it(`should return element name in sample index ${i}.`, (done) => {
          expect(rule.has(field)).to.be.true();
          expect(rule.getName(field)).to.equal(expected);
          done();
        });
      });
    }

    if (testCase.notFound) {
      testCase.notFound.forEach((element, i) => {
        it(`should report non-compliant elements as false in sample index ${i}`, (done) => {
          expect(rule.has(element)).to.be.false();
          expect(rule.getName(element)).to.undefined();
          done();
        });
      });
    }
  });
});

describe('getName method', () => {
  it('should allow optional replacement of prefix and suffix.', (done) => {
    const rule = new FixSet({
      include: {
        prefixes:      'a', suffixes:      'z', replacePrefix: true, replaceSuffix: true,
      },
    });
    const result = rule.getName('abbz', { replacePrefix: false, replaceSuffix: false });

    expect(result).to.equal('abbz');
    done();
  });
});

describe('FixSet', () => {
  it('should throw when Joi assertion fails - 1.', (done) => {
    expect(() => new FixSet({ include: 3 })).to.throw(/"include" must be an object/);
    done();
  });

  it('should throw when Joi assertion fails - 2.', (done) => {
    expect(() => new FixSet({ xxx: 3 })).to.throw(/"xxx" is not allowed/);
    done();
  });

  it('should throw when Joi assertion fails - 2.', (done) => {
    expect(() => new FixSet({ include: { elements: 3 } })).to.throw(/"elements" must be an array/);
    done();
  });
});
