import React from 'react';
import EnhancedTable from "../table/EnhancedTable";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import LinearProgressWithLabel from "../common/LinearProgressWithLabel";

const activeHeadCells = [
    { id: 'name', disablePadding: true, label: 'Name' },
    { id: 'model', disablePadding: false, label: 'Model' },
    { id: 'creation_time', disablePadding: false, label: 'Created' },
    { id: 'start_time', disablePadding: false, label: 'Started' },
    { id: 'progress', disablePadding: false, label: 'Progress' },
    { id: 'loss', disablePadding: false, label: 'Loss (RMSE)' },
    { id: 'status', disablePadding: false, label: 'Status' },
];

const finishedHeadCells = [
    { id: 'name', disablePadding: true, label: 'Name' },
    { id: 'model', disablePadding: false, label: 'Model' },
    { id: 'creation_time', disablePadding: false, label: 'Created' },
    { id: 'end_time', disablePadding: false, label: 'Ended' },
    { id: 'loss',  disablePadding: false, label: 'Loss (RMSE)'},
    { id: 'status', disablePadding: false, label: 'Status' },
];

function ActiveRowComponent(props) {
    const {row} = props;
    return (
        <TableRow
            hover
            tabIndex={-1}
            key={row.name}
        >
            <TableCell component="th" scope="row" padding="none">
                {row.name}
            </TableCell>
            <TableCell align="left">{row.model}</TableCell>
            <TableCell align="left">{row.creation_time}</TableCell>
            <TableCell align="left">{row.start_time}</TableCell>
            <TableCell align="left"><LinearProgressWithLabel value={100 * row.progress}/></TableCell>
            <TableCell align="left">{row.loss}</TableCell>
            <TableCell align="left">{row.status}</TableCell>
        </TableRow>
    )
}

function FinishedRowComponent(props) {
    const {row} = props;
    return (
        <TableRow
            hover
            tabIndex={-1}
            key={row.name}
        >
            <TableCell component="th" scope="row" padding="none">
                {row.name}
            </TableCell>
            <TableCell align="left">{row.model}</TableCell>
            <TableCell align="left">{row.creation_time}</TableCell>
            <TableCell align="left">{row.end_time}</TableCell>
            <TableCell align="left">{row.loss}</TableCell>
            <TableCell align="left">{row.status}</TableCell>
        </TableRow>
    )
}

export function ActiveTrainingTable(props) {
    const {trainings} = props;

    return <EnhancedTable
        headCells={activeHeadCells}
        RowComponent={ActiveRowComponent}
        rows={trainings.toJS()}
    />
}

export function FinishedTrainingTable(props) {
    const {trainings} = props;

    return <EnhancedTable
        headCells={finishedHeadCells}
        RowComponent={FinishedRowComponent}
        rows={trainings.toJS()}
    />
}