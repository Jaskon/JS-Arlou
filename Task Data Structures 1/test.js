describe("deepEqual()", function() {

  it("deepEqual(obj,obj) should return true ", function() {
  	var obj = {here: {is: "an"}, object: 2};
  	assert.deepEqual(deepEqual(obj, obj), true);
  });

   it("deepEqual(obj, {here: 1, object: 2}) should return false ", function() {
  	var obj = {here: {is: "an"}, object: 2};
  	assert.deepEqual(deepEqual(obj, {here: 1, object: 2}), false);
  });

    it("deepEqual(obj, {here: {is: 'an'}, object: 2}) should return true ", function() {
  	var obj = {here: {is: "an"}, object: 2};
  	assert.deepEqual(deepEqual(obj, {here: {is: "an"}, object: 2}), true);
  });

});


 