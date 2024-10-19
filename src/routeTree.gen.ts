/* prettier-ignore-start */

/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file is auto-generated by TanStack Router

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as LayoutImport } from './routes/_layout'
import { Route as IndexImport } from './routes/index'
import { Route as LayoutUsersIndexImport } from './routes/_layout/users/index'
import { Route as LayoutTasksIndexImport } from './routes/_layout/tasks/index'
import { Route as LayoutProjectsIndexImport } from './routes/_layout/projects/index'
import { Route as LayoutDashboardIndexImport } from './routes/_layout/dashboard/index'
import { Route as LayoutTasksViewIndexImport } from './routes/_layout/tasks/view/index'
import { Route as LayoutTasksAddIndexImport } from './routes/_layout/tasks/add/index'
import { Route as LayoutProjectsAddIndexImport } from './routes/_layout/projects/add/index'
import { Route as LayoutProjectsProjectIdIndexImport } from './routes/_layout/projects/$projectId/index'
import { Route as LayoutTasksTaskIdUpdateImport } from './routes/_layout/tasks/$taskId/update'

// Create/Update Routes

const LayoutRoute = LayoutImport.update({
  id: '/_layout',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const LayoutUsersIndexRoute = LayoutUsersIndexImport.update({
  path: '/users/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutTasksIndexRoute = LayoutTasksIndexImport.update({
  path: '/tasks/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutProjectsIndexRoute = LayoutProjectsIndexImport.update({
  path: '/projects/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutDashboardIndexRoute = LayoutDashboardIndexImport.update({
  path: '/dashboard/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutTasksViewIndexRoute = LayoutTasksViewIndexImport.update({
  path: '/tasks/view/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutTasksAddIndexRoute = LayoutTasksAddIndexImport.update({
  path: '/tasks/add/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutProjectsAddIndexRoute = LayoutProjectsAddIndexImport.update({
  path: '/projects/add/',
  getParentRoute: () => LayoutRoute,
} as any)

const LayoutProjectsProjectIdIndexRoute =
  LayoutProjectsProjectIdIndexImport.update({
    path: '/projects/$projectId/',
    getParentRoute: () => LayoutRoute,
  } as any)

const LayoutTasksTaskIdUpdateRoute = LayoutTasksTaskIdUpdateImport.update({
  path: '/tasks/$taskId/update',
  getParentRoute: () => LayoutRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/_layout': {
      id: '/_layout'
      path: ''
      fullPath: ''
      preLoaderRoute: typeof LayoutImport
      parentRoute: typeof rootRoute
    }
    '/_layout/dashboard/': {
      id: '/_layout/dashboard/'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof LayoutDashboardIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/projects/': {
      id: '/_layout/projects/'
      path: '/projects'
      fullPath: '/projects'
      preLoaderRoute: typeof LayoutProjectsIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/tasks/': {
      id: '/_layout/tasks/'
      path: '/tasks'
      fullPath: '/tasks'
      preLoaderRoute: typeof LayoutTasksIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/users/': {
      id: '/_layout/users/'
      path: '/users'
      fullPath: '/users'
      preLoaderRoute: typeof LayoutUsersIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/tasks/$taskId/update': {
      id: '/_layout/tasks/$taskId/update'
      path: '/tasks/$taskId/update'
      fullPath: '/tasks/$taskId/update'
      preLoaderRoute: typeof LayoutTasksTaskIdUpdateImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/projects/$projectId/': {
      id: '/_layout/projects/$projectId/'
      path: '/projects/$projectId'
      fullPath: '/projects/$projectId'
      preLoaderRoute: typeof LayoutProjectsProjectIdIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/projects/add/': {
      id: '/_layout/projects/add/'
      path: '/projects/add'
      fullPath: '/projects/add'
      preLoaderRoute: typeof LayoutProjectsAddIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/tasks/add/': {
      id: '/_layout/tasks/add/'
      path: '/tasks/add'
      fullPath: '/tasks/add'
      preLoaderRoute: typeof LayoutTasksAddIndexImport
      parentRoute: typeof LayoutImport
    }
    '/_layout/tasks/view/': {
      id: '/_layout/tasks/view/'
      path: '/tasks/view'
      fullPath: '/tasks/view'
      preLoaderRoute: typeof LayoutTasksViewIndexImport
      parentRoute: typeof LayoutImport
    }
  }
}

// Create and export the route tree

interface LayoutRouteChildren {
  LayoutDashboardIndexRoute: typeof LayoutDashboardIndexRoute
  LayoutProjectsIndexRoute: typeof LayoutProjectsIndexRoute
  LayoutTasksIndexRoute: typeof LayoutTasksIndexRoute
  LayoutUsersIndexRoute: typeof LayoutUsersIndexRoute
  LayoutTasksTaskIdUpdateRoute: typeof LayoutTasksTaskIdUpdateRoute
  LayoutProjectsProjectIdIndexRoute: typeof LayoutProjectsProjectIdIndexRoute
  LayoutProjectsAddIndexRoute: typeof LayoutProjectsAddIndexRoute
  LayoutTasksAddIndexRoute: typeof LayoutTasksAddIndexRoute
  LayoutTasksViewIndexRoute: typeof LayoutTasksViewIndexRoute
}

const LayoutRouteChildren: LayoutRouteChildren = {
  LayoutDashboardIndexRoute: LayoutDashboardIndexRoute,
  LayoutProjectsIndexRoute: LayoutProjectsIndexRoute,
  LayoutTasksIndexRoute: LayoutTasksIndexRoute,
  LayoutUsersIndexRoute: LayoutUsersIndexRoute,
  LayoutTasksTaskIdUpdateRoute: LayoutTasksTaskIdUpdateRoute,
  LayoutProjectsProjectIdIndexRoute: LayoutProjectsProjectIdIndexRoute,
  LayoutProjectsAddIndexRoute: LayoutProjectsAddIndexRoute,
  LayoutTasksAddIndexRoute: LayoutTasksAddIndexRoute,
  LayoutTasksViewIndexRoute: LayoutTasksViewIndexRoute,
}

const LayoutRouteWithChildren =
  LayoutRoute._addFileChildren(LayoutRouteChildren)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '': typeof LayoutRouteWithChildren
  '/dashboard': typeof LayoutDashboardIndexRoute
  '/projects': typeof LayoutProjectsIndexRoute
  '/tasks': typeof LayoutTasksIndexRoute
  '/users': typeof LayoutUsersIndexRoute
  '/tasks/$taskId/update': typeof LayoutTasksTaskIdUpdateRoute
  '/projects/$projectId': typeof LayoutProjectsProjectIdIndexRoute
  '/projects/add': typeof LayoutProjectsAddIndexRoute
  '/tasks/add': typeof LayoutTasksAddIndexRoute
  '/tasks/view': typeof LayoutTasksViewIndexRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '': typeof LayoutRouteWithChildren
  '/dashboard': typeof LayoutDashboardIndexRoute
  '/projects': typeof LayoutProjectsIndexRoute
  '/tasks': typeof LayoutTasksIndexRoute
  '/users': typeof LayoutUsersIndexRoute
  '/tasks/$taskId/update': typeof LayoutTasksTaskIdUpdateRoute
  '/projects/$projectId': typeof LayoutProjectsProjectIdIndexRoute
  '/projects/add': typeof LayoutProjectsAddIndexRoute
  '/tasks/add': typeof LayoutTasksAddIndexRoute
  '/tasks/view': typeof LayoutTasksViewIndexRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/_layout': typeof LayoutRouteWithChildren
  '/_layout/dashboard/': typeof LayoutDashboardIndexRoute
  '/_layout/projects/': typeof LayoutProjectsIndexRoute
  '/_layout/tasks/': typeof LayoutTasksIndexRoute
  '/_layout/users/': typeof LayoutUsersIndexRoute
  '/_layout/tasks/$taskId/update': typeof LayoutTasksTaskIdUpdateRoute
  '/_layout/projects/$projectId/': typeof LayoutProjectsProjectIdIndexRoute
  '/_layout/projects/add/': typeof LayoutProjectsAddIndexRoute
  '/_layout/tasks/add/': typeof LayoutTasksAddIndexRoute
  '/_layout/tasks/view/': typeof LayoutTasksViewIndexRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | ''
    | '/dashboard'
    | '/projects'
    | '/tasks'
    | '/users'
    | '/tasks/$taskId/update'
    | '/projects/$projectId'
    | '/projects/add'
    | '/tasks/add'
    | '/tasks/view'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | ''
    | '/dashboard'
    | '/projects'
    | '/tasks'
    | '/users'
    | '/tasks/$taskId/update'
    | '/projects/$projectId'
    | '/projects/add'
    | '/tasks/add'
    | '/tasks/view'
  id:
    | '__root__'
    | '/'
    | '/_layout'
    | '/_layout/dashboard/'
    | '/_layout/projects/'
    | '/_layout/tasks/'
    | '/_layout/users/'
    | '/_layout/tasks/$taskId/update'
    | '/_layout/projects/$projectId/'
    | '/_layout/projects/add/'
    | '/_layout/tasks/add/'
    | '/_layout/tasks/view/'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  LayoutRoute: typeof LayoutRouteWithChildren
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  LayoutRoute: LayoutRouteWithChildren,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* prettier-ignore-end */

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/_layout"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/_layout": {
      "filePath": "_layout.tsx",
      "children": [
        "/_layout/dashboard/",
        "/_layout/projects/",
        "/_layout/tasks/",
        "/_layout/users/",
        "/_layout/tasks/$taskId/update",
        "/_layout/projects/$projectId/",
        "/_layout/projects/add/",
        "/_layout/tasks/add/",
        "/_layout/tasks/view/"
      ]
    },
    "/_layout/dashboard/": {
      "filePath": "_layout/dashboard/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/projects/": {
      "filePath": "_layout/projects/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/tasks/": {
      "filePath": "_layout/tasks/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/users/": {
      "filePath": "_layout/users/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/tasks/$taskId/update": {
      "filePath": "_layout/tasks/$taskId/update.tsx",
      "parent": "/_layout"
    },
    "/_layout/projects/$projectId/": {
      "filePath": "_layout/projects/$projectId/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/projects/add/": {
      "filePath": "_layout/projects/add/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/tasks/add/": {
      "filePath": "_layout/tasks/add/index.tsx",
      "parent": "/_layout"
    },
    "/_layout/tasks/view/": {
      "filePath": "_layout/tasks/view/index.tsx",
      "parent": "/_layout"
    }
  }
}
ROUTE_MANIFEST_END */
