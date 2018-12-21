import {Button, WithStyles, withStyles} from "@material-ui/core";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel/FormControlLabel";
import TextField from "@material-ui/core/TextField/TextField";
import {ChangeEvent, Component, Fragment} from "react";
import * as React from "react";
import {serverHttpUrl} from "../../config";
import Module from "../../Models/Module";

const styles = {
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    card: {
        minWidth: 275,
    },
    pos: {
        marginBottom: 12,
    },
};

interface IRestoreDialogProps extends WithStyles<typeof styles> {
    open: boolean;
    onClose: any;
    modules: Module[]
}

interface IRestoreDialogState {
    moduleSelectionState: Map<string, boolean>;
    mnemonicWords: string;
    required: string;
}

class RestoreDialog extends Component<IRestoreDialogProps, IRestoreDialogState> {

    public moduleInputs = [];

    public state: IRestoreDialogState = {
        mnemonicWords: "",
        moduleSelectionState: new Map<string, boolean>(),
        required: "",
    };


    public render() {
        const {open, onClose, modules} = this.props;
        return (
            <Dialog
                open={open}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Init/Restore</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter 12 mnemonic words to restore your wallet
                    </DialogContentText>
                    <TextField
                        onChange={this.onMnemonicWordsChange}
                        multiline={true}
                        autoFocus={true}
                        margin="dense"
                        id="name"
                        label="12 Mnemonic words"
                        fullWidth={true}
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
                        onChange={this.onModulesNumberRequiredChange}
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
                    <Button onClick={this.onRestoreClick} color="primary">
                        Restore
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    private onMnemonicWordsChange =
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const mnemonicWords = event.target.value;
            this.setState({mnemonicWords})
        };
    private onModulesNumberRequiredChange =
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const required = event.target.value;
            this.setState({required})
        };

    private handleSelectedModuleChange = (moduleId: string) =>
        (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | any>) => {
            const checked = event.target.checked;
            this.setState(state => {
                state.moduleSelectionState.set(moduleId, checked)
            });
        };

    private onRestoreClick = () => {
        this.sendRestore();
        this.props.onClose();
    };

    private async sendRestore() {
        console.log(`sending restore`);

        const {mnemonicWords, moduleSelectionState, required} = this.state;
        const modules = {};

        moduleSelectionState.forEach((isSelected: boolean, moduleId: string) => {
            console.log(isSelected + " " + moduleId);
            const inputs = {};
            const theModuleInputs = this.moduleInputs[moduleId];
            if (theModuleInputs) {
                theModuleInputs.childNodes
                    .forEach((node: any) => inputs[node.name] = node.value);
            }

            if (isSelected) {
                modules[moduleId] = inputs;
            }
        });

        console.log(JSON.stringify({mnemonicWords: mnemonicWords.split(" "), modules, required}));
        const response = await fetch(`${serverHttpUrl}/api/restoreFromBackupPhrase`, {
            body: JSON.stringify({mnemonicWords: mnemonicWords.split(" "), modules, required}),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            method: 'POST',
        });
        if (response.ok) {
            console.log(`sending restore`);
        } else {
            console.error("Failed");
        }
    }
}

export default withStyles(styles)(RestoreDialog)