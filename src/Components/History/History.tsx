import {withStyles} from "@material-ui/core";
import List from "@material-ui/core/es/List/List";
import * as React from 'react';
import {Component} from "react";
import TransactionView from "./HistoryView";

const styles = {};

interface IHistoryProps {
    transactions: Transaction[];
}

class History extends Component<IHistoryProps, {}> {
    public render() {
        const {transactions} = this.props;
        return (
            <div>
                <List>
                    {transactions.map((transaction: Transaction) =>
                        <TransactionView transaction={transaction} key={transaction.txHash}/>
                    )}
                </List>
            </div>
        )
    }
}

export default withStyles(styles)(History)