import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'umi'
import { Row, Col, Card } from 'antd'
import { Color } from 'utils'
import { Page, ScrollBar } from 'components'
import {
  NumberCard,
  Quote,
  Sales,
  Weather,
  RecentSales,
  Comments,
  Completed,
  Browser,
  Cpu,
  User,
  TopLateSoon,
} from './components'
import styles from './index.less'
import store from 'store'

const bodyStyle = {
  bodyStyle: {
    height: 432,
    background: '#fff',
  },
}

@connect(({ app, dashboard, loading }) => ({
  dashboard,
  loading,
}))
class Dashboard extends PureComponent {
  mapCarDashboard = (numberData) => {
    const numbersInfor = [
      {
        icon: 'team',
        color: Color.blue,
        title: 'Tổng nhân viên',
        number: 3241,
        key: 'total_emp',
      },
      {
        icon: 'in_time',
        color: Color.green,
        title: 'Đúng giờ',
        number: 2781,
        key: 'total_on_time',
      },
      {
        icon: 'out_time',
        color: Color.warning,
        title: 'Đi muộn',
        key: 'total_late_time',
        number: 253,
      },
      {
        icon: 'noCheck',
        color: Color.danger,
        title: 'Không vào ca',
        number: 4324,
        key: 'total_no_timekeeping',
      },
    ]
    return numbersInfor.map((item) => ({
      ...item,
      number: numberData[item.key],
    }))
  }

  render() {
    const userDetail = store.get('user')
    const { avatar, username } = userDetail
    const { dashboard, loading } = this.props
    const {
      weather,
      sales,
      quote,
      numbers,
      recentSales,
      comments,
      completed,
      browser,
      cpu,
      user,
      data_statistical_time,
      list_late_soon,
    } = dashboard

    const numberCards =
      data_statistical_time &&
      this.mapCarDashboard(data_statistical_time).map((item, key) => (
        <Col key={key} lg={6} md={12}>
          <NumberCard {...item} />
        </Col>
      ))

    return (
      <Page
        // loading={loading.models.dashboard && sales.length === 0}
        className={styles.dashboard}
      >
        <Row gutter={24}>
          {numberCards}
          <Col lg={24} md={24}>
            <Card bordered={false} {...bodyStyle}>
              <TopLateSoon data={list_late_soon} />
            </Card>
          </Col>
        </Row>
      </Page>
    )
  }
}

Dashboard.propTypes = {
  dashboard: PropTypes.object,
  loading: PropTypes.object,
}

export default Dashboard
