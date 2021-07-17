import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/macro'
import { Link } from 'umi'
import styles from './List.less'
import { number_format } from 'utils'
import { round } from 'lodash'

const { confirm } = Modal

class List extends PureComponent {
  handleMenuClick = (record, e) => {
    const { onDeleteItem, onEditItem } = this.props

    if (e.key === '1') {
      onEditItem(record)
    } else if (e.key === '2') {
      confirm({
        title: t`Are you sure delete this record?`,
        onOk() {
          onDeleteItem(record._id)
        },
      })
    }
  }

  render() {
    const { onDeleteItem, onEditItem, ...tableProps } = this.props

    const columns = [
      {
        title: 'Tên',
        dataIndex: 'user_info',
        key: 'user_info',
        render: (user_info, record) => (
          <a to={`user/${record._id}`}>{user_info.name}</a>
        ),
      },

      {
        title: 'Đi trễ',
        dataIndex: 'total_late_check_in',
        key: 'total_late_check_in',
        render: (text) => <span>{round(text / 60)} </span>,
      },
      {
        title: 'Về sớm',
        dataIndex: 'total_soon_check_out',
        key: 'total_soon_check_out',
        render: (text) => <span>{round(text / 60)} </span>,
      },
      {
        title: 'Ngày công',
        dataIndex: 'total_work_day',
        key: 'total_work_day',
        render: (text) => <span>{round(text / 60)} </span>,
      },
      {
        title: 'Lương',
        dataIndex: ['user_info', 'basic_salary'],
        key: 'salary',
        render: (text) => <span>{number_format(text)} </span>,
      },
      {
        title: 'Thực lãnh',
        dataIndex: 'real_salary',
        key: 'real_salary',
        render: (text) => <span>{number_format(text)} </span>,
      },
    ]

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => t`Tất cả ${total} nhân viên`,
        }}
        className={styles.table}
        bordered
        columns={columns}
        simple
        rowKey={(record) => record._id}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
