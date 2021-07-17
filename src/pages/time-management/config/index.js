import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { history } from 'umi'
import { connect } from 'umi'
import { Row, Col, Button, Popconfirm, Space } from 'antd'
import { t } from '@lingui/macro'
import { Page } from 'components'
import WifiConfig from './components/WifiConfig'
import LocationConfig from './components/LocationConfig'

@connect(({ config, loading }) => ({ config, loading }))
class Config extends PureComponent {
  render() {
    const { config, dispatch } = this.props

    console.log('Config', this.props)

    const { list } = config

    return (
      <Page inner>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {list && (
            <>
              <WifiConfig config={list} wifi={list?.wifi} />
              <LocationConfig config={list} location={list?.location} />
            </>
          )}
        </div>
      </Page>
    )
  }
}

export default Config
