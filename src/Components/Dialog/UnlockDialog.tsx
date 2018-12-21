import {Button, WithStyles, withStyles} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import * as React from "react";
import {Component} from "react";
import {toast} from "react-toastify";
import Module from "../../Models/Module";
import ModuleView from "../Modules/ModuleView";
import Api from "../../Api";

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
    modules: Module[];
    walletStatus: () => void;
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
                <DialogTitle id="form-dialog-title">Unlock wallet</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Unlock your security modules
                    </DialogContentText>

                    {modules && modules.map(module => {
                        return <ModuleView key={module.id} innerRef={this.setInnerRef(module)}
                                           module={module}/>
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

    private setInnerRef = (module: Module) => (element: any) => {
        this.moduleInputs[module.id] = element
    };

    private onRestoreClick = () => {
        this.sendRestore();
        this.props.onClose();
    };

    private async sendRestore() {
        console.log(`sending restore`);

        const moduleToInputsMap: { [moduleId: string]: any } = {};

        this.props.modules.forEach((module: Module) => {
            const theModuleInputs = this.moduleInputs[module.id];
            moduleToInputsMap[module.id] = theModuleInputs.getUserInputs();
        });

        await Api.unlockWallet(moduleToInputsMap);
        toast.success("Successfully unlocked wallet");
        console.log(`sending restore`);
        this.props.walletStatus();
    }

}

export default withStyles(styles)(UnlockDialog)