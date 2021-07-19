import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Trans } from '@lingui/macro'
import { t } from '@lingui/macro'
import { Button, Row, Col, DatePicker, Form, Input, Cascader } from 'antd'

import locale from 'antd/es/date-picker/locale/en_GB'
import debounce from 'lodash/debounce'

const { Search } = Input
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

class Filter extends Component {
  formRef = React.createRef()

  handleFields = (fields) => {
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (moment.isMoment(fields[item])) {
          fields.start_date = fields[item].startOf('week').format('YYYY-MM-DD')
          fields.end_date = fields[item].endOf('week').format('YYYY-MM-DD')
          fields[item] = undefined
        }
      }
    }
    return fields
  }

  handleSubmit = () => {
    const { onFilterChange } = this.props
    const values = this.formRef.current.getFieldsValue()
    const fields = this.handleFields(values)
    onFilterChange(fields)
  }

  handleReset = () => {
    const fields = this.formRef.current.getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    this.formRef.current.setFieldsValue(fields)
    this.handleSubmit()
  }
  handleChange = (key, values) => {
    const { onFilterChange } = this.props

    console.log('hande change', values)
    console.log(hi)

    let fields = this.formRef.current.getFieldsValue()

    fields[key] = values
    fields = this.handleFields(fields)

    onFilterChange(fields)
  }

  normalized = (value) => {
    return value?.format('YYYY-MM-DD')
  }

  _deboucehandleChange = debounce(this.handleChange, 500)

  render() {
    const { onAdd, filter } = this.props
    const { name, address } = filter

    let initialCreateTime = []
    if (filter.createTime && filter.createTime[0]) {
      initialCreateTime[0] = moment(filter.createTime[0])
    }
    if (filter.createTime && filter.createTime[1]) {
      initialCreateTime[1] = moment(filter.createTime[1])
    }

    return (
      <Form
        onFieldsChange={this._deboucehandleChange}
        ref={this.formRef}
        name="control-ref"
        initialValues={{}}
      >
        <Row gutter={24}>
          <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
            <Form.Item name="name">
              <Search
                placeholder={t`Search Name`}
                onSearch={this.handleSubmit}
              />
            </Form.Item>
          </Col>
          <Col
            {...ColProps}
            xl={{ span: 4 }}
            md={{ span: 8 }}
            id="addressCascader"
          ></Col>
          <Col
            {...ColProps}
            xl={{ span: 6 }}
            md={{ span: 8 }}
            sm={{ span: 12 }}
            id="createTimeRangePicker"
          ></Col>
          <Col
            {...TwoColProps}
            xl={{ span: 10 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
          >
            <Row type="flex" align="middle" justify="end">
              <Form.Item normalize={this.normalized} name="month_date">
                <DatePicker
                  locale={locale}
                  style={{ width: '100%' }}
                  picker="month"
                />
              </Form.Item>
            </Row>
          </Col>
        </Row>
      </Form>
    )
  }
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Filter
