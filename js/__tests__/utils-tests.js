/**
 * @jsx React.DOM
 */

"use strict";

var ReactTestUtils;
var utils;

describe("Utils Test", function () {
    beforeEach(function () {
        ReactTestUtils = React.addons.TestUtils;
        utils = app.Utils;
    });

    it("UUID", function () {
        var result_uuid = utils.uuid();
        expect(result_uuid.length).toBe(36);
    });

    it("Pluralize", function () {
        var res;
        res = utils.pluralize(2, "Word");
        expect(res).toBe("Words");
        res = utils.pluralize(1, "Word");
        expect(res).toBe("Word");
    });

    it("Extend", function () {
        var a = {
            x: "x",
            y: "y"
        };

        var b = utils.extend(a, {c: "c"});

        expect(b.c).toBe("c");
        a = utils.extend(a, {x:"z", c: "c"});

        expect(a.x).toBe("z");
        expect(a.c).toBe("c");
    });

});
