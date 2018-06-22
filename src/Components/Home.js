import React, {Component, Fragment} from 'react'

export default class extends Component {
    state = {
        ping: null
    };


    componentDidMount() {
        this.fetchPing();
    }

    async fetchPing() {
        console.log(`fetching pings`);
        const response = await fetch('http://localhost:9090/ping');
        const ping = await response.json();
        console.log(`fetched ping ${JSON.stringify(ping)}`);
        this.setState({
            ping
        });
    }

    render() {

        const {ping} = this.state;

        return (
            <Fragment>
                {ping && <p>
                    Response from server: {ping.ping}
                </p>}
            </Fragment>
        )
    }
}
