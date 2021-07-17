import modelExtend from 'dva-model-extend'
const { pathToRegexp } = require('path-to-regexp')
import api from 'api'
import { pageModel } from 'utils/model'
import { postRequest, getRequest } from 'services'
import configs from 'server'

const { queryUserList, createUser, removeUser, updateUser, removeUserList } =
  api

export default modelExtend(pageModel, {
  namespace: 'config',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathToRegexp('/time-management/config').exec(location.pathname)) {
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      const res = yield call(getRequest, `${configs.apiUrl}timekeep/detail`)
      if (res?.data) {
        const { data } = res
        yield put({
          type: 'querySuccess',
          payload: {
            list: data,
          },
        })
      }
    },
  },
})
