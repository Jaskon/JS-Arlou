describe("isEven()", function() {

  it("isEven(50) should be true", function() {
    assert.equal(isEven(50), true);
  });

  it("isEven(75) should be false ", function() {
    assert.equal(isEven(75), false);
  });

   it("isEven(-1) should be false ", function() {
    assert.equal(isEven(-1), false);
  });

});