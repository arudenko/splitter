/**
 * @jsx React.DOM
 */

"use strict";

var ReactTestUtils;
var utils;

describe("Bill Test", function () {
    beforeEach(function () {
        ReactTestUtils = React.addons.TestUtils;
        utils = app.Utils;
    });

    it("BillItem Creation", function () {
        var bill_item = {
            id: utils.uuid(),
            title: "Some Title",
            completed: false
        };

        var bill = <BillItem item={bill_item}/>;
        ReactTestUtils.renderIntoDocument(bill);
        expect(bill).toBeDefined();
    });
});