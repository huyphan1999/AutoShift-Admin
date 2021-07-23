import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Modal, Avatar } from 'antd'
import { DropOption } from 'components'
import { t } from '@lingui/macro'
import { Trans } from '@lingui/macro'
import { Link } from 'umi'
import styles from './List.less'
import { number_format } from 'utils'

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
          onDeleteItem(record.id)
        },
      })
    }
  }

  render() {
    const { onDeleteItem, onEditItem, ...tableProps } = this.props

    const columns = [
      {
        title: 'Tên',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => <Link to={`user/${record.id}`}>{text}</Link>,
      },

      {
        title: 'Quyền hạn',
        dataIndex: 'is_admin',
        key: 'sex',
        width: '100',
        render: (text) => <span>{text ? 'Quản lý' : 'Nhân viên'}</span>,
      },
      {
        title: 'Điện thoại',
        dataIndex: 'phone_number',
        key: 'phone',
      },
      {
        title: 'Phòng ban',
        dataIndex: 'dep',
        key: 'dep',
        render: (text) => <span>{text.name}</span>,
      },
      // {
      //   title: 'Chức vụ',
      //   dataIndex: ['position', 'position_name'],
      //   key: 'position',
      // },
      {
        title: 'Lương',
        dataIndex: 'basic_salary',
        key: 'salary',
        render: (text) => <span>{number_format(text)} </span>,
      },
      {
        title: null,
        key: 'operation',
        width: '10%',
        render: (text, record) => {
          return (
            <DropOption
              onMenuClick={(e) => this.handleMenuClick(record, e)}
              menuOptions={[
                { key: '1', name: t`Update` },
                { key: '2', name: t`Delete` },
              ]}
            />
          )
        },
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
        rowKey={(record) => record.id}
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
