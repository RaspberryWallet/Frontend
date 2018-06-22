import React, {Fragment} from 'react'
import {Link, Redirect, Route, Switch} from "react-router-dom";
import Module from './Module/index'

export default ({match: {url}, modules}) =>
    <Fragment>
        <Switch>
            <Route exact path={url} render={() => <h1>Please select module</h1>}/>

            <Route path={`${url}/:moduleId`} render={
                ({match}) =>{
                    if (!modules)
                        return <h3>No modules found</h3>;

                    const module = modules.find(module => module.id === match.params.moduleId)

                    if(!module) return <h3>No module found for id {match.params.moduleId}</h3>;


                    return <Module {...module}/>

                }
            }/>
            <Route render={() => <Redirect to="/404"/>}/>
        </Switch>
    </Fragment>