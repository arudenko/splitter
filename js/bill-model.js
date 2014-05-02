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
    };

    app.BillModel.prototype.subscribe = function (onChange) {
        this.onChanges.push(onChange);
    };

    app.BillModel.prototype.inform = function () {
        Utils.store(this.key, this.items);
        Utils.store(this.key_users, this.users);
        this.onChanges.forEach(function (cb) { cb(); });
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
            consumed_items:[]
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
                    if (obj.item_id == selectedItem.id){
                        indexToRemove = i;
                    }
                }

                if (indexToRemove > -1){
                    user.consumed_items.splice(indexToRemove);
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
            if(o.item_id == consumedItemId){
                consumedItem = o;
            }
        }
        if (!consumedItem){
            return 0;
        }

        return consumedItem.quantity * item.amount / item.count;
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
            if (obj.id == id){
                return obj;
            }
        }
        return null;
    };


    app.BillModel.prototype.toggleAll = function (checked) {
        // Note: it's usually better to use immutable data structures since they're
        // easier to reason about and React works very well with them. That's why we
        // use map() and filter() everywhere instead of mutating the array or todo
        // items themselves.
        this.items = this.items.map(function (todo) {
            return Utils.extend({}, todo, {completed: checked});
        });

        this.inform();
    };

    app.BillModel.prototype.toggle = function (todoToToggle) {
        this.items = this.items.map(function (todo) {
            return todo !== todoToToggle ?
                todo :
                Utils.extend({}, todo, {completed: !todo.completed});
        });

        this.inform();
    };

    /**
     * Remove item from list
     * @param item
     */
    app.BillModel.prototype.destroyItem = function (item) {
        //TODO Remove this item form all users
        this.items = this.items.filter(function (candidate) {
            return candidate !== item;
        });

        this.inform();
    };

    app.BillModel.prototype.destroyUser = function (item) {
        this.users = this.users.filter(function (candidate) {
            return candidate !== item;
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

    app.BillModel.prototype.clearCompleted = function () {
        this.items = this.items.filter(function (todo) {
            return !todo.completed;
        });

        this.inform();
    };

    app.BillModel.prototype.clearAll = function () {
        this.items = [];
        this.users = [];
        this.inform();
    };

    app.BillModel.prototype.getItemLeftQuantity = function (item){
        var totalAmount = this.users.reduce(function (accum, user) {
            var userAmount = user.consumed_items.reduce(function (accum, consumedItem) {
                if (consumedItem.item_id == item.id){
                    return accum + consumedItem.quantity;
                } else {return accum;}

            }, 0);

            return accum + userAmount;
        }, 0);
        return item.count - totalAmount;
    };
})();