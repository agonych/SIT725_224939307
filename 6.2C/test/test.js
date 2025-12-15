const { assert, expect } = require('chai');
const request = require('request');
const { evalExpr } = require('../lib');

// Tests to validate the Calculator API endpoints (expect style)
describe("Calculator API", function() {

    const baseUrl = 'http://localhost:3000/api';

    it("returns status 200 to validate the API is running", function(done) {
        request.get(baseUrl + '/', null, function(error, response, _body) {
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it("test successful addition endpoint use", function(done) {
        request.get(baseUrl + '/add', { v1: 5, v2: 3}, function(error, response, body) {
            expect(response.statusCode).to.equal(200);
            const result = JSON.parse(body).result;
            expect(result).to.equal(8);
            done();
        });
    });

    it("test handling missing parameters in addition endpoint", function(done) {
        request.get(baseUrl + '/add', { v1: 5}, function(error, response, body) {
            expect(response.statusCode).to.equal(400);
            const errorMsg = JSON.parse(body).error;
            expect(errorMsg).to.include('Invalid parameters. Both v1 and v2 must be valid numbers');
            done();
        });
    });

    it("test handling non-numeric parameters in addition endpoint", function(done) {
        request.get(baseUrl + '/add', { v1: 'foo', v2: 3}, function(error, response, body) {
            expect(response.statusCode).to.equal(400);
            const errorMsg = JSON.parse(body).error;
            expect(errorMsg).to.include('Invalid parameters. Both v1 and v2 must be valid numbers');
            done();
        });
    });

});

// Tests for the calculate functionality (assert style)
describe("Calculate Functionality", function () {

    it("test successful evaluation of expression tree", function () {
        const expr = {
            op: "add",
            args: [
                1,
                { op: "power", args: [2, 3] },
                { op: "multiply", args: [4, 5, 6] }
            ]
        };

        const result = evalExpr(expr);
        assert.equal(result, 129);
    });

    it("test handling unsupported operator in expression tree", function () {
        const expr = {
            op: "modulus",
            args: [5, 2]
        };

        assert.throws(
            () => evalExpr(expr),
            /Unsupported "op"\. Supported:/
        );
    });

    it("test handling invalid node in expression tree", function () {
        const expr = {
            op: "add",
            args: [1, "two", 3]
        };

        assert.throws(
            () => evalExpr(expr),
            /Invalid node: must be a number or \{ op, args }\./
        );
    });

});