var assert = require('assert');
var ecstasy = require('../index.js');

describe('BitSet', function() {
  var bitset;
  beforeEach(function() {
    bitset = new ecstasy.BitSet();
    bitset.set(1, true);
    bitset.set(5, true);
    bitset.set(9, true);
  });
  describe('#constructor()', function() {
    it('should copy bitset if bitset is given', function() {
      assert.deepEqual(bitset, new ecstasy.BitSet(bitset));
    });
    it('should copy value if value is given', function() {
      assert.deepEqual(bitset, new ecstasy.BitSet([546, 0]));
    });
  });
  describe('#size()', function() {
    it('should return valid size in bits', function() {
      assert.equal(bitset.size(), 64);
    });
  });
  describe('#clear()', function() {
    it('should clear specified bit', function() {
      assert.equal(bitset.get(1), true);
      bitset.clear(1);
      assert.equal(bitset.get(1), false);
    });
  });
  describe('#clearRange()', function() {
    it('should clear specified range of bits', function() {
      assert.equal(bitset.get(1), true);
      assert.equal(bitset.get(5), true);
      bitset.clearRange(1, 5);
      assert.equal(bitset.get(1), false);
      assert.equal(bitset.get(5), false);
    });
  });
  describe('#clearAll()', function() {
    it('should clear all the bits', function() {
      bitset.setAll(true);
      bitset.clearAll();
      for(var i = 0; i < bitset.size(); ++i) {
        assert.equal(bitset.get(i), false, 'position ' + i);
      }
    });
  });
  describe('#get()', function() {
    it('should get specified bit correctly', function() {
      bitset.not();
      for(var i = 0; i < 64; ++i) {
         assert.equal(bitset.get(i), true, 'position ' + i);
      }
    });
  });
  describe('#set()', function() {
    it('should set specified bit', function() {
      assert.equal(bitset.get(2), false);
      assert.equal(bitset.get(36), false);
      bitset.set(2, true);
      bitset.set(36, true);
      assert.equal(bitset.get(2), true);
      assert.equal(bitset.get(36), true);
    });
  });
  describe('#setRange()', function() {
    it('should set specified range of bits', function() {
      assert.equal(bitset.get(31), false);
      assert.equal(bitset.get(36), false);
      bitset.setRange(31, 36, true);
      assert.equal(bitset.get(31), true);
      assert.equal(bitset.get(36), true);
    });
  });
  describe('#setAll()', function() {
    it('should set all the bits', function() {
      for(var i = 10; i < bitset.size(); ++i) {
        assert.equal(bitset.get(i), false, 'position ' + i);
      }
      bitset.setAll(true);
      for(var i = 10; i < bitset.size(); ++i) {
        assert.equal(bitset.get(i), true, 'position ' + i);
      }
    });
  });
  describe('#and()', function() {
    var other;
    beforeEach(function() {
      other = new ecstasy.BitSet();
      other.set(1, true);
      other.set(5, true);
    });
    it('should set to 0 if other set is null', function() {
      bitset.setRange(0, 16, true);
      bitset.and();
      for(var i = 0; i <= 16; ++i) {
        assert.equal(bitset.get(i), false, 'position ' + i);
      }
    });
    it('should compute AND correctly', function() {
      bitset.setRange(0, 16, true);
      bitset.and(other);
      for(var i = 0; i <= 16; ++i) {
        assert.equal(other.get(i), bitset.get(i), 'position ' + i);
      }
    });
    it('should set to 0 where exceeds others size', function() {
      bitset.setRange(0, 128, true);
      bitset.and(other);
      for(var i = 64; i <= 128; ++i) {
        assert.equal(bitset.get(i), false, 'position ' + i);
      }
    });
  });
  describe('#or()', function() {
    var other;
    beforeEach(function() {
      other = new ecstasy.BitSet();
      other.set(1, true);
      other.set(5, true);
    });
    it('should do nothing if other set is null', function() {
      bitset.setRange(0, 16, true);
      bitset.or();
      for(var i = 0; i <= 16; ++i) {
        assert.equal(bitset.get(i), true, 'position ' + i);
      }
    });
    it('should compute OR correctly', function() {
      bitset.setRange(0, 16, false);
      bitset.or(other);
      for(var i = 0; i <= 16; ++i) {
        assert.equal(other.get(i), bitset.get(i), 'position ' + i);
      }
    });
    it('should set to bigger one where exceeds intersection size', function() {
      other.setRange(0, 128, true);
      bitset.or(other);
      for(var i = 64; i <= 128; ++i) {
        assert.equal(bitset.get(i), true, 'position ' + i);
      }
    });
  });
  describe('#xor()', function() {
    var other;
    beforeEach(function() {
      other = new ecstasy.BitSet();
      other.set(1, true);
      other.set(5, true);
    });
    it('should do nothing if other set is null', function() {
      bitset.setRange(0, 16, true);
      bitset.xor();
      for(var i = 0; i <= 16; ++i) {
        assert.equal(bitset.get(i), true, 'position ' + i);
      }
    });
    it('should compute XOR correctly', function() {
      bitset.setRange(0, 16, true);
      bitset.xor(other);
      for(var i = 0; i <= 16; ++i) {
        assert.equal(other.get(i), !bitset.get(i), 'position ' + i);
      }
    });
    it('should set to bigger one where exceeds intersection size', function() {
      other.setRange(0, 128, true);
      bitset.xor(other);
      for(var i = 64; i <= 128; ++i) {
        assert.equal(bitset.get(i), true, 'position ' + i);
      }
    });
  });
  describe('#not()', function() {
    var other;
    beforeEach(function() {
      other = new ecstasy.BitSet(bitset);
    });
    it('should compute NOT correctly', function() {
      bitset.not();
      for(var i = 0; i <= 16; ++i) {
        assert.equal(bitset.get(i), !other.get(i), 'position ' + i);
      }
    });
  });
  describe('#isEmpty()', function() {
    var other;
    beforeEach(function() {
      other = new ecstasy.BitSet();
    });
    it('should return correct value', function() {
      assert.equal(bitset.isEmpty(), false);
      assert.equal(other.isEmpty(), true);
    });
  });
  describe('#intersects()', function() {
    var other;
    beforeEach(function() {
      other = new ecstasy.BitSet();
    });
    it('should return false if null is given', function() {
      assert.equal(bitset.intersects(null), false);
    });
    it('should return false if not intersects', function() {
      other.set(4, true);
      assert.equal(bitset.intersects(other), false);
    });
    it('should return true if intersects', function() {
      other.set(5, true);
      assert.equal(bitset.intersects(other), true);
    });
  });
  describe('#contains()', function() {
    var other;
    beforeEach(function() {
      other = new ecstasy.BitSet();
    });
    it('should return false if null is given', function() {
      assert.equal(bitset.contains(null), false);
    });
    it('should return false if not contains', function() {
      other.set(4, true);
      assert.equal(bitset.contains(other), false);
      other.set(5, true);
      assert.equal(bitset.contains(other), false);
    });
    it('should return true if contains', function() {
      other.set(5, true);
      assert.equal(bitset.contains(other), true);
    });
  });
  describe('#equals()', function() {
    var other;
    beforeEach(function() {
      other = new ecstasy.BitSet(bitset);
    });
    it('should return false if null is given', function() {
      assert.equal(bitset.equals(null), false);
    });
    it('should return false if not equals', function() {
      other.set(4, true);
      assert.equal(bitset.equals(other), false);
    });
    it('should return true if equals', function() {
      assert.equal(bitset.equals(other), true);
    });
    it('should handle different sizes well', function() {
      other.set(96, true);
      assert.equal(bitset.equals(other), false);
      assert.equal(other.equals(bitset), false);
      other.set(96, false);
      assert.equal(bitset.equals(other), true);
      assert.equal(other.equals(bitset), true);
    });
  });
  describe('#toString()', function() {
    it('should return binary numbers by default', function() {
      assert.equal(bitset.toString(), '0 1000100010');
    });
    it('should return by specified radix', function() {
      assert.equal(bitset.toString(8), '0 1042');
    });
  });
});
