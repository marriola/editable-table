import React from "react";
import EditableColumn from "components/editable-column";
import EditCommand from "components/edit-command";
import DeleteCommand from "components/delete-command";
import { RowMode } from "components/table-common";

/**
 * A table row which can be switched between view and edit modes.
 *
 * The component keeps a copy of its row separate from the table. Changes are made to that row as the user
 * makes changes to it. 
 */
export default class EditableRow extends React.Component {
    constructor(props) {
	super(props);

	// Set the initial state
	//
	// mode          RowMode.View or RowMode.Edit
	// columns       The column values in this row
	// newRow    In view mode, this is an identical copy of columns.
	//               In edit mode, it contains the values in the EditableColumns.
	// columnsView   columns mapped to a list of <td> elements
	
	this.state = {
	    newRow: this.props.source.columns.slice(),
	    mode: RowMode.View
	};
    }

    
    ////////////////////////////////////////////////////////////////////////////
    // Event handlers
    ////////////////////////////////////////////////////////////////////////////    

    
    /**
     * A document-wide keyup listened for the Escape and Enter keys for cancelling and saving, respectively.
     */
    keyUp(e) {
	switch (e.which || e.keyCode) {
	    case 27:
		this.cancel();
		break;

	    case 13:
		this.save();
		break;
	}
    }

    /**
     * Receives a change event from an EditableColumn
     */
    change(index, e) {
	let newRow = this.state.newRow.slice();
	newRow[index] = e.target.value;
	this.setState({ newRow });
    }
    
    
    ////////////////////////////////////////////////////////////////////////////
    // Helper methods
    ////////////////////////////////////////////////////////////////////////////    


    /**
     * Maps the row's column values to table columns
     */
    mapColumns(mode) {
	return this.state.newRow.map((val, i) => {
	    let col;
	    if (mode === RowMode.View) {
		col = (<td>{ val }</td>);
	    }
	    else if (mode === RowMode.Edit) {
		col = (<EditableColumn source={ val }
				       change={ this.change.bind(this, i) }
				       keyUp={ this.keyUp.bind(this) }
		       />);
	    }
	    
	    return col;
	});
    }

    
    /**
     * Sets the mode of this table row
     */
    setMode(mode) {
	this.props.setMode(mode);

	// The view mode, which we just set through and inherit from the parent,
	// has changed, so we have to re-render our cells
	this.forceUpdate();
    }

    
    ////////////////////////////////////////////////////////////////////////////
    // Row commands
    ////////////////////////////////////////////////////////////////////////////    

    
    /**
     * Sets edit mode
     */
    edit() {
	this.setMode(RowMode.Edit);
    }

    /**
     * Saves the modified column values and sets view mode
     */
    save() {
	this.props.updateRow(this.state.newRow);	
	this.setMode(RowMode.View);
	this.setState({
	    columns: this.state.newRow.slice()
	});
    }

    /**
     * Discards the modified column values and sets view mode
     */
    cancel() {
	this.setMode(RowMode.View);
	this.setState({
	    newRow: this.props.source.columns.slice()
	});

	if (this.props.source.isNewRow) {
	    this.props.removeRow();
	}
    }

    
    ////////////////////////////////////////////////////////////////////////////    

    
    render() {
	debugger;
	return (<tr>
	    { this.mapColumns(this.props.source.mode) }
	    
	    <EditCommand mode={ this.props.source.mode }
			 edit={ this.edit.bind(this) }
			 save={ this.save.bind(this) }
	    />

	    <DeleteCommand removeRow={ this.props.removeRow } />
	</tr>);
    }
}

