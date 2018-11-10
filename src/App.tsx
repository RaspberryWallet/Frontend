import {orange, pink} from "@material-ui/core/es/colors";
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
// @ts-ignore
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import handleError from "./Components/Errors/HandleError";
import NotFound from './Components/Errors/NotFound'
import Home from './Components/Home'
import Initialization from "./Components/Initialization/Initialization";
import Layout from './Components/Layout/index'
import Modules from './Components/Modules/index'
import {serverUrl} from './config'
import logo from './logo.png'
import Module from './Models/Module'

const theme = createMuiTheme({
    palette: {
        primary: orange,
        secondary: pink,
    }
});


interface IAppState {
    modules: Module[] | null;
}

class App extends React.Component<{}, IAppState> {
    public state: IAppState = {
        modules: null,
    };

    public componentDidMount() {
        this.fetchModules();
    }

    public render() {
        const {modules} = this.state;

        return (
            <div>
                <ToastContainer/>

                {modules &&
                <BrowserRouter>
                    <MuiThemeProvider theme={theme}>

                        <Layout modules={modules}>

                            <Switch>
                                <Route exact={true} path="/" render={this.renderInitPath}/>
                                <Route exact={true} path="/home" render={this.renderHomePath}/>
                                <Route path="/modules" render={this.renderModulesPath}/>
                                <Route component={NotFound}/>
                            </Switch>

                        </Layout>
                    </MuiThemeProvider>
                </BrowserRouter>
                }

                {!modules &&
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h1 className="App-title">Loading...</h1>
                    </header>
                </div>
                }
            </div>
        );
    }

    private renderInitPath = (props: any) => {
        return <Initialization {...props} modules={this.state.modules}/>;
    };

    private renderHomePath = (props: any) => {
        return <Home {...props} modules={this.state.modules}/>;
    };

    private renderModulesPath = (props: any) => {
        return <Modules {...props} modules={this.state.modules}/>;
    };


    private async fetchModules() {
        console.log(`fetching modules`);
        const response = await fetch(serverUrl + '/api/modules');
        if (response.ok) {
            const modules = await response.json();
            this.setState({modules});
        } else {
            handleError(response)
        }
    }
}

export default App;
