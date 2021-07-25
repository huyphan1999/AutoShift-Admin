import React from 'react'
import moment from 'moment'
import PropTypes from 'prop-types'
import { Table, Tag } from 'antd'
import { Color } from 'utils'
import styles from './topLateSoon.less'

const status = {
  late_check_in: {
    color: Color.danger,
    text: 'Đi muộn',
  },
  soon_check_out: {
    color: Color.yellow,
    text: 'Về sớm',
  },
}

function TopLateSoon({ data }) {
  const columns = [
    {
      title: 'Tên',
      dataIndex: 'user_name',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'type',
      render: (type) => (
        <Tag color={status[type].color}>{status[type].text}</Tag>
      ),
    },
    {
      title: 'Ca',
      dataIndex: 'shift_name',
      render: (text, user) => (
        <span>{`${user.shift_name} - (${user.shift_time})`}</span>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'value',
      render: (value, it) => (
        <span style={{ color: status[it.type].color }}>{`${Math.round(
          value / 60
        )} phút`}</span>
      ),
    },
  ]
  return (
    <div className={styles.recentsales}>
      <Table
        pagination={false}
        columns={columns}
        rowKey="id"
        dataSource={data}
      />
    </div>
  )
}

TopLateSoon.propTypes = {
  data: PropTypes.array,
}

export default TopLateSoon
