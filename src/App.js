import React, {Component, Fragment} from 'react';
import {BrowserRouter, Link, Route, Switch} from 'react-router-dom'
import Modules from './Components/Modules'
import NotFound from './Components/Errors/404'
import Layout from './Components/Layout'
import Home from './Components/Home'

class App extends Component {

    state = {
        modules: null,
    };

    componentDidMount() {
        this.fetchModules();
    }

    async fetchModules() {
        console.log(`fetching modules`);
        const response = await fetch('http://localhost:9090/modules');
        const modules = await response.json();
        console.log(`fetched modules ${JSON.stringify(modules)}`);
        this.setState({modules});
    }



    render() {
        const {modules} = this.state;

        return (
            <BrowserRouter>

                <Layout modules={modules} >

                    <Switch>
                        <Route exact path="/" render={props => <Home {...props}/>}/>
                        <Route path="/modules" render={
                            props => <Modules {...props} modules={modules}/>
                        }/>
                        <Route component={NotFound}/>
                    </Switch>

                </Layout>
            </BrowserRouter>
        );
    }
}

export default App;
