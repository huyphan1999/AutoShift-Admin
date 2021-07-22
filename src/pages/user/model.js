import modelExtend from 'dva-model-extend'
const { pathToRegexp } = require('path-to-regexp')
import api from 'api'
import { pageModel } from 'utils/model'
import { postRequest, getRequest } from 'services'
import configs from 'server'
import { message } from 'antd'

const { queryUserList, createUser, removeUser, updateUser, removeUserList } =
  api

export default modelExtend(pageModel, {
  namespace: 'user',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (pathToRegexp('/user').exec(location.pathname)) {
          const payload = location.query || { page: 1, pageSize: 10 }
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
      const res = yield call(getRequest, `${configs.apiUrl}user/list`,payload)
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

    *delete({ payload }, { call, put, select }) {
      const data = yield call(removeUser, { id: payload })
      const { selectedRowKeys } = yield select((_) => _.user)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            selectedRowKeys: selectedRowKeys.filter((_) => _ !== payload),
          },
        })
      } else {
        throw data
      }
    },

    // *multiDelete({ payload }, { call, put }) {
    //   const data = yield call(removeUserList, payload)
    //   if (data.success) {
    //     yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
    //   } else {
    //     throw data
    //   }
    // },

    *create({ payload }, { call, put }) {
      const res = yield call(
        postRequest,
        `${configs.apiUrl}user/create`,
        payload
      )
      if (res?.data) {
        message.success('Tạo thành công')
        yield put({ type: 'hideModal' })
      } else {
        message.error('Tạo thất bại')
      }
    },

    *update({ payload }, { select, call, put }) {
      const id = yield select(({ user }) => user.currentItem.id)
      const newUser = { ...payload, id }
      const res = yield call(
        postRequest,
        `${configs.apiUrl}user/update`,
        newUser
      )
      if (res?.data) {
        message.success('Cập nhật thành công')
        yield put({ type: 'hideModal' })
      } else {
        message.error('Cập nhật thất bại')
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
