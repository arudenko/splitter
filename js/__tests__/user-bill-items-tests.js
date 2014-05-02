/**
 * @jsx React.DOM
 */

"use strict";

var ReactTestUtils;
var model;

describe("User Bill Items Tests", function () {
    afterEach(function () {
        model.clearAll();
    });
    beforeEach(function () {
        ReactTestUtils = React.addons.TestUtils;
        model = new app.BillModel('bill-model-tests');
        model.addItem("Test Item Name", 1, 22.34);
        model.addUser("User 1");
        model.addUser("User 2");
    });

    it("UserBillItem Creation", function () {
        var userBillItem = <UserBillItem user={model.users[0]} billItem={model.items[0]} model={model}/>;
        ReactTestUtils.renderIntoDocument(userBillItem);
        expect(userBillItem).toBeDefined();
    });

});