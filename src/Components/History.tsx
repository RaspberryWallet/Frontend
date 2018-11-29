import {Typography, withStyles} from "@material-ui/core";
import * as React from 'react';
import {Component} from "react";

const styles = {

};

interface IHistoryProps {
    transactions: Transaction[];
}

class History extends Component<IHistoryProps, {}> {
    public render() {
        const {transactions} = this.props;
        return (
            <div>
                {transactions.map((transaction: Transaction) =>
                    <Typography variant="headline" component="h2" key={transaction.txHash}>
                        {transaction.txHash}
                    </Typography>
                )}
            </div>
        )
    }
}

export default withStyles(styles)(History)