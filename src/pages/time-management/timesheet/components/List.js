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
import classNames from 'classnames'

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

  cellRender = (shifts) => {
    if (shifts?.length) {
      return (
        <div
          className={classNames({
            'late-soon': shifts.some(
              (shift) => (shift.soon_check_out >=600 && shift.soon_check_out <720 ) || ( shift.late_check_in >=600 && shift.late_check_in <720)
            ),
            'no-check-in': shifts.some(
              (shift) => shift.soon_check_out >=720  || shift.late_check_in >=720
            ),
            'in-time': shifts.some(
              (shift) =>
                shift.status && !(shift.soon_check_out < 600 && shift.late_check_in < 600)
            ),
            future: shifts.some((shift) => shift.status == -1),
          })}
        >
          {' '}
          {`${shifts.length} ca`}
        </div>
      )
    }

    return <div className="timesheet-cell">--/--</div>
  }

  render() {
    const { onDeleteItem, onEditItem, ...tableProps } = this.props

    const columns = [
      {
        title: null,
        dataIndex: 'user',
        key: 'user',
        fixed: 'left',
        width: 220,
        render: (user) => <a>{user.name}</a>,
      },
    ]

    const days = [
      { label: 'Thứ Hai', key: 1, dataIndex: 'MON' },
      { label: 'Thứ Ba', key: 2, dataIndex: 'TUE' },
      { label: 'Thứ Tư', key: 3, dataIndex: 'WED' },
      { label: 'Thứ Năm', key: 4, dataIndex: 'THU' },
      { label: 'Thứ Sáu', key: 5, dataIndex: 'FRI' },
      { label: 'Thứ Bảy', key: 6, dataIndex: 'SAT' },
      { label: 'Chủ nhật', key: 7, dataIndex: 'SUN' },
    ]

    days.map((value) =>
      columns.push({
        title: `${value?.label}`,
        dataIndex: value.dataIndex,
        key: `${value?.key}`,
        width: 200,
        className: 'text-center timesheet-cell',
        render: this.cellRender,
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
