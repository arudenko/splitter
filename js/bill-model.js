/**
 * @jsx React.DOM
 */
/*jshint quotmark:false */
/*jshint white:false */
/*jshint trailing:false */
/*jshint newcap:false */
var app = app || {};

(function () {
    'use strict';

    var Utils = app.Utils;
    var default_service_charge = 10;
    var default_tax = 7.0;


    // Generic "model" object. You can use whatever
    // framework you want. For this application it
    // may not even be worth separating this logic
    // out, but we do this to demonstrate one way to
    // separate out parts of your application.
    app.BillModel = function (key) {
        this.key = key;
        this.key_users = key + "_users";
        this.items = Utils.store(key);
        this.users = Utils.store(this.key_users);
        this.onChanges = [];

        this.service_charge = default_service_charge;
        this.tax = default_tax;
    };

    app.BillModel.prototype.updateTaxes = function (service_charge, tax) {
        this.service_charge = service_charge;
        this.tax = tax;
        this.inform();
    };

    app.BillModel.prototype.applyTaxesChargesForAmount = function (amount) {
        var amount_after_service = amount + amount * (this.service_charge * 0.01);
        return amount_after_service + amount_after_service * (this.tax * 0.01);

    };

    app.BillModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };

    /**
     * Save data to local storage and notify subscribers about change
     */
    app.BillModel.prototype.inform = function () {
        Utils.store(this.key, this.items);
        Utils.store(this.key_users, this.users);
        this.onChanges.forEach(function (cb) {
            cb();
        });
    };

    app.BillModel.prototype.addItem = function (title, count, amount) {
        this.items = this.items.concat({
            id: Utils.uuid(),
            title: title,
            completed: false,
            count: count,
            amount: amount
        });

        this.inform();
    };

    app.BillModel.prototype.addUser = function (title) {
        this.users = this.users.concat({
            id: Utils.uuid(),
            title: title,
            consumed_items: []
        });
        this.inform();
    };

    /**
     * Add user Consumption
     * @param selectedItem Bill Item object
     * @param userToUpdate User object
     * @param quantity quantity (float)
     */
    app.BillModel.prototype.addUserConsumption = function (selectedItem, userToUpdate, quantity) {

        this.users = this.users.map(function (user) {

            if (user !== userToUpdate) {
                return user;
            } else {
                //Update same consumption with new value
                var indexToRemove = -1;
                for (var i = 0; i < user.consumed_items.length; i++) {
                    var obj = user.consumed_items[i];
                    if (obj.item_id == selectedItem.id) {
                        indexToRemove = i;
                    }
                }

                if (indexToRemove > -1) {
                    user.consumed_items.splice(indexToRemove, 1);
                }

                user.consumed_items = user.consumed_items.concat({item_id: selectedItem.id, quantity: quantity});

                return Utils.extend({}, user);
            }
        });

        this.inform();
    };

    /**
     * How much user owes money for specific amount
     * @param selectedUser
     * @param consumedItemId
     * @returns {number}
     */
    app.BillModel.prototype.getUserItemAmount = function (selectedUser, consumedItemId) {
        var item = this.getItemById(consumedItemId);
        var consumedItem;
        for (var i = 0; i < selectedUser.consumed_items.length; i++) {
            var o = selectedUser.consumed_items[i];
            if (o.item_id == consumedItemId) {
                consumedItem = o;
            }
        }
        if (!consumedItem) {
            return 0;
        }

        return this.applyTaxesChargesForAmount(consumedItem.quantity * item.amount / item.count);
    };

    app.BillModel.prototype.getUserItemCount = function (selectedUser, consumedItemId) {
        var consumedItem;
        for (var i = 0; i < selectedUser.consumed_items.length; i++) {
            var o = selectedUser.consumed_items[i];
            if (o.item_id == consumedItemId) {
                consumedItem = o;
            }
        }
        if (!consumedItem) {
            return 0;
        }

        return consumedItem.quantity;
    };

    app.BillModel.prototype.getUserTotalQuantity = function (selectedUser) {
        return selectedUser.consumed_items.reduce(function (accum, item) {
            return accum + item.quantity;
        }, 0);
    };


    app.BillModel.prototype.getUserTotalAmount = function (selectedUser) {
        var res = 0;
        for (var i = 0; i < selectedUser.consumed_items.length; i++) {
            var consumedItem = selectedUser.consumed_items[i];
            res += this.getUserItemAmount(selectedUser, consumedItem.item_id);
        }
        return res;
    };

    app.BillModel.prototype.getItemById = function (id) {
        for (var i = 0; i < this.items.length; i++) {
            var obj = this.items[i];
            if (obj.id == id) {
                return obj;
            }
        }
        return null;
    };


    /**
     * Remove item from list
     * @param item
     */
    app.BillModel.prototype.destroyItem = function (item) {

        this.users = this.users.map(function (user) {
            //Update same consumption with new value
            var indexToRemove = -1;
            for (var i = 0; i < user.consumed_items.length; i++) {
                var obj = user.consumed_items[i];
                if (obj.item_id == item.id) {
                    indexToRemove = i;
                }
            }

            if (indexToRemove > -1) {
                user.consumed_items.splice(indexToRemove, 1);
            }

            return Utils.extend({}, user);
        });

        this.items = this.items.filter(function (candidate) {
            return candidate !== item;
        });

        this.inform();
    };

    /**
     * Delete User
     * @param user
     */
    app.BillModel.prototype.destroyUser = function (user) {
        this.users = this.users.filter(function (candidate) {
            return candidate !== user;
        });

        this.inform();
    };

    app.BillModel.prototype.save = function (itemToSave, text) {
        this.items = this.items.map(function (item) {
            return item !== itemToSave ? item : Utils.extend({}, item, {title: text});
        });

        this.inform();
    };

    app.BillModel.prototype.saveUser = function (itemToSave, text) {
        this.users = this.users.map(function (item) {
            return item !== itemToSave ? item : Utils.extend({}, item, {title: text});
        });

        this.inform();
    };

    app.BillModel.prototype.clearAll = function () {
        this.items = [];
        this.users = [];
        this.updateTaxes(default_service_charge, default_tax);

        this.inform();
    };

    app.BillModel.prototype.getItemLeftQuantity = function (item) {
        var totalAmount = this.users.reduce(function (accum, user) {
            var userAmount = user.consumed_items.reduce(function (accum, consumedItem) {
                if (consumedItem.item_id == item.id) {
                    return accum + consumedItem.quantity;
                } else {
                    return accum;
                }

            }, 0);

            return accum + userAmount;
        }, 0);
        return item.count - totalAmount;
    };
})();