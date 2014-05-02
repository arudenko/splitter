/** @jsx React.DOM */

var model = new app.BillModel('bill-model');
function render() {
    React.renderComponent(
        App({model:model}),
        document.getElementById('container')
    );
}

model.subscribe(render);
render();

