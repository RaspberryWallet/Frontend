import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

class App extends Component {


    state = {
        response : null
    };

    componentDidMount() {
        axios.get(`/ping`)
            .then(res => {
                const response = res.data;
                this.setState({ response });
            })
    }

    render() {
        const { response } = this.state;

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to RaspberryWallet</h1>
                </header>

                <p className="App-intro">
                    RaspberryWallet
                </p>
                {response && <p>
                    Response from server: {response}
                </p>
                }

            </div>
        );
    }
}

export default App;
