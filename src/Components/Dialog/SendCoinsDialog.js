import {Component, Fragment} from "react";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import TextField from "@material-ui/core/TextField/TextField";
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


class SendCoinsDialog extends Component {
    state = {
        amount: null,
        recipient: null
    };

    sendCoins = async () => {
        let {amount, recipient} = this.state;
        console.log(`sending ${amount} BTBC to ${recipient}`);

        const response = await fetch(`${serverUrl}/api/sendCoins`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify({amount, recipient})
        });
    };

    render() {
        let {onClose, open} = this.props;
        return (
            <Dialog
                open={open}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Send Coins</DialogTitle>
                <DialogContent>

                    <TextField
                        onChange={event => {
                            const amount = event.target.value;
                            this.setState({amount})
                        }}
                        autoFocus
                        type="number"
                        margin="dense"
                        id="amount"
                        label="Amount in BTC"
                    />

                    <TextField
                        onChange={event => {
                            const recipient = event.target.value;
                            this.setState({recipient})
                        }}
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
                            onClick={() => {
                                this.sendCoins();
                                onClose();
                            }}>
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(SendCoinsDialog)