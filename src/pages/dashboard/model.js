import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import api from 'api'
const { pathToRegexp } = require('path-to-regexp')
import { model } from 'utils/model'
import { postRequest, getRequest } from 'services'
import configs from 'server'
const { queryDashboard, queryWeather } = api

import moment from 'moment'
const avatar =
  '//cdn.antd-admin.zuiidea.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236.jpeg'

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    weather: {
      city: '深圳',
      temperature: '30',
      name: '晴',
      icon: '//cdn.antd-admin.zuiidea.com/sun.png',
    },
    sales: [],
    quote: {
      avatar,
    },
    numbers: [],
    recentSales: [],
    comments: [],
    completed: [],
    browser: [],
    cpu: {},
    user: {
      avatar,
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (
          pathToRegexp('/dashboard').exec(pathname) ||
          pathToRegexp('/').exec(pathname)
        ) {
          dispatch({ type: 'query' })
          dispatch({ type: 'queryListLateSoon' })
        }
      })
    },
  },
  effects: {
    *queryListLateSoon({ payload }, { call, put }) {
      const res = yield yield call(
        postRequest,
        `${configs.apiUrl}general/statistical_late_soon`,
        { date: '2021-06-15' }
      )

      if (res?.data) {
        yield put({
          type: 'updateState',
          payload: { list_late_soon: res.data },
        })
      }
    },
    *query({ payload }, { call, put }) {
      const res = yield yield call(
        postRequest,
        `${configs.apiUrl}general/statistical`,
        { date: '2021-06-15' }
      )

      if (res?.data) {
        yield put({
          type: 'updateState',
          payload: res.data,
        })
      }
    },
  },
})
