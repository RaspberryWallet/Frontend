import {Button, WithStyles, withStyles} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import TextField from "@material-ui/core/TextField/TextField";
import {ChangeEvent, Component, Fragment} from "react";
import * as React from "react";
import {serverUrl} from "../../config";
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

class UnlockDialog extends Component<IRestoreDialogProps, {}> {

    public moduleInputs = [];


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
                            <TextField label={module.name}/>
                            <form>
                                <div ref={element => this.moduleInputs[module.id] = element}
                                     dangerouslySetInnerHTML={{__html: module.htmlUi}}/>
                            </form>
                        </Fragment>
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.onRestoreClick} color="primary">
                        Unlock
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

    private onRestoreClick = () => {
        this.sendRestore();
        this.props.onClose();
    };

    private async sendRestore() {
        console.log(`sending restore`);

        const moduleToInputsMap : {[moduleId : string] : any} = {};

        this.props.modules.forEach((module: Module) => {
            const inputs = {};
            const theModuleInputs = this.moduleInputs[module.id];
            if (theModuleInputs) {
                theModuleInputs.childNodes
                    .forEach((node: ChildNode) => inputs[node.nodeName] = node.nodeValue);
            }

            moduleToInputsMap.set(module.id, inputs);
        });

        console.log(JSON.stringify({moduleToInputsMap}));
        const response = await fetch(`${serverUrl}/api/unlockWallet`, {
            body: JSON.stringify({moduleToInputsMap}),
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

export default withStyles(styles)(UnlockDialog)