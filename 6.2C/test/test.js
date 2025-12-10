const expect = require('chai').expect;
const request = require('request');
const { evalExpr } = require('../lib');

describe("Calculator API", function() {
    const baseUrl = 'http://localhost:3000/api';

    it("returns status 200 to validate the API is running", function(done) {
        request.get(baseUrl + '/', function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it("test successful addition endpoint use", function(done) {
        request.get(baseUrl + '/add?v1=5&v2=3', function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            const result = JSON.parse(body).result;
            expect(result).to.equal(8);
            done();
        });
    });

    it("test handling missing parameters in addition endpoint", function(done) {
        request.get(baseUrl + '/add?v1=5', function(error, response, body) {
            expect(response.statusCode).to.equal(400);
            const errorMsg = JSON.parse(body).error;
            expect(errorMsg).to.include('Invalid parameters. Both v1 and v2 must be valid numbers');
            done();
        });
    });

    it("test handling non-numeric parameters in addition endpoint", function(done) {
        request.get(baseUrl + '/add?v1=foo&v2=3', function(error, response, body) {
            expect(response.statusCode).to.equal(400);
            const errorMsg = JSON.parse(body).error;
            expect(errorMsg).to.include('Invalid parameters. Both v1 and v2 must be valid numbers');
            done();
        });
    });

});

// Tests for the calculate functionality
describe("Calculate Functionality", function() {
    it("test successful evaluation of expression tree", function (done) {
        const expr = {
            "op": "add",
            "args": [
                1,
                {"op": "power", "args": [2, 3]},
                {"op": "multiply", "args": [4, 5, 6]}
            ]
        };
        const result = evalExpr(expr);
        expect(result).to.equal(129);
        done();
    });

    it("test handling unsupported operator in expression tree", function (done) {
        const expr = {
            "op": "modulus",
            "args": [5, 2]
        };
        try {
            evalExpr(expr);
        } catch (e) {
            expect(e.message).to.include('Unsupported "op". Supported:');
            done();
        }
    });

    it ("test handling invalid node in expression tree", function (done) {
        const expr = {
            "op": "add",
            "args": [1, "two", 3]
        };
        try {
            evalExpr(expr);
        } catch (e) {
            expect(e.message).to.include('Invalid node: must be a number or { op, args }.');
            done();
        }
    });

});