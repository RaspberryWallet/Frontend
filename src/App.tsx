import {indigo, yellow} from '@material-ui/core/colors';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
// @ts-ignore
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './Components/Errors/NotFound'
import Home from './Components/Home'
import Initialization from "./Components/Initialization/Initialization";
import Layout from './Components/Layout/index'
import Modules from './Components/Modules/index'
import {serverUrl} from './config'
import Module from './Models/Module'

const theme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: yellow,
        type: 'dark',
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

                {!modules && <a>Loading...</a>}
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
        const modules = await response.json();
        this.setState({modules});
    }
}

export default App;
