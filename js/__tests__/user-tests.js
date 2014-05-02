/**
 * @jsx React.DOM
 */

"use strict";

var ReactTestUtils;
var model;

describe("Users/ User List Test", function () {
    afterEach(function () {
        model.clearAll();
    });
    beforeEach(function () {
        ReactTestUtils = React.addons.TestUtils;
        model = new app.BillModel('bill-model-tests');
        model.addItem("Test Name", 1, 22.34);
        model.addUser("Alex");
        model.addUser("Alex Other");
    });

    it("UserList Creation", function () {
        var usersList = <UsersList model={model}/>;
        ReactTestUtils.renderIntoDocument(usersList);
        expect(usersList).toBeDefined();
    });

});