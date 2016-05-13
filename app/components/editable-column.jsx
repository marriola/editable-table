import React from "react";

/**
 * A table column whose value lives in an <input> element
 */
export default class EditableColumn extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	return (<td>
	    <input id="new-row"
		   type="text"
		   className="edit-row"
		   value={ this.props.source }
		   onChange={ this.props.change }
		   onKeyUp={ this.props.keyUp }
	    />
	</td>);
    }

    componentDidMount() {
	document.getElementById("new-row").focus();
    }
}
