import React from "react";
import EditableColumn from "components/editable-column";
import EditCommand from "components/edit-command";
import { RowMode } from "components/table-common";

/**
 * A table row which can be switched between view and edit modes.
 */
export default class EditableRow extends React.Component {
    constructor(props) {
	super(props);

	// Set the initial state
	//
	// mode          RowMode.View or RowMode.Edit
	// columns       The column values in this row
	// newColumns    In view mode, this is an identical copy of columns.
	//               In edit mode, it contains the values in the EditableColumns.
	// columnsView   columns mapped to a list of <td> elements
	
	this.state = {
	    mode: this.props.source.mode || RowMode.View,
	    columns: this.props.source.columns,
	    newColumns: this.props.source.columns.slice()
	};

    	this.state.columnsView = this.mapColumns(RowMode.View);
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
	let newColumns = this.state.newColumns.slice();
	newColumns[index] = e.target.value;
	this.setState({ newColumns });
    }
    
    
    ////////////////////////////////////////////////////////////////////////////
    // Helper methods
    ////////////////////////////////////////////////////////////////////////////    


    /**
     * Maps the row's column values to table columns
     */
    mapColumns(mode) {
	return this.state.newColumns.map((val, i) => {
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
	this.setState({
	    mode,
	    columnsView: this.mapColumns(mode)
	});
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
	if (!this.props.source.key) {
	    debugger;
	    this.props.saveNew(this.state.newColumns);
	}
	
	this.setMode(RowMode.View);
	this.setState({
	    columns: this.state.newColumns.slice()
	});
    }

    /**
     * Discards the modified column values and sets view mode
     */
    cancel() {
	this.setMode(RowMode.View);
	this.setState({
	    newColumns: this.state.columns.slice()
	});

	if (!this.props.source.key) {
	    this.props.removeLast();
	}
    }

    
    ////////////////////////////////////////////////////////////////////////////    

    
    render() {
	return (<tr id={ this.props.source.key }>
	    { this.mapColumns(this.state.mode) }
	    
	    <EditCommand mode={ this.state.mode }
			 edit={ this.edit.bind(this) }
			 save={ this.save.bind(this) }
	    />
	</tr>);
    }
}

