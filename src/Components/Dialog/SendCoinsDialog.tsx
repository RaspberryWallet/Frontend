import {Button, WithStyles, withStyles} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import TextField from "@material-ui/core/TextField/TextField";
import {ChangeEvent, Component} from "react";
import * as React from "react";
import {serverUrl} from "../../config";

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

interface ISendCoinsDialogProps extends WithStyles<typeof styles> {
    onClose: any;
    open: boolean;
}

interface ISendCoinsDialogState {
    amount: string | null
    recipient: string | null
}

class SendCoinsDialog extends Component<ISendCoinsDialogProps, ISendCoinsDialogState> {
    public state = {
        amount: null,
        recipient: null
    };

    public render() {
        const {onClose, open} = this.props;
        return (
            <Dialog
                open={open}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Send Coins</DialogTitle>
                <DialogContent>

                    <TextField
                        onChange={this.onAmountChange}
                        autoFocus={true}
                        type="number"
                        margin="dense"
                        id="amount"
                        label="Amount in BTC"
                    />

                    <TextField
                        onChange={this.onRecipientChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        id="recipient"
                        label="recipient address in Base58"
                        margin="normal"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button color="primary"
                            onClick={this.onSendClick}>
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    private onAmountChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const amount = event.target.value;
        this.setState({amount})
    };

    private onRecipientChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const recipient = event.target.value;
        this.setState({recipient})
    };
    private onSendClick = () => {
        this.sendCoins();
        this.props.onClose();
    };

    private sendCoins = async () => {
        const {amount, recipient} = this.state;
        console.log(`sending ${amount} BTBC to ${recipient}`);

        const response = await fetch(`${serverUrl}/api/sendCoins`, {
            body: JSON.stringify({amount, recipient}),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            method: 'POST',
        });
        console.log(response);
    };

}

export default withStyles(styles)(SendCoinsDialog)