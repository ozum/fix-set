const Lab  = require('lab');
const Code = require('code');

const lab      = Lab.script();
const describe = lab.describe;
const it       = lab.it;
const expect   = Code.expect;

exports.lab = lab;

const util       = require('../lib/util');

describe('convertToSet', () => {
  const convertToSet   = util.convertToSet;

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

  it('should throw non-compliant type', (done) => {
    const objectToSet = () => convertToSet({});
    expect(objectToSet).to.throw('Not convertible to Set.');
    done();
  });
});

describe('convertToArray', () => {
  const convertToArray = util.convertToArray;

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
    expect(objectToArray).to.throw('Not convertible to Array.');
    done();
  });
});


describe('getNameWithouFix', () => {
  const argsReplace       = [[/^a/], [/z$/], true, true];
  const argsNoReplace     = [[/^a/], [/z$/], false, false];
  const getNameWithoutFix = util.getNameWithoutFix;

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

describe('escapeRegExp', () => {
  it('should escape regexp', (done) => {
    expect(util.escapeRegExp('a?')).to.equal('a\\?');
    done();
  });

  it('should return undefined as it is', (done) => {
    expect(util.escapeRegExp()).to.undefined();
    done();
  });
});
