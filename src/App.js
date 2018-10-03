import React, {Component, Fragment} from 'react';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom'
import Modules from './Components/Modules'
import NotFound from './Components/Errors/NotFound'
import Layout from './Components/Layout'
import Home from './Components/Home'
import {serverUrl} from './config'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {blue,yellow, indigo} from '@material-ui/core/colors';

const theme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: yellow,
        type: 'dark',
    }
});

class App extends Component {

    state = {
        modules: null,
    };

    componentDidMount() {
        this.fetchModules();
    }

    async fetchModules() {
        console.log(`fetching modules`);
        const response = await fetch(serverUrl + '/api/modules');
        const modules = await response.json();
        this.setState({modules});
    }


    render() {
        const {modules} = this.state;

        return (
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>
                    <Layout modules={modules}>

                        <Switch>
                            <Route exact path="/" render={props => <Home {...props} modules={modules}/>}/>
                            <Route path="/modules" render={
                                props => <Modules {...props} modules={modules}/>
                            }/>
                            <Route component={NotFound}/>
                        </Switch>

                    </Layout>
                </MuiThemeProvider>
            </BrowserRouter>
        );
    }
}

export default App;
