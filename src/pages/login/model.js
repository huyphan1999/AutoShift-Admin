import { history } from 'umi'
const { pathToRegexp } = require('path-to-regexp')
import { getRequest, postRequest } from 'services'
import configs from 'server'
import { setToken } from 'utils'
import store from 'store'

import { Button, notification, Space } from 'antd'

export default {
  namespace: 'login',

  state: {},
  // subscriptions: {
  //   setup({ dispatch, history }) {
  //     history.listen(location => {
  //       if (pathToRegexp('/login').exec(location.pathname)) {
  //       }
  //     })
  //   },
  // },
  effects: {
    *login({ payload }, { put, call, select }) {
      const res = yield call(
        postRequest,
        `${configs.apiUrl}auth/login-web`,
        payload
      )

      console.log('res')
      console.log(res)
      const { locationQuery } = yield select((_) => _.app)
      if (res?.data?.token) {
        const { token, user } = res.data
        setToken(token)
        console.log('res.data', res.data)
        store.set('user', user)
        yield put({ type: 'app/query' })
      } else if (res?.error_code == 400) {
        notification.error({
          message: 'Thông báo',
          description: res?.message[0],
        })
      }
    },
  },
}
