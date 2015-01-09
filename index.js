var average = require('turf-average');
var sum = require('turf-sum');
var median = require('turf-median');
var min = require('turf-min');
var max = require('turf-max');
var deviation = require('turf-deviation');
var variance = require('turf-variance');
var count = require('turf-count');
var operations = {};
operations.average = average;
operations.sum = sum;
operations.median = median;
operations.min = min;
operations.max = max;
operations.deviation = deviation;
operations.variance = variance;
operations.count = count;

/**
* Takes a set of polygons, a set of points, and an array of aggregations, then performs them. Sum, average, count, min, max, and deviation are supported.
*
* @module turf/aggregate
* @param {FeatureCollection} polygonFC - a GeoJSON FeatureCollection containing Polygons
* @param {FeatureCollection} pointFC - a FeatureCollection containing Points
* @param {Array} aggregations - an array of aggregation objects
* @return {FeatureCollection} polys - a FeatureCollection containing polygons with specified aggregation statistics as attributes
* @example
* var polygons = turf.featurecollection([
*   turf.polygon([[[0,0],[10,0],[10,10],[0,10],[0,0]]]),
*   turf.polygon([[[10,0],[20,10],[20,20], [20,0]]])]);
* var points = turf.featurecollection([
*   turf.point(5,5, {population: 200}),
*   turf.point(1,3, {population: 600}),
*   turf.point(14,2, {population: 100}),
*   turf.point(13,1, {population: 200}),
*   turf.point(19,7, {population: 300})]);
* var aggregations = [
*   {
*     aggregation: 'sum',
*     inField: 'population',
*     outField: 'pop_sum'
*   },
*   {
*     aggregation: 'average',
*     inField: 'population',
*     outField: 'pop_avg'
*   },
*   {
*     aggregation: 'median',
*     inField: 'population',
*     outField: 'pop_median'
*   },
*   {
*     aggregation: 'min',
*     inField: 'population',
*     outField: 'pop_min'
*   },
*   {
*     aggregation: 'max',
*     inField: 'population',
*     outField: 'pop_max'
*   },
*   {
*     aggregation: 'deviation',
*     inField: 'population',
*     outField: 'pop_deviation'
*   },
*   {
*     aggregation: 'variance',
*     inField: 'population',
*     outField: 'pop_variance'
*   },
*   {
*     aggregation: 'count',
*     inField: '',
*     outField: 'point_count'
*   }
* ];
*
* var aggregated = turf.aggregate(polygons, points, aggregations);
* 
* //=aggregated
*/

module.exports = function(polygons, points, aggregations){
  for (var i = 0, len = aggregations.length; i < len; i++) {
    var agg = aggregations[i],
      operation = agg.aggregation,
      unrecognizedError;

    if (isAggregationOperation(operation)) {
      if (operation === 'count') {
        polygons = operations[operation](polygons, points, agg.outField);
      } else {
        polygons = operations[operation](polygons, points, agg.inField, agg.outField);
      }
    } else {
      return new Error('"'+ operation +'" is not a recognized aggregation operation.');
    }
  }

  return polygons;
}

function isAggregationOperation(operation) {
  return operation === 'average' ||
    operation === 'sum' ||
    operation === 'median' ||
    operation === 'min' ||
    operation === 'max' ||
    operation === 'deviation' ||
    operation === 'variance' ||
    operation === 'count';
}
