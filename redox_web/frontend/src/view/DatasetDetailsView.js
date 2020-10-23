import React from 'react'
import PaperSection from "../component/common/PaperSection";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {isLoaded} from "../reducer/loader";
import {doAddFileToDataset, doDeleteFileFromDataset, doUpdateDatasetDetails} from "../action/dataset";
import LinearProgressWithLabel from "../component/common/LinearProgressWithLabel";
import {getCookie} from "../util/request";
import axios from "axios";

function DatasetDetailsView(props) {
    const {dataset, files, loaded} = props;
    const [selectedFile, setSelectedFile] = React.useState(null);
    const [uploadStarted, setUploadStarted] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const {onFileUploaded, onDeleteFile} = props;

    const onFileChange = event => {
        setSelectedFile(event.target.files[0]);
    }

    const onFileUpload = () => {
        const formData = new FormData();
        formData.append(
            "file",
            selectedFile,
            selectedFile.name
        );
        let csrftoken = getCookie('csrftoken');
        let config = {
            headers: {
                "X-CSRFToken": csrftoken
            },
            onUploadProgress: function(progressEvent) {
                let progress = progressEvent.loaded / progressEvent.total
                setProgress(progress)
            }
        }
        setUploadStarted(true);
        axios.post(`/api/dataset/${dataset.get('dataset_id')}/upload`, formData, config).then(response => {
            onFileUploaded(response.data)
        });
    }

    React.useEffect(() => {
        props.update();
    }, [])

    if (!loaded) {
        return <div></div>;
    }

    return <PaperSection title={"Dataset details"}>
        <div style={{width:'100%'}}>
            <div>Name: {dataset && dataset.get('name')}</div>
            <div>Description: {dataset && dataset.get('description')}</div>
            <div>Files</div>
            <input type="file" onChange={onFileChange}/>
            <button onClick={onFileUpload}>Upload</button>
            <LinearProgressWithLabel value={progress * 100}/>
            {files.map(f => <div key={f.get('upload_id')}>{f.get('file_name')} <button onClick={() => onDeleteFile(f.get('upload_id'))}>Delete</button></div>)}
        </div>
    </PaperSection>
}

function mapStateToProps(state, props) {
    return {
        loaded: isLoaded(state, 'dataset_details'),
        dataset: state.dataset.details.get('dataset'),
        files: state.dataset.details.get('uploads')
    }
}

function mapDispatchToProps(dispatch, props) {
    return {
        update: () => {
            let dataset_id = props.match.params['dataset_id'];
            dispatch(doUpdateDatasetDetails(dataset_id))
        },
        onFileUploaded: (file) => {
            dispatch(doAddFileToDataset(file))
        },
        onDeleteFile: (upload_id) => {
            dispatch(doDeleteFileFromDataset(upload_id))
        }
    }
}

DatasetDetailsView = withRouter(DatasetDetailsView);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DatasetDetailsView);