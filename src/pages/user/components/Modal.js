import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Modal,
  Cascader,
  Row,
  Divider,
  Col,
  Space,
  DatePicker,
  Select,
} from 'antd'
import { mapSelectData, mapSelectOption } from 'utils'
import { t } from '@lingui/macro'
import moment from 'moment'
import { postRequest, getRequest } from 'services'
import configs from 'server'

const FormItem = Form.Item

const formItemLayout = {}

class UserModal extends PureComponent {
  formRef = React.createRef()

  state = { depList: [] }

  handleOk = () => {
    const { item = {}, onOk } = this.props

    this.formRef.current
      .validateFields()
      .then((values) => {
        console.log(values)
        const data = {
          ...values,
          dep_id: values?.dep.value,
          birth: values?.birth.format('YYYY-MM-DD'),
        }
        console.log(values)
        onOk(data)
      })
      .catch((errorInfo) => {
        console.log(errorInfo)
      })
  }

  _onFocus = async () => {
    try {
      const res = await getRequest(`${configs.apiUrl}dep/list`)
      if (res?.data) {
        this.setState({ depList: mapSelectOption(res.data) })
      }
    } catch (error) {
      console.log(error)
    }
  }

  render() {
    const { item = {}, onOk, form, ...modalProps } = this.props
    console.log('Modal', item)

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form
          ref={this.formRef}
          name="control-ref"
          initialValues={{
            ...item,
            birth: moment(item?.birth),
            dep: item?.dep ? mapSelectData(item?.dep) : undefined,
          }}
          layout="vertical"
        >
          <Divider orientation="left">Thông tin cá nhân</Divider>
          <Row gutter={20}>
            <Col span={12}>
              <FormItem
                name="name"
                rules={[{ required: true }]}
                label={t`Name`}
                hasFeedback
                {...formItemLayout}
              >
                <Input />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                name="phone_number"
                rules={[
                  {
                    required: true,
                    message: t`The input is not valid phone!`,
                  },
                ]}
                label={t`Phone`}
                hasFeedback
                {...formItemLayout}
              >
                <Input />
              </FormItem>
            </Col>
          </Row>

          <Row gutter={20}>
            <Col span={12}>
              <FormItem
                name="birth"
                rules={[{ required: true }]}
                label={'Ngày sinh'}
                hasFeedback
                {...formItemLayout}
              >
                <DatePicker format={'DD/MM/YY'} />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                name="sex"
                rules={[{ required: true }]}
                label={t`Giới tính`}
                hasFeedback
                {...formItemLayout}
              >
                <Radio.Group>
                  <Radio value={1}>
                    <span>Nam</span>
                  </Radio>
                  <Radio value={0}>
                    <span>Nữ</span>
                  </Radio>
                </Radio.Group>
              </FormItem>
            </Col>
          </Row>

          <FormItem
            name="address"
            label="Địa chỉ"
            hasFeedback
            {...formItemLayout}
          >
            <Input />
          </FormItem>

          <Divider orientation="left">Công ty</Divider>
          <Row gutter={20}>
            <Col span={12}>
              <FormItem
                name="dep"
                rules={[{ required: true }]}
                label="Phòng ban"
                hasFeedback
                {...formItemLayout}
              >
                <Select
                  labelInValue
                  options={this.state.depList}
                  onFocus={this._onFocus}
                />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                name="is_admin"
                rules={[
                  {
                    required: true,
                  },
                ]}
                label="Quyèn hạn"
                hasFeedback
                {...formItemLayout}
              >
                <Radio.Group>
                  <Radio value={1}>
                    <span>Quản lý</span>
                  </Radio>
                  <Radio value={0}>
                    <span>Nhân viên</span>
                  </Radio>
                </Radio.Group>
              </FormItem>
            </Col>
          </Row>

          <FormItem
            name="basic_salary"
            rules={[{ required: true }]}
            label="Lương"
            hasFeedback
            {...formItemLayout}
          >
            <InputNumber style={{ width: '100%' }} />
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

UserModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default UserModal
