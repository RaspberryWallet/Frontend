import {indigo, yellow} from '@material-ui/core/colors';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
// @ts-ignore
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom'
import NotFound from './Components/Errors/NotFound'
import Home from './Components/Home'
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
    modules: Module[];
}

class App extends React.Component<{}, IAppState> {

    public componentDidMount() {
        this.fetchModules();
    }


    public render() {
        return (
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>

                    <Layout
                        modules={this.state.modules}>

                        <Switch>
                            <Route exact={true} path="/" render={this.renderRootPath}/>
                            <Route path="/modules" render={this.renderModulesPath}/>
                            <Route component={NotFound}/>
                        </Switch>

                    </Layout>
                </MuiThemeProvider>
            </BrowserRouter>
        );
    }

    private renderRootPath = (props: any) => {
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
