import React from 'react';
import Dialog from "@material-ui/core/Dialog";
import CreateTrainingForm from "./CreateTrainingForm";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";

export default function CreateTrainingDialog(props){
    const {onClose} = props;
    return <Dialog open={true} onClose={onClose} maxWidth={"sm"} fullWidth >
        <DialogTitle>
            New Training
        </DialogTitle>
        <DialogContent>
            <CreateTrainingForm/>
        </DialogContent>
    </Dialog>
}