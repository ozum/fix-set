import Code from 'code';
import { convertToArray, convertToSet, getNameWithoutFix, getRegExp } from '../src/helper';

const { expect }  = Code;

describe('convertToSet', () => {
  it('should convert string to Set.', (done) => {
    const result = convertToSet('element');
    expect(result).to.equal(new Set(['element']));
    done();
  });

  it('should convert array to Set.', (done) => {
    const result = convertToSet(['a', 'b', 'c']);
    expect(result).to.equal(new Set(['a', 'b', 'c']));
    done();
  });

  it('should create a new Set from Set.', (done) => {
    const source = new Set(['a', 'b', 'c']);
    const result = convertToSet(source);

    result.add('d');

    expect(result).to.equal(new Set(['a', 'b', 'c', 'd']));
    expect(source).to.equal(new Set(['a', 'b', 'c']));
    done();
  });

  it('should return empty set for undefined', (done) => {
    expect(convertToSet()).to.equal(new Set());
    done();
  });

  it('should convert RegExp to Set of RegExp', (done) => {
    expect(convertToSet(/a/)).to.equal(new Set([/a/]));
    done();
  });

  it('should throw non-compliant type', (done) => {
    const objectToSet = () => convertToSet({});
    expect(objectToSet).to.throw(/^input must be/);
    done();
  });
});

describe('convertToArray', () => {
  it('should convert string to Array.', (done) => {
    const result = convertToArray('element');
    expect(result).to.equal(['element']);
    done();
  });

  it('should convert array to array.', (done) => {
    const result = convertToArray(['a', 'b', 'c']);
    expect(result).to.equal(['a', 'b', 'c']);
    done();
  });

  it('should create a new Array from Set.', (done) => {
    const result = convertToArray(new Set(['a', 'b', 'c']));
    expect(result).to.equal(['a', 'b', 'c']);
    done();
  });

  it('should return empty array for undefined', (done) => {
    expect(convertToArray()).to.equal([]);
    done();
  });

  it('should throw non-compliant type', (done) => {
    const objectToArray = () => convertToArray({});
    expect(objectToArray).to.throw(/^input must be/);
    done();
  });
});


describe('getNameWithouFix', () => {
  const argsReplace       = [[/^a/], [/z$/], true, true];
  const argsNoReplace     = [[/^a/], [/z$/], false, false];

  it('Replace included prefix', (done) => {
    expect(getNameWithoutFix('aName', ...argsReplace)).to.equal('Name');
    done();
  });

  it('Replace included suffix', (done) => {
    expect(getNameWithoutFix('Namez', ...argsReplace)).to.equal('Name');
    done();
  });

  it('Return undefined for not included.', (done) => {
    expect(getNameWithoutFix('Other', ...argsReplace)).to.undefined();
    done();
  });

  it('Return name for included prefix', (done) => {
    expect(getNameWithoutFix('aName', ...argsNoReplace)).to.equal('aName');
    done();
  });

  it('Return name for included suffix', (done) => {
    expect(getNameWithoutFix('Namez', ...argsNoReplace)).to.equal('Namez');
    done();
  });
});

describe('getRegExp', () => {
  it('should return prefixed regular expression', (done) => {
    expect(getRegExp('a', 'prefix').source).to.equal('^a');
    done();
  });

  it('should return suffixed regular expression', (done) => {
    expect(getRegExp('a', 'suffix').source).to.equal('a$');
    done();
  });

  it('should return prefix regular expression input as is.', (done) => {
    expect(getRegExp(new RegExp('^abc'), 'prefix').source).to.equal('^abc');
    done();
  });

  it('should return suffix regular expression input as is.', (done) => {
    expect(getRegExp(new RegExp('abc$'), 'suffix').source).to.equal('abc$');
    done();
  });

  it('should return empty regular expression if input is undefined.', (done) => {
    expect(getRegExp(undefined, 'suffix').source).to.equal('(?:)');   // new RegExp('').source is equal to '(?:)'.
    done();
  });


  it('should throw if prefix regular expression does not begin with "^".', (done) => {
    expect(() => getRegExp(new RegExp('abc'), 'prefix')).to.throw('Prefix regular expression must begin with "^"');
    done();
  });

  it('should throw if suffix regular expression does not end with "$".', (done) => {
    expect(() => getRegExp(new RegExp('abc'), 'suffix')).to.throw('Suffix regular expression must end with "$"');
    done();
  });
});
