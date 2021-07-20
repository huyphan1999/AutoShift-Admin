import modelExtend from 'dva-model-extend'
const { pathToRegexp } = require('path-to-regexp')
import api from 'api'
import { pageModel } from 'utils/model'
import { postRequest, getRequest } from 'services'
import configs from 'server'
import { message } from 'antd'
import isEmpty from 'lodash/isEmpty'

export default modelExtend(pageModel, {
  namespace: 'salary',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathToRegexp('/salary').exec(location.pathname)) {
          const payload = isEmpty(location.query)
            ? { month_date: '2021-06' }
            : location.query
          console.log('pathToRegexp', location.query, isEmpty(location.query))
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *create({ payload }, { call, put }) {
      const res = yield call(
        postRequest,
        `${configs.apiUrl}salary/register`,
        payload
      )
      if (res?.data) {
        message.success('Tạo thành công')
        yield put({ type: 'hideModal' })
      } else {
        message.error('Tạo thất bại')
      }
    },
    *query({ payload = {} }, { call, put }) {
      console.log(payload)
      const res = yield call(postRequest, `${configs.apiUrl}salary/view`, {
        month_date: payload.month_date,
      })
      if (res?.data) {
        const { data } = res
        yield put({
          type: 'querySuccess',
          payload: {
            list: data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.length || 0,
            },
          },
        })
      }
    },
  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },
  },
})
