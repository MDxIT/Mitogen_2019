describe("Analysis compareDiscreteTextResults function", function() {
  var limitObj;

  beforeEach(function() {
    limitObj = [{"not_equal_interpretation":"nothingHere","not_equal_css":"analysisIgnore","not_equal_wording":""},{"discrete_limit":"Green","equal_wording":"","equal_interpretation":"happy","equal_css":"analysisPass"},{"discrete_limit":"Yellow","equal_wording":"","equal_interpretation":"","equal_css":"analysisAlert"},{"discrete_limit":"Orange","equal_wording":"","equal_interpretation":"","equal_css":"analysisWarning"}]
  });

  it("should return style of analysisPass and interpretation of happy when input is string Green ", function() {
    expect(compareDiscreteTextResults(limitObj, "Green")).toEqual({"cssStyle": "analysisPass", "interpretation": "happy"});
  });

  it("should return style of analysisIgnore and interpretation of nothingHere when input is string green ", function() {
    expect(compareDiscreteTextResults(limitObj, "green")).toEqual({"cssStyle": "analysisIgnore", "interpretation": "nothingHere"});
  });

  it("should return style of analysisIgnore and interpretation of nothingHere when input is string Purple ", function() {
    expect(compareDiscreteTextResults(limitObj, "Purple")).toEqual({"cssStyle": "analysisIgnore", "interpretation": "nothingHere"});
  });

  it("should return style of analysisIgnore and interpretation of nothingHere when input is string purple ", function() {
    expect(compareDiscreteTextResults(limitObj, "purple")).toEqual({"cssStyle": "analysisIgnore", "interpretation": "nothingHere"});
  });

  it("should return style of blank and interpretation of blank when input is blank ", function() {
    expect(compareDiscreteTextResults(limitObj, "")).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is undefined ", function() {
    expect(compareDiscreteTextResults(limitObj, undefined)).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is null ", function() {
    expect(compareDiscreteTextResults(limitObj, null)).toEqual({"cssStyle": "", "interpretation": ""});
  });

});


describe("Analysis compareDiscreteNumResults function", function() {
  var limitObj;

  beforeEach(function() {
    limitObj = [{"not_equal_interpretation":"nothingHere","not_equal_css":"analysisIgnore","not_equal_wording":""},{"discrete_limit":"4","equal_wording":"","equal_interpretation":"happy","equal_css":"analysisPass"}]
  });

  it("should return style of analysisPass and interpretation of happy when input is string 4 ", function() {
    expect(compareDiscreteNumResults(limitObj, "4")).toEqual({"cssStyle": "analysisPass", "interpretation": "happy"});
  });

  it("should return style of analysisPass and interpretation of happy when input is number 4 ", function() {
    expect(compareDiscreteNumResults(limitObj, 4)).toEqual({"cssStyle": "analysisPass", "interpretation": "happy"});
  });

  it("should return style of analysisIgnore and interpretation of nothingHere when input is string 9 ", function() {
    expect(compareDiscreteNumResults(limitObj, "9")).toEqual({"cssStyle": "analysisIgnore", "interpretation": "nothingHere"});
  });

  it("should return style of analysisIgnore and interpretation of nothingHere when input is number 9 ", function() {
    expect(compareDiscreteNumResults(limitObj, 9)).toEqual({"cssStyle": "analysisIgnore", "interpretation": "nothingHere"});
  });

  it("should return style of analysisIgnore and interpretation of nothingHere when input is string 0 ", function() {
    expect(compareDiscreteNumResults(limitObj, "0")).toEqual({"cssStyle": "analysisIgnore", "interpretation": "nothingHere"});
  });

  it("should return style of analysisIgnore and interpretation of nothingHere when input is number 0 ", function() {
    expect(compareDiscreteNumResults(limitObj, 0)).toEqual({"cssStyle": "analysisIgnore", "interpretation": "nothingHere"});
  });

  it("should return style of analysisIgnore and interpretation of nothingHere when input is string -1 ", function() {
    expect(compareDiscreteNumResults(limitObj, "-1")).toEqual({"cssStyle": "analysisIgnore", "interpretation": "nothingHere"});
  });

  it("should return style of analysisIgnore and interpretation of nothingHere when input is number -1 ", function() {
    expect(compareDiscreteNumResults(limitObj, -1)).toEqual({"cssStyle": "analysisIgnore", "interpretation": "nothingHere"});
  });

  it("should return style of blank and interpretation of blank when input is blank ", function() {
    expect(compareDiscreteNumResults(limitObj, "")).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is undefined ", function() {
    expect(compareDiscreteNumResults(limitObj, undefined)).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is null ", function() {
    expect(compareDiscreteNumResults(limitObj, null)).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is string Purple ", function() {
    expect(compareDiscreteNumResults(limitObj, "Purple")).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is null ", function() {
    expect(compareDiscreteNumResults(limitObj, NaN)).toEqual({"cssStyle": "", "interpretation": ""});
  });

});



