/**
 * @jsx React.DOM
 */

"use strict";

var ReactTestUtils;
var model;

describe("App Test", function () {
    afterEach(function () {
        model.clearAll();
    });
    beforeEach(function () {
        ReactTestUtils = React.addons.TestUtils;
        model = new app.BillModel('bill-model-tests');
    });

    it("App Creation", function () {
        var application = <App model={model}/>;
        ReactTestUtils.renderIntoDocument(application);
        expect(application).toBeDefined();
    });
});
