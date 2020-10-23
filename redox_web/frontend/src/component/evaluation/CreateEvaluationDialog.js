import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CreateEvaluationForm from "./CreateEvaluationForm";

export default function CreateEvaluationDialog(props){
    const {onClose} = props;
    return <Dialog open={true} onClose={onClose} maxWidth={"sm"} fullWidth >
        <DialogTitle>
            New Evaluation
        </DialogTitle>
        <DialogContent>
            <CreateEvaluationForm/>
        </DialogContent>
    </Dialog>
}