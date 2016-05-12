import React from "react";
import { RowMode } from "components/table-common";

/**
 * A table column containing an "Edit/Save" button
 */
export default class EditCommand extends React.Component {
    constructor(props) {
	super(props);
    }

    render() {
	let command;
	let commandText;

	if (this.props.mode == RowMode.View) {
	    command = this.props.edit;
	    commandText = "Edit";
	} else if (this.props.mode == RowMode.Edit) {
	    command = this.props.save;
	    commandText = "Save";
	}
	
	return (<td>
	    <button onClick={ command } >
		{ commandText }
	    </button>
	</td>);
    }
}
