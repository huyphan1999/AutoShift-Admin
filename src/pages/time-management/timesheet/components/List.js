import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Popover, List } from 'antd'
import { DropOption } from 'components'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/macro'
import { Link } from 'umi'
import styles from './List.less'
import { number_format } from 'utils'
import { round } from 'lodash'
import classNames from 'classnames'
import { Ellipsis } from 'components'
import { RightOutlined } from '@ant-design/icons'

import stylesItem from './ShiftDetail.less'

const { confirm } = Modal

const statusColors = [
  { title: 'Đi trễ/Về sớm', color: '#e4e13a' },
  { title: 'Đúng giờ', color: '#06c154' },
  { title: 'Chưa vào ca', color: '#a11717' },
  { title: 'Ca theo lịch', color: '#93a399' },
]

class ListTimeSheet extends PureComponent {
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
        <Popover
          placement="bottomRight"
          trigger="click"
          key="notifications"
          overlayClassName={stylesItem.notificationPopover}
          // getPopupContainer={() => document.querySelector('#primaryLayout')}
          content={
            <div className={stylesItem.notification}>
              <List
                itemLayout="horizontal"
                dataSource={shifts}
                renderItem={(item) => (
                  <List.Item className={stylesItem.notificationItem}>
                    <List.Item.Meta
                      title={
                        <Ellipsis tooltip lines={1}>
                          {`${item.shift_name} (${item.time_begin} - ${item.time_end})`}
                        </Ellipsis>
                      }
                      description={this.getDescription(item)}
                    />
                  </List.Item>
                )}
              />
            </div>
          }
        >
          <div
            className={classNames({
              'in-time': shifts.some((shift) => shift.type == 'in-time'),
              'late-soon': shifts.some((shift) => shift.type == 'late-soon'),
              'no-check-in': shifts.some(
                (shift) => shift.type == 'no-check-in'
              ),
              future: shifts.some((shift) => shift.status == -1),
            })}
          >
            {`${shifts.length} ca`}
          </div>
        </Popover>
      )
    }

    return <div className="timesheet-cell">--/--</div>
  }

  getDescription = ({ type, soon_check_out, late_check_in }) => {
    if (type == 'late-soon') {
      return (
        <span style={{ color: '#d6d32a', fontWeight: 'bolder' }}>
          {`Đi trễ : ${Math.round(late_check_in / 60)}p   Về sớm: ${Math.round(
            soon_check_out / 60
          )}p`}
        </span>
      )
    }
    if (type == 'no-check-in') {
      return (
        <span style={{ color: '#a11717', fontWeight: 'bolder' }}>
          Không chấm công
        </span>
      )
    }
    if (type == 'in-time') {
      return (
        <span style={{ color: '#06c154', fontWeight: 'bolder' }}>Đúng giờ</span>
      )
    }
    return ''
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
        render: (user) => <a>{user?.name}</a>,
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
          showTotal: (total) => `Tất cả ${total} nhân viên`,
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

ListTimeSheet.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default ListTimeSheet
