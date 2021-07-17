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
        title: null,
        dataIndex: 'user_info',
        key: 'user_info',
        fixed: 'left',
        width: 220,
        render: (user_info, record) => (
          <a to={`user/${record._id}`}>{user_info.name}</a>
        ),
      },
    ]

    const days = [
      { label: 'Thứ Hai', key: 1 },
      { label: 'Thứ Ba', key: 2 },
      { label: 'Thứ Tư', key: 3 },
      { label: 'Thứ Năm', key: 4 },
      { label: 'Thứ Sáu', key: 5 },
      { label: 'Thứ Bảy', key: 6 },
      { label: 'Chủ nhật', key: 7 },
    ]

    days.map((value) =>
      columns.push({
        title: `${value?.label}`,
        dataIndex: 'total_late_check_in',
        key: `${value?.key}`,
        width: 200,
        className: 'text-center',
        render: (text) => <span>{number_format(text)} </span>,
      })
    )

    return (
      <Table
        {...tableProps}
        pagination={{
          ...tableProps.pagination,
          showTotal: (total) => t`Tất cả ${total} nhân viên`,
        }}
        className={styles.table}
        scroll={{ x: 'max-content' }}
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
