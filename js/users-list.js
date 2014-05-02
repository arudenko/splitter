/** @jsx React.DOM */

var UsersList = React.createClass({
    getInitialState: function () {
        return {
            editing: null,
            selected: null
        };
    },
    handleNewTodoKeyDown: function (event) {
        if (event.which !== ENTER_KEY) {
            return;
        }

        var val = this.refs.newField.getDOMNode().value.trim();

        if (val) {
            this.props.model.addUser(val);
            this.refs.newField.getDOMNode().value = '';
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

    destroy: function (user) {
        this.props.model.destroyUser(user);
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

    select: function (user) {
        this.setState({
            selected: user.id,
            editing: this.state.editing
        });
    },

    render: function () {
        var main;
        var users = this.props.model.users;


        var todoItems = users.map(function (user) {
            return (
                <User
                    key={user.id}
                    user={user}
                    model={this.props.model}
                    onToggle={this.toggle.bind(this, user)}
                    onDestroy={this.destroy.bind(this, user)}
                    onEdit={this.edit.bind(this, user)}
                    editing={this.state.editing === user.id}
                    onSave={this.save.bind(this, user)}
                    onCancel={this.cancel}
                    model={this.props.model}
                    selected={this.state.selected === user.id}
                    onSelect={this.select.bind(this, user)}
                />
                );
        }, this);
        var activeTodoCount = users.reduce(function (accum, todo) {
            return todo.completed ? accum : accum + 1;
        }, 0);

        var totalAmount = users.reduce(function (accum, todo) {
            return accum + parseFloat(todo.amount);
        }, 0);

        if (users.length) {
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
                <input
                ref="newField"
                id="new-todo"
                placeholder="New User"
                onKeyDown={this.handleNewTodoKeyDown}
                autoFocus={true}
                />
            {main}
            </div>
            );
    }
});