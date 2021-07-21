import modelExtend from 'dva-model-extend'
const { pathToRegexp } = require('path-to-regexp')
import api from 'api'
import { pageModel } from 'utils/model'
import { postRequest, getRequest } from 'services'
import configs from 'server'
import isEmpty from 'lodash/isEmpty'
import moment from 'moment'

export default modelExtend(pageModel, {
  namespace: 'timesheet',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (
          pathToRegexp('/time-management/timesheet').exec(location.pathname)
        ) {
          const payload = isEmpty(location.query)
            ? {
                from_date: moment().startOf('week').format('YYYY-MM-DD'),
                to_date: moment().endOf('week').format('YYYY-MM-DD'),
              }
            : location.query
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      console.log(payload)
      const res = yield call(
        postRequest,
        `${configs.apiUrl}empshift/list-time-sheet`,
        payload
      )
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
