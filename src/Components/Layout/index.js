import React, {Component, Fragment} from 'react'
import {
    AppBar,
    MenuList,
    MenuItem,
    Toolbar,
    IconButton,
    Typography,
    Hidden,
    Drawer,
    Divider,
    List,
    CssBaseline
} from '@material-ui/core'
import {Menu} from '@material-ui/icons'
import {withStyles} from '@material-ui/core/styles';
import {Link, withRouter} from 'react-router-dom'
import {compose} from 'recompose'

const drawerWidth = 240;
const styles = theme => ({
    root: {
        flexGrow: 1,
        zIndex: 1,
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        width: '100%',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        position: 'absolute',
    },
    navIconHide: {
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
        [theme.breakpoints.up('md')]: {
            position: 'relative',
        },
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
});

class Layout extends Component {

    state = {
        mobileOpen: false,
    };

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };

    render() {
        const {classes, location: {pathname}, theme, children, modules} = this.props;

        const drawer = (
            <div>
                <Hidden smDown>
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
                            <Typography variant="title" color="inherit" noWrap>
                                Raspberry Wallet
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Hidden mdUp>
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
                    <Hidden smDown implementation="css">
                        <Drawer
                            variant="permanent"
                            open
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
}

export default compose(
    withRouter,
    withStyles(styles)
)(Layout)