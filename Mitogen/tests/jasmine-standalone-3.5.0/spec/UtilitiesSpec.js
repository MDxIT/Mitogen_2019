
describe("Utilities blankIfFalsy function", function() {

  it("should return Green value ", function() {
    expect(blankIfFalsy("Green")).toEqual("Green");
  });

  it("should return 2 ", function() {
    expect(blankIfFalsy(2)).toEqual(2);
  });

  it("should return blank value for blank", function() {
    expect(blankIfFalsy("")).toEqual("");
  });
  it("should return blank value for undefined", function() {
    expect(blankIfFalsy(undefined)).toEqual("");
  });
  it("should return blank value for string null ", function() {
    expect(blankIfFalsy("null")).toEqual("");
  });
  it("should return blank value for null", function() {
    expect(blankIfFalsy(null)).toEqual("");
  });
});


