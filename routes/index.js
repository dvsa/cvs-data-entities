var express = require('express');
var router = express.Router();
var jsonSize = require('json-size');
var numberUtils = require('../utils/numberUtils');

var vehicleJson = require('../json/VehicleWithTechRecordAmended');
var testTypesJson = require('../json/TestTypesWithProducts');
var defectsJson = require('../json/Defects');
var atfDetailsJson = require('../json/ATFInfo');
var testCaptureJson = require('../json/Visit');
var testCancellationJson = require('../json/TestCancellationReasons');
var waitTimesJson = require('../json/WaitTimeReasons');

var results = {};

const decimalPlaces = 4;
const vehicleIncreasePercentage = 0.20;
const testTypesIncreasePercentage = 1.10;
const defectIncreasePercentage = 1.05;
const atfDetailsIncreasePercentage = 1.20;
const testCancellationIncreasePercentage = 1.10;
const waitTypeIncreasePercentage = 1.10;

/* GET home page. */
router.get('/', function (req, res, next) {

  var byteToMbConversion = 0.000001;
  var mbToGbConverstion = 0.001;

  function calculateDataSetData(dataSize, recordCount, percentageIncrease) {
    var result = {};
    result.size = dataSize
    result.recordCount = recordCount;
    result.currentValue = (result.size * result.recordCount) * byteToMbConversion;
    result.yearOnYearIncreasePercentage = percentageIncrease;
    result.fiveYearEstimateValue =
      numberUtils.calculatePercentageIncrease(
        result.currentValue,
        result.yearOnYearIncreasePercentage,
        5);
    result.tenYearEstimateValue =
      numberUtils.calculatePercentageIncrease(
        result.currentValue,
        result.yearOnYearIncreasePercentage,
        10
      );
    return result;
  }

  // Vehicle
  var vehicles = JSON.stringify(vehicleJson);
  results.vehicles = calculateDataSetData(jsonSize(vehicles), 2360574, 4);

  // Test Types
  var testTypes = JSON.stringify(testTypesJson);
  results.testTypes = calculateDataSetData(jsonSize(testTypes), 242, 2);

  // Defects
  var defects = JSON.stringify(defectsJson);
  results.defects = calculateDataSetData(jsonSize(defects), 1889, 1);

  // ATF Details
  var atfDetails = JSON.stringify(atfDetailsJson);
  results.atfDetails = calculateDataSetData(jsonSize(atfDetails), 802, 4);

  // Test Capture
  var testCaptures = JSON.stringify(testCaptureJson);
  results.testCaptures = calculateDataSetData(jsonSize(testCaptures), 5, 2);

  // Test Cancellations
  var testCancellations = JSON.stringify(testCancellationJson);
  results.testCancellations = calculateDataSetData(jsonSize(testCancellations), 17, 2);

  // Wait Times
  var waitTimes = JSON.stringify(waitTimesJson);
  results.waitTimes = calculateDataSetData(jsonSize(waitTimes), 10, 2);

  // Totals
  var currentMbTotal = numberUtils.round(numberUtils.totalOnKey("currentValue", results), decimalPlaces);
  var currentGbTotal = numberUtils.round(currentMbTotal * mbToGbConverstion, decimalPlaces);
  var fiveYearProjectionMbTotal = numberUtils.round(numberUtils.totalOnKey("fiveYearEstimateValue", results), decimalPlaces);
  var fiveYearProjectionGbTotal = numberUtils.round(fiveYearProjectionMbTotal * mbToGbConverstion, decimalPlaces);
  var tenYearProjectionMbTotal = numberUtils.round(numberUtils.totalOnKey("tenYearEstimateValue", results), decimalPlaces);
  var tenYearProjectionGbTotal = numberUtils.round(tenYearProjectionMbTotal * mbToGbConverstion, decimalPlaces);

  // Format output
  Object.keys(results).forEach((outerKey, index) => {
    Object.keys(results[outerKey]).forEach((innerKey, index) => {
      if (innerKey.indexOf('Value') !== -1) {
        results[outerKey][innerKey] = numberUtils.round(results[outerKey][innerKey], decimalPlaces);
      }
    })
  })

  res.render('index',
    {
      vehicles: results.vehicles,
      testTypes: results.testTypes,
      defects: results.defects,
      atfDetails: results.atfDetails,
      testCaptures: results.testCaptures,
      testCancellations: results.testCancellations,
      waitTimes: results.waitTimes,
      currentMbTotal: currentMbTotal,
      currentGbTotal: currentGbTotal,
      fiveYearProjectionMbTotal: fiveYearProjectionMbTotal,
      fiveYearProjectionGbTotal: fiveYearProjectionGbTotal,
      tenYearProjectionMbTotal: tenYearProjectionMbTotal,
      tenYearProjectionGbTotal: tenYearProjectionGbTotal,
      title: 'Data Set Sizes'
    }
  );
});

module.exports = router;
