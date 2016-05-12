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
	    ]
	};

	this.newTable = this.state.table.slice();
    }
    
    dumpTable() {
	alert(JSON.stringify(this.newTable));
    }

    saveRows(rows) {
	this.newTable = rows;
    }
    
    render() {
	return (
	    <div id="content">
		<Table source={ this.state.table }
		       headers={ this.state.headers }
		       saveRows={ this.saveRows.bind(this) }
		/>
		
		<button onClick={ this.dumpTable.bind(this) }>
		    Dump Table
		</button>
	    </div>
	);
    }
}
