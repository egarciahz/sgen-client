/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import ItemIcon from '@material-ui/icons/FolderOpen';
import DetailsIcon from '@material-ui/icons/Visibility';

import { Toolbar, ToolbarAction } from '../../components/layout/header';
import { ItemList, ItemListSkeleton } from '../../components/ItemList';
import { IconButtonLink } from '../../components/Link';
import PlusButton from '../../components/PlusButton';

import { CleanActions, ToolbarTitle } from '../toobar';
import CreateComponent from './Create__';
import UpdateComponent from './Update__';
import DeleteComponent from './Delete__';

const TITLE = '__';

const MainList: React.FC<{ baseName: string }> = ({ baseName }) => {
    const fetching = true;
    const list = [
        {
            id: '1',
            title: 'Casa Blanca Panaderia',
            subtitle: 'desde - hasta',
        },
    ];

    const actions = (id: string) => [
        <IconButtonLink key="details" to={`${baseName}/${id}`}>
            <DetailsIcon />
        </IconButtonLink>,
    ];

    return (
        <React.Fragment>
            <ToolbarTitle title={TITLE} />
            <ToolbarAction>
                <Link to={`${baseName}/new`}>
                    <PlusButton collapsed={false} label={'Create New'} />
                </Link>
            </ToolbarAction>
            <CleanActions />
            <Box>
                {list.map(data => (
                    <ItemList
                        title={data.title}
                        subTitle={data.subtitle}
                        leftIcon={<ItemIcon />}
                        actions={actions(data.id)}
                        key={data.id}
                    />
                ))}
                {fetching && [1, 2, 3].map(key => <ItemListSkeleton actions={2} key={key} leftIcon subTitle />)}
            </Box>
        </React.Fragment>
    );
};

export default function _Module() {
    const { path, url } = useRouteMatch();
    return (
        <Toolbar title={TITLE}>
            <Switch>
                <Route path={path} exact>
                    <MainList baseName={url} />
                </Route>
                <Route path={`${path}/new`} strict>
                    <CreateComponent fallback={path} />
                </Route>
                <Route path={`${path}/:id/remove`} strict>
                    <DeleteComponent fallback={path} />
                </Route>
                <Route path={`${path}/:id`} strict>
                    <UpdateComponent fallback={path} />
                </Route>
            </Switch>
        </Toolbar>
    );
}
