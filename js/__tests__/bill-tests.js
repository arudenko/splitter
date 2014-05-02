/**
 * @jsx React.DOM
 */

"use strict";

var ReactTestUtils;
var utils;
var model;

describe("Bill Test", function () {
    afterEach(function () {
        model.clearAll();
    });
    beforeEach(function () {
        ReactTestUtils = React.addons.TestUtils;
        utils = app.Utils;
        model = new app.BillModel('bill-model-tests');
    });

    it("BillItem Creation", function () {
        var bill_item = {
            id: utils.uuid(),
            title: "Some Title",
            completed: false
        };

        var bill = <BillItem item={bill_item} model={model}/>;
        ReactTestUtils.renderIntoDocument(bill);
        expect(bill).toBeDefined();
    });
});