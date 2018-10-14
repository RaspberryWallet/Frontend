import React, {Component, Fragment} from 'react'
import {serverUrl} from '../config'
import {Typography, Button} from "@material-ui/core";
import {withStyles} from '@material-ui/core/styles';
import RestoreDialog from './Dialog/RestoreDialog'
import SendCoinsDialog from './Dialog/SendCoinsDialog'

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

class App extends Component {

    state = {
        currentAddress: null,
        estimatedBalance: null,
        availableBalance: null,
        cpuTemp: null,
        isLocked: true,
        openRestoreDialog: false,
        openSendDialog: false,
    };

    componentDidMount() {
        this.fetchPing();
        if (!this.state.isLocked) {
            this.fetchCurrentAddress();
            this.fetchEstimatedBalance();
            this.fetchAvailableBalance();
        }
        //this.fetchCpuTemp();
    }

    async fetchPing() {
        console.log(`fetching pings`);
        const response = await fetch(serverUrl + '/api/ping');
        const ping = await response.json();
        console.log(`fetched ping ${JSON.stringify(ping)}`);
    }

    async fetchCurrentAddress() {
        console.log(`fetching current address`);
        const response = await fetch(serverUrl + '/api/currentAddress');
        let currentAddress = await response.json();
        currentAddress = currentAddress.currentAddress;
        console.log(`currentAddress ${JSON.stringify(currentAddress)}`);
        this.setState({currentAddress})
    }

    async fetchFreshAddress() {
        console.log(`fetching fresh address`);
        const response = await fetch(serverUrl + '/api/freshAddress');
        let currentAddress = await response.json();
        currentAddress = currentAddress.freshAddress;
        console.log(`currentAddress ${JSON.stringify(currentAddress)}`);
        this.setState({currentAddress})
    }


    async fetchEstimatedBalance() {
        console.log(`fetching estimated balance`);
        const response = await fetch(serverUrl + '/api/estimatedBalance');
        let estimatedBalance = await response.json();
        estimatedBalance = estimatedBalance.estimatedBalance;
        console.log(`estimatedBalance ${JSON.stringify(estimatedBalance)}`);
        this.setState({estimatedBalance})
    }

    async fetchAvailableBalance() {
        console.log(`fetching available balance`);
        const response = await fetch(serverUrl + '/api/availableBalance');
        let availableBalance = await response.json();
        availableBalance = availableBalance.availableBalance;
        console.log(`available balance ${JSON.stringify(availableBalance)}`);
        this.setState({availableBalance})
    }

    async fetchCpuTemp() {
        console.log(`fetching cpu temp`);
        const response = await fetch(serverUrl + '/api/cpuTemp');
        let cpuTemp = await response.json();
        cpuTemp = cpuTemp.cpuTemp;
        console.log(`available balance ${JSON.stringify(cpuTemp)}`);
        this.setState({cpuTemp})
    }

    async fetchIsLocked() {
        console.log(`fetching is locked`);
        const response = await fetch(serverUrl + '/api/isLocked');
        let isLocked = await response.json();
        isLocked = isLocked.isLocked;
        console.log(`islocked ${JSON.stringify(isLocked)}`);
        this.setState({isLocked})
    }

    async unlockWallet() {
        console.log(`fetching unlockWallet`);
        const response = await fetch(serverUrl + '/api/unlockWallet');
        let responseText = await response.text();
        console.log(`unlockWallet ${responseText}`);
    }


    handleClickRestore = () => {
        this.setState({openRestoreDialog: true});
    };
    handleCloseRestoreDialog = () => {
        this.setState({openRestoreDialog: false});
    };
    handleClickSend = () => {
        this.setState({openSendDialog: true});
    };
    handleCloseSendDialog = () => {
        this.setState({openSendDialog: false});
    };

    render() {
        console.log("render");
        const {modules, classes} = this.props;

        const {isLocked, currentAddress, estimatedBalance, availableBalance, cpuTemp} = this.state;

        return (
            <Fragment>

                <Typography variant="headline" component="h2">
                    {`Receive Address: ${currentAddress}`}
                </Typography>
                {!isLocked &&
                <Button size="small" onClick={() => {
                    this.fetchFreshAddress()
                }}>Refresh Address</Button>
                }

                <Typography variant="headline" component="h2">
                    {`Balance: ${availableBalance}(${estimatedBalance})`}
                </Typography>
                {!isLocked &&
                <Button size="small" onClick={() => {
                    this.fetchEstimatedBalance();
                    this.fetchAvailableBalance();
                }}>Refresh Balances</Button>
                }

                {cpuTemp && <Typography variant="headline" component="h2">
                    {cpuTemp}
                </Typography>}

                <Button size="small" onClick={this.unlockWallet}>Unlock Wallet</Button>
                <Button size="small" onClick={() => this.fetchIsLocked()}>Refresh Status</Button>

                {!isLocked &&
                <Button size="small" onClick={this.handleClickRestore}>Init/Restore</Button>
                }

                <Button size="small" onClick={this.handleClickSend}>Send</Button>

                {!isLocked &&
                <RestoreDialog
                    open={this.state.openRestoreDialog}
                    onClose={this.handleCloseRestoreDialog}
                    modules={modules}
                    aria-labelledby="form-dialog-title"/>
                }
                {!isLocked &&
                <SendCoinsDialog
                    open={this.state.openSendDialog}
                    onClose={this.handleCloseSendDialog}
                />
                }

            </Fragment>
        )
    }

}

export default withStyles(styles)(App)