import React from 'react';
import EnhancedTable from "../table/EnhancedTable";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import LinearProgressWithLabel from "../common/LinearProgressWithLabel";
import IconButton from "@material-ui/core/IconButton";
import DownloadIcon from '@material-ui/icons/CloudDownload';
import {Link} from "react-router-dom";

const activeHeadCells = [
    { id: 'name', disablePadding: true, label: 'Name' },
    { id: 'model', disablePadding: false, label: 'Model' },
    { id: 'creation_time', disablePadding: false, label: 'Created' },
    { id: 'status', disablePadding: false, label: 'Status' },
];

const finishedHeadCells = [
    { id: 'name', disablePadding: true, label: 'Name' },
    { id: 'model', disablePadding: false, label: 'Model' },
    { id: 'creation_time', disablePadding: false, label: 'Created' },
    { id: 'status', disablePadding: false, label: 'Status' },
    { id: 'prediction', disablePadding: false, label: 'Prediction' },
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
            <TableCell align="left">{row.status}</TableCell>
            <TableCell align="left">
                {
                    row.status === 'FINISHED' ? <IconButton aria-label="delete">
                        <Link to={`/api/evaluation/${row.task_id}/download`} target="_blank" download>
                            <DownloadIcon/>
                        </Link>
                    </IconButton> : "-"
                }
            </TableCell>
        </TableRow>
    )
}

export function ActiveEvaluationTable(props) {
    const {evaluations} = props;

    return <EnhancedTable
        headCells={activeHeadCells}
        RowComponent={ActiveRowComponent}
        rows={evaluations.toJS()}
    />
}

export function FinishedEvaluationTable(props) {
    const {evaluations} = props;

    return <EnhancedTable
        headCells={finishedHeadCells}
        RowComponent={FinishedRowComponent}
        rows={evaluations.toJS()}
    />
}