describe("Analysis compareRangeResults function", function() {
  var limitObj;

  beforeEach(function() {
    limitObj = {"lower_limit":"44",
      "upper_limit":"100",
      "below_lower_interpretation":"is below lower limit",
      "below_lower_css":"analysisFail",
      "equal_lower_interpretation":"is equal lower limit",
      "equal_lower_css":"analysisIgnore",
      "in_range_interpretation":"is in range",
      "in_range_css":"analysisPass",
      "equal_upper_interpretation":"is equal upper limit",
      "equal_upper_css":"analysisAlert",
      "above_upper_interpretation":"is above upper range limit",
      "above_upper_css":"analysisWarning",
      "below_lower_wording":"",
      "equal_lower_wording":"",
      "in_range_wording":"",
      "equal_upper_wording":"",
      "above_upper_wording":""
   }
  });

  it("should return style of analysisFail and interpretation of is below lower limit when input is number 4 ", function() {
    expect(compareRangeResults(limitObj, 4)).toEqual({"cssStyle": "analysisFail", "interpretation": "is below lower limit"});
  });

  it("should return style of analysisIgnore and interpretation of is equal lower limit when input is number 44 ", function() {
    expect(compareRangeResults(limitObj, 44)).toEqual({"cssStyle": "analysisIgnore", "interpretation": "is equal lower limit"});
  });

  it("should return style of analysisPass and interpretation of is in range when input is number 67 ", function() {
    expect(compareRangeResults(limitObj, 67)).toEqual({"cssStyle": "analysisPass", "interpretation": "is in range"});
  });

  it("should return style of analysisAlert and interpretation of is equal upper limit when input is number 100 ", function() {
    expect(compareRangeResults(limitObj, 100)).toEqual({"cssStyle": "analysisAlert", "interpretation": "is equal upper limit"});
  });

  it("should return style of analysisWarning and interpretation of is above upper range limit when input is number 105 ", function() {
    expect(compareRangeResults(limitObj, 105)).toEqual({"cssStyle": "analysisWarning", "interpretation": "is above upper range limit"});
  });


  it("should return style of analysisFail and interpretation of is below lower limit when input is number 0 ", function() {
    expect(compareRangeResults(limitObj, 0)).toEqual({"cssStyle": "analysisFail", "interpretation": "is below lower limit"});
  });
  it("should return style of analysisFail and interpretation of is below lower limit when input is number -1 ", function() {
    expect(compareRangeResults(limitObj, -1)).toEqual({"cssStyle": "analysisFail", "interpretation": "is below lower limit"});
  });


  it("should return style of blank and interpretation of blank when input is blank ", function() {
    expect(compareRangeResults(limitObj, "")).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is undefined ", function() {
    expect(compareRangeResults(limitObj, undefined)).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is null ", function() {
    expect(compareRangeResults(limitObj, null)).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is string Purple ", function() {
    expect(compareRangeResults(limitObj, "Purple")).toEqual({"cssStyle": "", "interpretation": ""});
  });

  it("should return style of blank and interpretation of blank when input is null ", function() {
    expect(compareRangeResults(limitObj, NaN)).toEqual({"cssStyle": "", "interpretation": ""});
  });

});




