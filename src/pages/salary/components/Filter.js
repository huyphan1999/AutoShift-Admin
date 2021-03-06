import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { FilterItem } from 'components'
import { Trans } from '@lingui/macro'
import { t } from '@lingui/macro'
import { Button, Row, Col, DatePicker, Form, Input, Space } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import debounce from 'lodash/debounce'

const { Search } = Input
const { RangePicker } = DatePicker

const ColProps = {
  xs: 24,
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
          fields[item] = this.normalized(fields[item])
        }
      }
    }
    return fields
  }

  handleChange = () => {
    const { onFilterChange } = this.props
    let fields = this.formRef.current.getFieldsValue()
    fields = this.handleFields(fields)

    console.log('onFilterChange', fields)
    onFilterChange(fields)
  }

  normalized = (value) => {
    return value?.format('YYYY-MM')
  }

  _deboucehandleChange = debounce(this.handleChange, 500)

  render() {
    const { onAdd, filter } = this.props
    const { name, address, month_date } = filter

    return (
      <Form
        onFieldsChange={this._deboucehandleChange}
        ref={this.formRef}
        name="control-ref"
      >
        <Row gutter={24}>
          <Col {...ColProps} sm={6} lg={4}>
            <Form.Item
              initialValue={
                month_date
                  ? moment(month_date, 'YYYY-MM')
                  : moment().subtract(1, 'month')
              }
              name="month_date"
            >
              <DatePicker
                locale={locale}
                style={{ width: '100%' }}
                picker="month"
                format={(value) => `Tháng ${value.format('MM/YYYY')}`}
              />
            </Form.Item>
          </Col>
          <Col {...ColProps} lg={6}>
            <Form.Item name="name">
              <Search
                placeholder={t`Tìm theo tên`}
                onSearch={this.handleSubmit}
              />
            </Form.Item>
          </Col>

          <Col {...ColProps} lg={14}>
            <Row type="flex" align="middle" justify="end">
              <Button
                style={{ marginBottom: 24 }}
                type="primary"
                onClick={onAdd}
              >
                <span> Tạo bảng lương</span>
              </Button>
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
