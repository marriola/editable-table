import React from 'react';
import { padStart, randomKey } from "utils";
import { Table } from "components/table";

export default class App extends React.Component {
    constructor(props) {
	super(props);

	this.state = {
	    headers: ["ID", "First", "Second"],
	    
	    table: [
		["02", "Hello", "World"],
		["11", "Foo", "Bar"]
	    ],

	    newTable: []
	};

	this.state.newTable = this.state.table.slice();
    }
    
    dumpTable() {
	console.table(this.state.newTable);
    }

    saveRows(newTable) {
	this.setState({ newTable });
    }
    
    render() {
	return (
	    <div id="content">
		<button onClick={ this.dumpTable.bind(this) }>
		    Dump Table
		</button>

		<Table source={ this.state.table }
		       headers={ this.state.headers }
		       saveRows={ this.saveRows.bind(this) }
		/>
	    </div>
	);
    }
}
