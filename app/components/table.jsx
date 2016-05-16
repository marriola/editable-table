import React from "react";
import { RowMode } from "components/table-common";
import EditableRow from "components/editable-row";
import { randomKey } from "utils";

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
	    tableID: "etable-" + Table.nextKey(),
	    
	    source: this.props.source.map(row => ({
		key: Table.nextKey(),
		mode: RowMode.View,
		columns: row,
		newColumns: []
	    })),

	    addingNew: false
	};

	this.dragStart = this.dragStart.bind(this);
	this.dragLeave = this.dragLeave.bind(this);
	this.dragOver = this.dragOver.bind(this);
	this.dragEnd = this.dragEnd.bind(this);
	this.drop = this.drop.bind(this);
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
	let newSource = this.state.source.filter(row => row.key !== key);
	
	this.setState({
	    source: newSource,
	    addingNew: false
	});
	
	this.updateParent(newSource);
    }

    
    /**
     * Updates a row by key
     */
    updateRow(key, newColumns, mode=RowMode.View) {
	let i = this.state.source.findIndex(x => x.key === key);
	if (i == -1) {
	    return;
	}
	
	let newRow = {
	    key,
	    mode,
	    isNewRow: false,
	    columns: newColumns.slice()
	};

	let newTable = this.state.source.slice();
	newTable.splice(i, 1, newRow);

	this.setState({
	    source: newTable,
	    addingNew: false
	});

	this.updateParent(newTable);
    }

    
    moveRow(index, newIndex) {
	let newTable = this.state.source.slice();
	let row = newTable.splice(index, 1);
	newTable = newTable.slice(0, newIndex)
			   .concat([row])
			   .concat(newTable.slice(newIndex));

	this.setState({
	    source: newTable
	});

	this.updateParent(newTable);
    }


    ////////////////////////////////////////////////////////////////////////////    
    // Drag events
    ////////////////////////////////////////////////////////////////////////////    

    
    setDragEvents() {
	let i = 0;

	let table = document.querySelector(`#${this.state.tableID}`);
	table.removeEventListener("dragleave", this.dragLeave);
	table.addEventListener("dragleave", this.dragLeave);
	
	for (let row of Array.from(document.querySelectorAll(`#${this.state.tableID} tr`))) {
	    row.removeEventListener("dragstart", this.dragStart);
	    row.addEventListener("dragstart", this.dragStart);
	}
	
	for (let row of Array.from(document.querySelectorAll(`#${this.state.tableID} td`))) {
	    row.removeEventListener("dragover", this.dragOver);
	    row.removeEventListener("dragend", this.drop);
	    row.removeEventListener("drop", this.drop);

	    row.addEventListener("dragover", this.dragOver);
	    row.addEventListener("dragend", this.dragEnd);
	    row.addEventListener("drop", this.drop);

	    i++;
	}
    }
    

    dragStart(e) {
	let index = e.target.getAttribute("data-reactid").split(".").slice(-1)[0];
	e.dataTransfer.setData("text/plain", index);
    }

    
    dragOver(e) {
	let target = e.target;
	while (target.tagName.toLowerCase() !== "td") {
	    if (target.tagName.toLowerCase() === "body") {
		return;
	    }
	    target = target.parentElement;
	}
	
	e.preventDefault();

	let half = target.offsetHeight / 2;
	let cols = Array.from(target.parentElement.children);
	let top = e.offsetY < half;

	for (let col of this.lastcols || []) {
	    col.classList.remove("highlight-top", "highlight-bottom");
	}

	for (let col of cols) {
	    if (top) {
		col.classList.add("highlight-top");
	    } else {
		col.classList.add("highlight-bottom");
	    }
	}

	this.lastcols = cols;
    }


    dragLeave(e) {
	for (let col of this.lastcols || []) {
	    col.classList.remove("highlight-top", "highlight-bottom");
	}
    }

    
    dragEnd(e) {
	for (let col of this.lastcols || []) {
	    col.classList.remove("highlight-top", "highlight-bottom");
	}
    }


    drop(e) {
	for (let col of this.lastcols || []) {
	    col.classList.remove("highlight-top", "highlight-bottom");
	}

	let target = e.target;
	while (target.tagName.toLowerCase() !== "td") {
	    if (target.tagName.toLowerCase() === "body") {
		return;
	    }
	    target = target.parentElement;
	}

	let half = target.offsetHeight / 2;
	let top = e.offsetY < half;

	let source = parseInt(e.dataTransfer.getData("text/plain"));
	let index = parseInt(target.parentElement.getAttribute("data-reactid").split(".").slice(-1)[0]);
	
	if (!top)
	    index++;
	
	if (source < index)
	    index--;
	
	let newTable = this.state.source.slice();
	let row = newTable.splice(source, 1);
	newTable = newTable.slice(0, index)
			   .concat(row)
			   .concat(newTable.slice(index));

	this.setState({
	    source: newTable
	});

	this.updateParent(newTable);
    }


    componentDidUpdate() {
	this.setDragEvents();
    }


    componentDidMount() {
	this.setDragEvents();
    }
    
    render() {
	let headers = [<th />].concat(this.props.headers
					   .map(col => (<th>{ col }</th>))
					   .concat([<th />, <th />]));	

	let rows = this.state.source.map((row, i) => {
	    return (<EditableRow source={ row }
				 index={ i }
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

		<table id={ this.state.tableID }>
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

document.addEventListener("DOMContentLoaded", function() {
    let grab = document.querySelectorAll(".grab");
    if (grab) {
	Array.from(grab).forEach(g => g.addEventListener("click", e => { e.preventDefault() }));
    }
});
