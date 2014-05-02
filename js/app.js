/** @jsx React.DOM */

var ENTER_KEY = 13;

var Bill = React.createClass({
    getInitialState: function () {
        return {
            editing: null
        };
    },
    handleNewTodoKeyDown: function (event) {
        if (event.which !== ENTER_KEY) {
            return;
        }

        var val = this.refs.newField.getDOMNode().value.trim();
        var count = this.refs.newCount.getDOMNode().value.trim();
        var amount = this.refs.newAmount.getDOMNode().value.trim();

        if (val) {
            this.props.model.addItem(val, count, amount);
            this.refs.newField.getDOMNode().value = '';
            this.refs.newCount.getDOMNode().value = '0';
            this.refs.newAmount.getDOMNode().value = '0';
        }
        this.refs.newField.getDOMNode().focus();
        return false;
    },
    toggleAll: function (event) {
        var checked = event.target.checked;
        this.props.model.toggleAll(checked);
    },

    toggle: function (todoToToggle) {
        this.props.model.toggle(todoToToggle);
    },

    destroyItem: function (todo) {
        this.props.model.destroyItem(todo);
    },

    edit: function (todo, callback) {
        // refer to todoItem.js `handleEdit` for the reasoning behind the
        // callback
        this.setState({editing: todo.id}, function () {
            callback();
        });
    },

    save: function (todoToSave, text) {
        this.props.model.save(todoToSave, text);
        this.setState({editing: null});
    },

    cancel: function () {
        this.setState({editing: null});
    },

    clearCompleted: function () {
        this.props.model.clearCompleted();
    },

    render: function () {
        var main;
        var footer;
        var items = this.props.model.items;


        var todoItems = items.map(function (item) {
            return (
                <BillItem
                key={item.id}
                item={item}
                model={this.props.model}
                onToggle={this.toggle.bind(this, item)}
                onDestroy={this.destroyItem.bind(this, item)}
                onEdit={this.edit.bind(this, item)}
                editing={this.state.editing === item.id}
                onSave={this.save.bind(this, item)}
                onCancel={this.cancel}
                />
                );
        }, this);
        var activeTodoCount = items.reduce(function (accum, todo) {
            return todo.completed ? accum : accum + 1;
        }, 0);

        var totalAmount = items.reduce(function (accum, todo) {
            return accum + parseFloat(todo.amount);
        }, 0);

        if (items.length) {
            main = (
                <section id="main">
                    <input
                    id="toggle-all"
                    type="checkbox"
                    onChange={this.toggleAll}
                    checked={activeTodoCount === 0}
                    />
                    <ul id="todo-list">
							{todoItems}
                    </ul>
                </section>
                );
        }

        return (

            <div>
            Count: {activeTodoCount} Amount: ${totalAmount}<br/>
                Name|Count|Total Amount for item

                <table>
                    <tr>
                        <td width="60%">
                            <input
                            ref="newField"
                            id="new-todo"
                            placeholder="Item from bill"
                            onKeyDown={this.handleNewTodoKeyDown}
                            autoFocus={true}
                            />
                        </td>
                        <td>
                            <input
                            ref="newCount"
                            id="new-todo"
                            placeholder="0"
                            defaultValue="0"
                            onKeyDown={this.handleNewTodoKeyDown}
                            />
                        </td>
                        <td>
                            <input
                            ref="newAmount"
                            id="new-todo"
                            placeholder="0"
                            defaultValue="0"
                            onKeyDown={this.handleNewTodoKeyDown}
                            />
                        </td>
                    </tr>
                </table>
            {main}
            </div>
            );
    }
});

var App = React.createClass({

    render: function () {
        return (

            <div>
                <Bill model={this.props.model}/>
                Users:
                <UsersList model={this.props.model}/>
            </div>
            );
    }
});