import {
    AppBar,
    CssBaseline,
    Drawer,
    Hidden,
    IconButton,
    MenuItem,
    MenuList, Theme,
    Toolbar,
    Typography, WithStyles
} from '@material-ui/core'
import {withStyles} from '@material-ui/core/styles';
import createStyles from "@material-ui/core/styles/createStyles";
import {Menu} from '@material-ui/icons'
import * as React from 'react'
import {Component, Fragment} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {compose} from 'recompose'
import Module from "../../Models/Module";

const drawerWidth = 240;
const styles = ({zIndex, breakpoints, spacing, palette, mixins}: Theme) => createStyles({
    appBar: {
        zIndex: zIndex.drawer + 1,
        position: 'fixed',
    },
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    navIconHide: {
        [breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        [breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    content: {
        flexGrow: 1,
        backgroundColor: palette.background.default,
        padding: spacing.unit * 3,
    },
    nested: {
        paddingLeft: spacing.unit * 4,
    },
});

interface ILayoutProps extends WithStyles<typeof styles> {
    location: any;
    children: any;
    modules: Module[];
}

interface ILayoutState {
    mobileOpen: boolean;
}

class Layout extends Component<ILayoutProps, ILayoutState> {

    public state: ILayoutState = {
        mobileOpen: false,
    };

    public render() {
        const {classes, location: {pathname}, children, modules} = this.props;

        const drawer = (
            <div>
                <Hidden smDown={true}>
                    <div className={classes.toolbar}/>
                </Hidden>
                <MenuList>
                    <MenuItem
                        key="home"
                        component={Link}
                        to="/"
                        selected={'/' === pathname}>
                        Home
                    </MenuItem>
                    <MenuItem
                        key="modules"
                        component={Link}
                        to="/modules"
                        selected={'/modules' === pathname}>
                        Modules
                    </MenuItem>

                    {modules && <MenuList className={classes.nested}>
                        {modules.map(({id, name}) =>
                            <MenuItem
                                key={id}
                                component={Link}
                                to={`/modules/${id}`}
                                selected={`/modules/${id}` === pathname}>
                                {name}
                            </MenuItem>)
                        }
                    </MenuList>}
                </MenuList>

            </div>
        );

        return (
            <Fragment>
                <CssBaseline/>
                <div className={classes.root}>
                    <AppBar className={classes.appBar}>
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={this.handleDrawerToggle}
                                className={classes.navIconHide}
                            >
                                <Menu/>
                            </IconButton>
                            <Typography variant="title" color="inherit" noWrap={true}>
                                Raspberry Wallet
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Hidden mdUp={true}>
                        <Drawer
                            variant="temporary"
                            open={this.state.mobileOpen}
                            onClose={this.handleDrawerToggle}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <Hidden smDown={true} implementation="css">
                        <Drawer
                            variant="permanent"
                            open={true}
                            classes={{
                                paper: classes.drawerPaper,
                            }}
                        >
                            {drawer}
                        </Drawer>
                    </Hidden>
                    <main className={classes.content}>
                        <div className={classes.toolbar}/>
                        {children}
                    </main>
                </div>
            </Fragment>
        )
    }

    private handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };
}

export default withRouter(Layout)