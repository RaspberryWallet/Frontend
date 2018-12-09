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
import {Menu} from '@material-ui/icons'
import * as React from 'react'
import {Component, Fragment} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {compose} from 'recompose'
import logo from '../../logo.png'

const drawerWidth = 240;
const styles = (theme) => ({
    appBar: {
        position: 'fixed',
        zIndex: theme.zIndex.drawer + 1,
    },
    content: {
        backgroundColor: theme.palette.background.default,
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    logo: {
        height: 40,
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    root: {
        display: 'flex',
        flexGrow: 1,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
        zIndex: 1,
    },

    toolbar: theme.mixins.toolbar,

});


class Layout extends Component {

    state = {
        mobileOpen: false,
    };

    render() {
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
                            <IconButton color="inherit">
                                <img className={classes.logo} width="inherit" height="inherit" src={logo} alt="logo"/>
                            </IconButton>
                            <Typography variant="h6" color="inherit" noWrap={true}>
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

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };
}

export default compose(withRouter, withStyles(styles))(Layout)