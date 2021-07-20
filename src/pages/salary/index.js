import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { history } from 'umi'
import { connect } from 'umi'
import { Row, Col, Button, Popconfirm } from 'antd'
import { t } from '@lingui/macro'
import { Page } from 'components'
import { stringify } from 'qs'
import List from './components/List'
import Filter from './components/Filter'
import Modal from './components/Modal'

@connect(({ salary, loading }) => ({ salary, loading }))
class Salary extends PureComponent {
  handleRefresh = (newQuery) => {
    const { location } = this.props
    const { query, pathname } = location

    history.push({
      pathname,
      search: stringify(
        {
          ...query,
          ...newQuery,
        },
        { arrayFormat: 'repeat' }
      ),
    })
  }

  get modalProps() {
    const { dispatch, salary, loading } = this.props
    const { currentItem, modalVisible, modalType } = salary

    return {
      item: modalType === 'create' ? {} : currentItem,
      visible: modalVisible,
      destroyOnClose: true,
      maskClosable: false,
      width: 600,
      confirmLoading: loading.effects[`salary/${modalType}`],
      title: 'Tạo bảng lương',
      centered: true,
      onOk: (data) => {
        dispatch({
          type: `salary/${modalType}`,
          payload: data,
        })
      },
      onCancel() {
        dispatch({
          type: 'salary/hideModal',
        })
      },
    }
  }

  get listProps() {
    const { dispatch, salary, loading } = this.props
    const { list, pagination, selectedRowKeys } = salary

    return {
      dataSource: list,
      loading: loading.effects['salary/query'],
      pagination,
      onChange: (page) => {
        this.handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
    }
  }

  get filterProps() {
    const { location, dispatch } = this.props
    const { query } = location

    return {
      filter: {
        ...query,
      },
      onFilterChange: (value) => {
        this.handleRefresh({
          ...value,
        })
      },
      onAdd() {
        dispatch({
          type: 'salary/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }
  }

  render() {
    return (
      <Page inner>
        <Filter {...this.filterProps} />
        <List {...this.listProps} />
        <Modal {...this.modalProps} />
      </Page>
    )
  }
}

export default Salary
