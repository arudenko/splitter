/** @jsx React.DOM */

var UserBillItem = React.createClass({
    handleChange: function (event) {
        var value = parseFloat(this.refs.amount.getDOMNode().value);
        //console.log();
        //this.props.model

        this.props.model.addUserConsumption(this.props.billItem, this.props.user, value);
    },

    render: function(){
        var value = this.props.model.getUserItemAmount(this.props.user, this.props.billItem.id);
        return (
            <div>
                 {this.props.billItem.title} <input ref="amount" defaltValue={value} onChange={this.handleChange}/>
            </div>
        );
    }
});