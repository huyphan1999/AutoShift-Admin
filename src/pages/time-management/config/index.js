import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { history } from 'umi'
import { connect } from 'umi'
import { Spin } from 'antd'
import { t } from '@lingui/macro'
import { Page } from 'components'
import WifiConfig from './components/WifiConfig'
import LocationConfig from './components/LocationConfig'

@connect(({ config, loading }) => ({ config, loading }))
class Config extends PureComponent {
  handleRefresh = () => {
    const { location } = this.props
    const { pathname } = location

    history.push({
      pathname,
    })
  }
  render() {
    const { config, dispatch } = this.props

    console.log('Config', this.props)

    const { list } = config

    return (
      <Page inner>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {list.wifi ? (
            <>
              <WifiConfig
                reload={this.handleRefresh}
                config={list}
                wifi={list?.wifi}
              />
              <LocationConfig
                reload={this.handleRefresh}
                config={list}
                location={list?.location}
              />
            </>
          ) : (
            <Spin size="large" />
          )}
        </div>
      </Page>
    )
  }
}

export default Config
