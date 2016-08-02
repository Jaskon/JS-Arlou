describe("min()", function() {

  it("min(0, 10) should return 0", function() {
    assert.equal(min(0,10), 0);
  });

  it("min(0, -10) should return -10 ", function() {
    assert.equal(min(0, -10), -10);
  });

});