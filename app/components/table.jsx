import React from "react";
import { RowMode } from "components/table-common";
import EditableRow from "components/editable-row";

/**
 * An editable table component
 *
 * The component's state consists of:
 *
 * source        A copy of the table decorated with metadata
 * addingNew     True when the last row is a new row in edit
 *               mode, false otherwise
 */
export class Table extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    source: this.props.source.map(row => ({
		key: Table.nextKey(),
		mode: RowMode.View,
		columns: row,
		newColumns: []
	    })),

	    addingNew: false
	};
    }


    /**
     * Extracts the columns from the decorated table and passes
     * the new table to the parent component.
     */
    updateParent(newTable) {
	this.props.saveRows(newTable.map(row => row.columns));
    }
    

    /**
     * Sets a row's mode
     *
     * This method looks stupid, but row is bound to the source
     * row before being passed to an EditableRow component
     */
    setMode(row, mode) {
	row.mode = mode;
    }

    
    /**
     * Creates a blank row in edit mode at the end of the table
     */
    addRow() {
	let count = this.state.source[0].columns.length;
	let newColumns = Array.apply(null, Array(count))
			      .map(x => "");

	let newRow = {
	    key: Table.nextKey(),
	    isNewRow: true,
	    mode: RowMode.Edit,
	    columns: newColumns
	};
	
	let newTable = this.state.source
			    .slice()
			    .concat([newRow]);
	
	this.setState({
	    source: newTable,
	    addingNew: true
	});
    }

    
    /**
     * Removes a row from the table by key
     */
    removeRow(key) {
	this.setState({
	    source: this.state.source.filter(row => row.key !== key),
	    addingNew: false
	});
    }

    
    /**
     * Updates a row by key
     */
    updateRow(key, newRow) {
	let newTable = this.state.source.slice();
	
	for (let row of newTable) {
	    if (row.key === key) {
		row.isNewRow = false;
		row.columns = newRow.slice();
		break;
	    }
	}

	this.setState({
	    source: newTable,
	    addingNew: false
	});

	this.updateParent(newTable);
    }

    
    render() {
	debugger;
	let headers = this.props.headers
			  .map(col => (<th>{ col }</th>))
			  .concat([<th />, <th />]);	

	let rows = this.state.source.map((row, i) => {
	    return (<EditableRow source={ row }
				 updateRow={ this.updateRow.bind(this, row.key) }
				 removeRow={ this.removeRow.bind(this, row.key) }
				 setMode={ this.setMode.bind(this, row) }
		    />)
	});
	
	return (
	    <div>
		<button onClick={ this.addRow.bind(this) }
			disabled={ this.state.addingNew }>
		    Add New
		</button>

		<table>
		    <thead>
			<tr>{ headers }</tr>
		    </thead>

		    <tbody>
			{ rows }
		    </tbody>
		</table>
	    </div>
	);
    }
}

Table.lastKey = 0;

Table.nextKey = function () {
    let key = Table.lastKey.toString(16);
    Table.lastKey++;
    return key;
}
