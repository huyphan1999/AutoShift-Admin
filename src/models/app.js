/* global window */

import { history } from 'umi'
import { stringify } from 'qs'
import store from 'store'
const { pathToRegexp } = require('path-to-regexp')
import { ROLE_TYPE } from 'utils/constant'
import { queryLayout, setToken } from 'utils'
import { CANCEL_REQUEST_MESSAGE } from 'utils/constant'
import api from 'api'
import config from 'config'
import { getToken } from '../utils'

const { queryRouteList, logoutUser, queryUserInfo } = api

const goDashboard = () => {
  if (pathToRegexp(['/', '/login']).exec(window.location.pathname)) {
    history.push({
      pathname: '/dashboard',
    })
  }
}

const routeList = [
  {
    id: '1',
    icon: 'dashboard',
    name: 'Dashboard',
    route: '/dashboard',
  },
  {
    id: '2',
    breadcrumbParentId: '1',
    name: 'Nhấn viên',
    icon: 'user',
    route: '/user',
  },
  {
    id: '224',
    breadcrumbParentId: '1',
    name: 'Tiền lương',
    icon: 'salary',
    route: '/salary',
  },
  // {
  //   id: '7',
  //   breadcrumbParentId: '1',
  //   name: 'Posts',
  //   icon: 'shopping-cart',
  //   route: '/post',
  // },
  {
    id: '21',
    menuParentId: '-1',
    breadcrumbParentId: '2',
    name: 'User Detail',
    route: '/user/:id',
  },
  // {
  //   id: '3',
  //   breadcrumbParentId: '1',
  //   name: 'Request',
  //   icon: 'api',
  //   route: '/request',
  // },
  // {
  //   id: '4',
  //   breadcrumbParentId: '1',
  //   name: 'UI Element',
  //   icon: 'camera-o',
  // },
  // {
  //   id: '45',
  //   breadcrumbParentId: '4',
  //   menuParentId: '4',
  //   name: 'Editor',
  //   icon: 'edit',
  //   route: '/editor',
  // },
  // {
  //   id: '5',
  //   breadcrumbParentId: '1',
  //   name: 'Charts',
  //   icon: 'code-o',
  // },
  // {
  //   id: '51',
  //   breadcrumbParentId: '5',
  //   menuParentId: '5',
  //   name: 'ECharts',
  //   icon: 'line-chart',
  //   route: '/chart/ECharts',
  // },
  // {
  //   id: '52',
  //   breadcrumbParentId: '5',
  //   menuParentId: '5',
  //   name: 'HighCharts',
  //   icon: 'bar-chart',
  //   route: '/chart/highCharts',
  // },
  // {
  //   id: '53',
  //   breadcrumbParentId: '5',
  //   menuParentId: '5',
  //   name: 'Rechartst',
  //   icon: 'area-chart',
  //   route: '/chart/Recharts',
  // },
  {
    id: '6',
    breadcrumbParentId: '1',
    name: 'Chấm công',
    icon: 'time-management',
  },
  {
    id: '61',
    breadcrumbParentId: '6',
    menuParentId: '6',
    name: 'Bảng công',
    icon: 'timesheet',
    route: '/time-management/timesheet',
  },
  {
    id: '62',
    breadcrumbParentId: '6',
    menuParentId: '6',
    name: 'Cấu hình',
    icon: 'config',
    route: '/time-management/config',
  },
]

export default {
  namespace: 'app',
  state: {
    routeList: routeList,
    locationPathname: '',
    locationQuery: {},
    theme: store.get('theme') || 'light',
    collapsed: store.get('collapsed') || false,
    notifications: [
      {
        title: 'New User is registered.',
        date: new Date(Date.now() - 10000000),
      },
      {
        title: 'Application has been approved.',
        date: new Date(Date.now() - 50000000),
      },
    ],
  },
  subscriptions: {
    setup({ dispatch }) {
      dispatch({ type: 'query' })
    },
    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setupRequestCancel({ history }) {
      history.listen(() => {
        const { cancelRequest = new Map() } = window

        cancelRequest.forEach((value, key) => {
          if (value.pathname !== window.location.pathname) {
            value.cancel(CANCEL_REQUEST_MESSAGE)
            cancelRequest.delete(key)
          }
        })
      })
    },
  },
  effects: {
    *query({ payload }, { call, put, select }) {
      // store isInit to prevent query trigger by refresh
      const token = store.get('token')
      const user = store.get('user')
      const { locationPathname } = yield select((_) => _.app)
      if (token && user) {
        getToken()
        goDashboard()
        return
      } else if (queryLayout(config.layouts, locationPathname) !== 'public') {
        history.push({
          pathname: '/login',
        })
      }
    },

    *signOut({ payload }, { call, put }) {
      //Back to login
      history.push({
        pathname: '/login',
      })

      //Clear all store
      setTimeout(() => store.clearAll(), 100)
    },
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

    handleThemeChange(state, { payload }) {
      store.set('theme', payload)
      state.theme = payload
    },

    handleCollapseChange(state, { payload }) {
      store.set('collapsed', payload)
      state.collapsed = payload
    },

    allNotificationsRead(state) {
      state.notifications = []
    },
  },
}
