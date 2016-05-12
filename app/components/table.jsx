import React from "react";
import { RowMode } from "components/table-common";
import EditableRow from "components/editable-row";
import { randomKey } from "utils";

/**
 * An editable table component
 */
export class Table extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    source: this.props.source.map(row => ({
		key: randomKey(),
		columns: row
	    })),
	    
	    addingNew: false
	};
    }

    
    /**
     * 
     */
    saveRows() {
	this.props.saveRows(this.state.source.map(row => row.columns));
    }

    
    /**
     * Creates a blank row and puts it in edit mode
     */
    addNew() {
	let count = this.state.source[0].columns.length;
	let newColumns = Array.apply(null, Array(count))
			      .map(x => "");

	let newRow = {
	    key: null,
	    mode: RowMode.Edit,
	    columns: newColumns
	};
	
	let newSource = this.state.source
			    .slice()
			    .concat([newRow]);
	
	this.setState({
	    source: newSource,
	    addingNew: true
	});
    }

    /**
     * Removes the last row when cancelling a new row
     */
    removeLast() {
	this.setState({
	    source: this.state.source.slice(0, -1),
	    addingNew: false
	});
    }

    /**
     * Saves the new row to the data table
     */
    saveNew(newColumns) {
	let newRow = {
	    key: randomKey(),
	    columns: newColumns
	};
	
	let newSource = this.state.source
			    .slice(0, -1)
			    .concat([newRow]);

	this.setState({
	    source: newSource,
	    addingNew: false
	});
	this.saveRows();
    }

    render() {
	let headers = this.props.headers
			  .map(col => (<th>{ col }</th>))
			  .concat([<th />]);

	let rows = this.state.source.map(row =>
	    (<EditableRow source={ row }
		       removeLast={ this.removeLast.bind(this) }
		       saveNew={ this.saveNew.bind(this) }
	     />));
	
	return (
	    <div>
		<table>
		    <thead>
			<tr>{ headers }</tr>
		    </thead>

		    <tbody>
			{ rows }
		    </tbody>
		</table>

		<button onClick={ this.addNew.bind(this) } disabled={ this.state.addingNew }>Add New</button>
	    </div>
	);
    }
}
