/**
 * @jsx React.DOM
 */

"use strict";

var ReactTestUtils;
var utils;
var model;

describe("Bill Model Tests", function () {
    afterEach(function () {
        model.clearAll();
    });
    beforeEach(function () {
        ReactTestUtils = React.addons.TestUtils;
        utils = app.Utils;
        model = new app.BillModel('bill-model-tests');
    });

    it("Clear All", function () {
        var items;
        var users;

        items = model.items;
        users = model.users;
        expect(items.length).toBe(0);
        expect(users.length).toBe(0);

        model.addItem("Test Name", 1, 22.34);
        model.addUser("Alex");

        items = model.items;
        users = model.users;
        expect(items.length).toBe(1);
        expect(users.length).toBe(1);
        model.clearAll();

        items = model.items;
        users = model.users;
        expect(items.length).toBe(0);
        expect(users.length).toBe(0);

    });

    it("Add Item", function () {
        var items;

        model.addItem("Test Name", 1, 22.34);
        items = model.items;

        var res = items[0];
        expect(res.title).toBe("Test Name");
        expect(res.count).toBe(1);
        expect(res.amount).toBe(22.34);

    });

    it("Add User", function () {
        model.addUser("Alex");
        var users = model.users;

        expect(users.length).toBe(1);
    });

    it("Update User", function () {
        model.addUser("Alex");
        var users = model.users;

        expect(users.length).toBe(1);

        model.saveUser(model.users[0], "Alex New");

        expect(model.users[0].title).toBe("Alex New");
    });

    it("Remove User", function () {
        model.addUser("Alex");
        var users;
        users = model.users;
        expect(users.length).toBe(1);

        model.destroyUser(model.users[0]);
        users = model.users;
        expect(users.length).toBe(0);
    });

    it("Add User Consumption Count", function () {
        model.addItem("Test Name", 1, 22.34);
        model.addItem("Test Name 1", 3, 22.34);
        model.addUser("Alex");
        var selectedUser = model.users[0];
        model.addUserConsumption(model.items[0], selectedUser, 10);

        var item = model.items[1];
        model.addUserConsumption(item, model.users[0], 2.5);
        var res = model.getUserTotalQuantity(model.users[0]);
        expect(res).toBe(12.5);
    });

    it("Updated User Consumption", function () {
        model.addItem("Test Name", 4, 20);
        model.addItem("Test Name 1", 3, 15);
        model.addUser("Alex");

        model.updateTaxes(0,0);

        model.addUserConsumption(model.items[0], model.users[0], 1);

        model.addUserConsumption(model.items[1], model.users[0], 2);
        model.addUserConsumption(model.items[0], model.users[0], 2);

        var res = model.getUserTotalQuantity(model.users[0]);
        expect(res).toBe(4);

        res = model.getUserTotalAmount(model.users[0]);
        expect(res).toBe(20);
    });

    it("getUserItemAmount", function () {
        model.addItem("Test Name", 4, 20);
        model.addItem("Test Name 1", 3, 22.34);
        model.addUser("Alex");

        model.addUserConsumption(model.items[0], model.users[0], 1);
        model.addUserConsumption(model.items[0], model.users[0], 2);

        var res = model.getUserItemAmount(model.users[0], model.items[0].id);
        expect(res).toBe(11.77);

    });

    it("Add User Consumption Amount", function () {
        model.addItem("Test Name", 2, 40);
        model.addItem("Test Name 1", 3, 15);
        model.addUser("Alex");

        model.addUserConsumption(model.items[0], model.users[0], 2);
        model.addUserConsumption(model.items[1], model.users[0], 2);

        var res = model.getUserTotalAmount(model.users[0]);
        expect(res).toBeCloseTo(58.85, 2);

    });

    it("getUserItemCount", function () {
        model.addItem("Test Name", 2, 40);
        model.addItem("Test Name 1", 3, 15);
        model.addUser("Alex");

        model.addUserConsumption(model.items[0], model.users[0], 2);
        model.addUserConsumption(model.items[1], model.users[0], 2);

        var res = model.getUserItemCount(model.users[0], model.items[1].id);
        expect(res).toBe(2);

    });

    it("Get Item By Id", function () {
        model.addItem("Test Name", 1, 22.34);
        model.addItem("Test Name 1", 3, 22.34);

        expect(model.getItemById(model.items[0].id)).toBe(model.items[0]);
    });

    it("getItemLeftQuantity ", function () {
        model.addItem("Test Name", 2, 40);
        model.addItem("Test Name 1", 3, 15);
        model.addUser("Alex");

        model.addUserConsumption(model.items[0], model.users[0], 2);
        model.addUserConsumption(model.items[1], model.users[0], 2);

        var res;
        res = model.getItemLeftQuantity(model.items[0]);
        expect(res).toBe(0);

        res = model.getItemLeftQuantity(model.items[1]);
        expect(res).toBe(1);
    });

    it("applyTaxesChargesForAmount", function () {
        var res = model.applyTaxesChargesForAmount(59.4);
        expect(res).toBeCloseTo(69.91, 2);
    });

    it("Delete Item -- delete reference in each user", function () {
        model.addItem("Test Name", 2, 40);
        model.addItem("Test Name 1", 3, 15);
        model.addUser("Alex");

        model.addUserConsumption(model.items[0], model.users[0], 2);
        model.addUserConsumption(model.items[1], model.users[0], 2);
        model.destroyItem(model.items[0]);

        var res = model.getUserTotalQuantity(model.users[0]);
        expect(res).toBe(2);
    });

});