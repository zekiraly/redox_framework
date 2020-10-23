import React from 'react';
import EnhancedTable from "../table/EnhancedTable";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import LinearProgressWithLabel from "../common/LinearProgressWithLabel";
import {withRouter} from "react-router-dom";

const headCells = [
    { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { id: 'description', numeric: false, disablePadding: false, label: 'Description' },
    { id: 'files', numeric: false, disablePadding: false, label: 'Number of files' }
];

function RowComponent(props) {
    const {row, history} = props;
    return (
        <TableRow
            hover
            tabIndex={-1}
            key={row.name}
            onClick={() => history.push(`/dataset/${row.dataset_id}`)}
        >
            <TableCell component="th" scope="row" padding="none">
                {row.name}
            </TableCell>
            <TableCell align="left">{row.description}</TableCell>
            <TableCell align="left">0</TableCell>
        </TableRow>
    )
}

RowComponent = withRouter(RowComponent);

export function DatasetTable(props) {
    const {datasets} = props;

    return <EnhancedTable
        headCells={headCells}
        RowComponent={RowComponent}
        rows={datasets.toJS()}
    />
}