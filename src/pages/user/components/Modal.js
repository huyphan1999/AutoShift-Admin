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
import { Trans } from '@lingui/macro'
import city from 'utils/city'
import { t } from '@lingui/macro'

const FormItem = Form.Item

const formItemLayout = {}

class UserModal extends PureComponent {
  formRef = React.createRef()

  handleOk = () => {
    const { item = {}, onOk } = this.props

    this.formRef.current
      .validateFields()
      .then((values) => {
        const data = {
          ...values,
          key: item.key,
        }
        data.address = data.address.join(' ')
        onOk(data)
      })
      .catch((errorInfo) => {
        console.log(errorInfo)
      })
  }

  render() {
    const { item = {}, onOk, form, ...modalProps } = this.props

    return (
      <Modal {...modalProps} onOk={this.handleOk}>
        <Form
          ref={this.formRef}
          name="control-ref"
          initialValues={{
            ...item,
            address: item.address && item.address.split(' '),
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
                name="phone"
                rules={[
                  {
                    required: true,
                    pattern: /^1[34578]\d{9}$/,
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
                  <Radio value>
                    <span>Nam</span>
                  </Radio>
                  <Radio value={false}>
                    <span>Nữ</span>
                  </Radio>
                </Radio.Group>
              </FormItem>
            </Col>
          </Row>

          <FormItem
            name="address"
            rules={[{ required: true }]}
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
                <Select />
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                name="role"
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
                  <Radio value>
                    <span>Quản lý</span>
                  </Radio>
                  <Radio value={false}>
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
