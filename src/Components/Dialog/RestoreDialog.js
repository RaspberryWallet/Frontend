import {Component, Fragment} from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import TextField from "@material-ui/core/TextField/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import {Button, withStyles} from "@material-ui/core";
import React from "react";
import {serverUrl} from "../../config";

const styles = {
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    pos: {
        marginBottom: 12,
    },
};


class RestoreDialog extends Component {

    constructor(props) {
        super(props);
        this.moduleInputs = [];
    }

    state = {
        moduleSelectionState: new Map(),
        mnemonicWords: "",
        required: ""
    };

    handleSelectedModuleChange = moduleId => event => {
        const checked = event.target.checked;
        this.setState(state => {
            state.moduleSelectionState.set(moduleId, checked)
        });
    };

    async sendRestore() {
        console.log(`sending restore`);


        let {mnemonicWords, moduleSelectionState, required} = this.state;
        let modules = {};

        moduleSelectionState.forEach((isSelected, moduleId) => {
            console.log(isSelected + " " + moduleId);
            let inputs = {};
            this.moduleInputs[moduleId].childNodes
                .forEach((node) => inputs[node.name] = node.value);

            if (isSelected)
                modules[moduleId] = inputs;
        });

        console.log(JSON.stringify({mnemonicWords: mnemonicWords.split(" "), modules, required}));
        const response = await fetch(`${serverUrl}/api/restoreFromBackupPhrase`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({mnemonicWords: mnemonicWords.split(" "), modules, required})
        });
        if (response.ok) {
            console.log(`sending restore`);
        } else {
            console.error(response.error());
        }
    }


    render() {
        let {open, onClose, modules} = this.props;
        return (
            <Dialog
                open={open}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Init/Restore</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send
                        updates occasionally.
                    </DialogContentText>
                    <TextField
                        onChange={event => {
                            const mnemonicWords = event.target.value;
                            this.setState({mnemonicWords})
                        }}
                        multiline
                        autoFocus
                        margin="dense"
                        id="name"
                        label="12 Mnemonic words"
                        fullWidth
                    />
                    {modules && modules.map(module => {
                        return <Fragment key={module.id}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.moduleSelectionState.get(module.id)}
                                        onChange={this.handleSelectedModuleChange(module.id)}
                                        value={module.id}
                                    />
                                }
                                label={module.name}
                            />
                            <form>
                                <div ref={element => this.moduleInputs[module.id] = element}
                                     dangerouslySetInnerHTML={{__html: module.htmlUi}}/>
                            </form>
                        </Fragment>
                    })}
                    <TextField
                        id="standard-number"
                        label="no. modules required"
                        value={this.state.required}
                        onChange={event => {
                            const required = event.target.value;
                            this.setState({required})
                        }}
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => {
                        this.sendRestore();
                        onClose();
                    }} color="primary">
                        Restore
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(RestoreDialog)