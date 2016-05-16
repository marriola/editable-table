import React from "react";

/**
 * A table column whose value lives in an <input> element
 */
export default class EditableColumn extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    newRow: this.props.source.slice()
	};
    }

    change(e) {
	this.setState({
	    newRow: e.target.value
	});
	this.props.change(e);
    }

    render() {
	return (<td>
	    <input id="new-row"
		   type="text"
		   className="edit-row"
		   value={ this.state.newRow }
		   onChange={ this.change.bind(this) }
		   onKeyUp={ this.props.keyUp }
	    />
	</td>);
    }

    componentDidMount() {
	document.getElementById("new-row").focus();
    }
}
