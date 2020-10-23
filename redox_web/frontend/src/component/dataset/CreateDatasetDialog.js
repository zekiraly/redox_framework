import React from 'react';
import CreateDatasetForm from "./CreateDatasetForm";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import formValueSelector from "redux-form/lib/immutable/formValueSelector";
import {connect} from "react-redux";
import {reduxForm} from "redux-form/lib/immutable";

export default function CreateDatasetDialog(props) {
    const {onClose} = props;
    return <Dialog open={true} onClose={onClose} maxWidth={"sm"} fullWidth >
        <DialogTitle>
            New dataset
        </DialogTitle>
        <DialogContent>
            <CreateDatasetForm onCancel={onClose}/>
        </DialogContent>
    </Dialog>
}

