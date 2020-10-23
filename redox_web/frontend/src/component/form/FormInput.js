import React from 'react';
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Select from "@material-ui/core/Select";

const LabelComponentProps = {
    shrink: true,
}

export function RenderTextField(props) {
    const {label, input, meta: {touched, invalid, error}, ...custom} = props;

    return <TextField
        autoComplete="off"
        fullWidth
        margin={"dense"}
        variant={"outlined"}
        label={label}
        placeholder={label}
        error={touched && invalid}
        helperText={touched && error}
        InputLabelProps={LabelComponentProps}
        {...input}
        {...custom}
    />
}

export function RenderBooleanField(props) {
    const {label, input, meta: {touched, invalid, error}, ...custom} = props;
    return  <div style={{width: '100%'}}>
        <FormControlLabel
            control={
                <Switch
                    checked={!!input.value}
                    onChange={input.onChange}
                    color="primary"
                />
            }
            label={label}
        />
    </div>
}

export default function RenderFormInput(props){
    if (props.type === 'boolean') {
        return <RenderBooleanField {...props}/>
    } else {
        return <RenderTextField {...props}/>
    }

}

const useModelInputStyles = makeStyles({
    container: {
        '& > *': {
            margin: 5,
        },
    },
    activeModel: {
        backgroundColor: ''
    }
});

export function RenderButtonInput(props){
    const {label, input, meta: {touched, invalid, error}, ...custom} = props;
    const {options, input: {value, onChange}} = props;
    const classes = useModelInputStyles();

    return (<div className={classes.container}>
        {Object.entries(options).map(([code, opt]) => {
            const selected = value === code;
            return <Button
                key={`model_${code}`}
                variant={"contained"}
                color={selected ? "primary" : undefined}
                onClick={() => onChange(code)}
            >
                {opt.name}
            </Button>
        })}
    </div>)
}

export function RenderGroupSelectInput(props) {
    const {label, input, meta: {touched, invalid, error}, ...custom} = props;
    const {groups, input: {value, onChange}} = props;
    const classes = useModelInputStyles();

    return <Select native defaultValue="" id="grouped-native-select" onChange={input.onChange}>
        <option aria-label="None" value="" />
        {groups.map((group, idx) =>
            <optgroup key={`optgroup_${idx}`} label={group.label}>
                {group.items.map((item =>
                    <option key={item.value} value={item.value}>{item.label}</option>
                ))}
            </optgroup>
        )}
    </Select>
}

export function RenderSelectInput(props) {
    const {label, input, meta: {touched, invalid, error}, ...custom} = props;
    const {options, input: {value, onChange}} = props;
    const classes = useModelInputStyles();

    return <Select native defaultValue="" id="grouped-native-select" onChange={input.onChange}>
        <option aria-label="None" value="" />
        {options.map((item, idx) =>
            <option key={item.value} value={item.value}>{item.label}</option>
        )}
    </Select>
}