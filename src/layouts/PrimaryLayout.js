/* global window */
/* global document */
import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'umi'
import { connect } from 'umi'
import { MyLayout, GlobalFooter } from 'components'
import { BackTop, Layout, Drawer } from 'antd'
import { enquireScreen, unenquireScreen } from 'enquire-js'
const { pathToRegexp } = require('path-to-regexp')
import { config, getLocale } from 'utils'
import Error from '../pages/404'
import styles from './PrimaryLayout.less'
import store from 'store'

const { Content } = Layout
const { Header, Bread, Sider } = MyLayout

@withRouter
@connect(({ app, loading }) => ({ app, loading }))
class PrimaryLayout extends PureComponent {
  state = {
    isMobile: false,
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen((mobile) => {
      const { isMobile } = this.state
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        })
      }
    })
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler)
  }

  onCollapseChange = (collapsed) => {
    console.log('onCollapseChange', collapsed)
    this.props.dispatch({
      type: 'app/handleCollapseChange',
      payload: collapsed,
    })
  }

  render() {
    const { app, location, dispatch, children } = this.props
    console.log(this.props)
    const { theme, collapsed, notifications, routeList } = app
    const user = store.get('user') || {}
    const { isMobile } = this.state
    const { onCollapseChange } = this

    // Localized route name.

    const lang = getLocale()
    const newRouteList = routeList

    // Find a route that matches the pathname.
    const currentRoute = newRouteList.find(
      (_) => _.route && pathToRegexp(_.route).exec(location.pathname)
    )

    // MenuParentId is equal to -1 is not a available menu.
    const menus = newRouteList.filter((_) => _.menuParentId !== '-1')

    const headerProps = {
      menus,
      collapsed,
      notifications,
      onCollapseChange: this.onCollapseChange,
      avatar: user.avatar,
      username: user.name,
      fixed: config.fixedHeader,
      onAllNotificationsRead() {
        dispatch({ type: 'app/allNotificationsRead' })
      },
      onSignOut() {
        dispatch({ type: 'app/signOut' })
      },
    }

    const siderProps = {
      theme,
      menus,
      isMobile,
      collapsed,
      onCollapseChange,
      onThemeChange(theme) {
        dispatch({
          type: 'app/handleThemeChange',
          payload: theme,
        })
      },
    }

    return (
      <Fragment>
        <Layout>
          {isMobile ? (
            <Drawer
              maskClosable
              closable={false}
              onClose={onCollapseChange.bind(this, !collapsed)}
              visible={!collapsed}
              placement="left"
              width={250}
              bodyStyle={{ padding: 0 }}
            >
              <Sider {...siderProps} wrapper="Drawer" collapsed={false} />
            </Drawer>
          ) : (
            <Sider {...siderProps} />
          )}
          <div
            className={styles.container}
            style={{ paddingTop: config.fixedHeader ? 72 : 0 }}
            id="primaryLayout"
          >
            <Header {...headerProps} />
            <Content className={styles.content}>
              <Bread routeList={newRouteList} />
              {children}
            </Content>
            <BackTop
              className={styles.backTop}
              target={() => document.querySelector('#primaryLayout')}
            />
          </div>
        </Layout>
      </Fragment>
    )
  }
}

PrimaryLayout.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  loading: PropTypes.object,
}

export default PrimaryLayout
