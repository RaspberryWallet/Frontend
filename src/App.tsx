import {orange, pink} from "@material-ui/core/es/colors";
import {createMuiTheme, MuiThemeProvider, WithStyles, withStyles} from '@material-ui/core/styles';
import * as React from 'react';
// @ts-ignore
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from './Components/Errors/NotFound'
import Home from './Components/Home'
import Initialization from "./Components/Initialization/Initialization";
import Layout from './Components/Layout/index'
import Modules from './Components/Modules/index'
import logo from './logo.png'
import Module from './Models/Module'
import createStyles from "@material-ui/core/es/styles/createStyles";
import Api from "./Api";
import {serverWsUrl} from "./config";

const theme = createMuiTheme({
    palette: {
        primary: orange,
        secondary: pink,
    },
    typography: {
        useNextVariants: true,
    }
});
const styles = createStyles({
    App: {
        textAlign: "center",
    },
    AppLogo: {
        animation: 'AppLogoSpin infinite 15s linear',
        height: '40vmin'
    },
    AppHeader: {
        minHeight: '100vh',
        backgroundColor: '#282c34',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'calc(10px + 2vmin)',
        color: 'white',
    },
    AppLink: {
        color: "#61dafb"
    },
    "@keyframes AppLogoSpin": {
        from: {
            transform: 'rotate(0deg)'
        },
        to: {
            transform: 'rotate(360deg)'
        }
    }
});

interface IAppProps extends WithStyles<typeof styles> {

}

interface IAppState {
    modules: Module[] | null;
}

class App extends React.Component<IAppProps, IAppState> {
    public state: IAppState = {
        modules: null,
    };

    public successSocket: WebSocket;
    public errorSocket: WebSocket;
    public infoSocket: WebSocket;

    constructor(props: IAppProps) {
        super(props);
        this.successSocket = new WebSocket(serverWsUrl + "/success");
        this.errorSocket = new WebSocket(serverWsUrl + "/error");
        this.infoSocket = new WebSocket(serverWsUrl + "/info");
    }

    public componentDidMount() {
        this.fetchModules();
        this.successSocket.addEventListener('message', (event) => {
            toast.success(event.data)
        });
        this.infoSocket.addEventListener('message', (event) => {
            toast.info(event.data)
        });

        this.errorSocket.addEventListener('message', (event) => {
            toast.error(event.data)
        });
    }


    public componentWillUnmount(): void {
        this.successSocket.close();
        this.infoSocket.close();
        this.errorSocket.close();
    }

    public render() {
        const {classes} = this.props;
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
                <div className={classes.App}>
                    <header className={classes.AppHeader}>
                        <img src={logo} className={classes.AppLogo} alt="logo"/>
                        <h1>Loading...</h1>
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
        const modules: Module[] = await Api.fetchModules();
        this.setState({modules});
    }
}

export default withStyles(styles)(App);
