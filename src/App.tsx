import {indigo, yellow} from '@material-ui/core/colors';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';
import * as React from 'react';
// @ts-ignore
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom'
import NotFound from './Components/Errors/NotFound'
import Home from './Components/Home'
import Layout from './Components/Layout'
import Modules from './Components/Modules/index'
import {serverUrl} from './config'

const theme = createMuiTheme({
    palette: {
        primary: indigo,
        secondary: yellow,
        type: 'dark',
    }
});

class App extends React.Component {

    private state = {
        modules: null,
    };

    public componentDidMount() {
        this.fetchModules();
    }


    public render() {
        const {modules} = this.state;

        return (
            <BrowserRouter>
                <MuiThemeProvider theme={theme}>
                    <Layout modules={modules}>

                        <Switch>
                            <Route exact={true} path="/" render={(props: any) => <Home {...props} modules={modules}/>}/>
                            <Route path="/modules" render={
                                (props: any) => <Modules {...props} modules={modules}/>
                            }/>
                            <Route component={NotFound}/>
                        </Switch>

                    </Layout>
                </MuiThemeProvider>
            </BrowserRouter>
        );
    }

    private async fetchModules() {
        console.log(`fetching modules`);
        const response = await fetch(serverUrl + '/api/modules');
        const modules = await response.json();
        this.setState({modules});
    }
}

export default App;
