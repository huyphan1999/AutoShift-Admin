import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  Table,
  Modal,
  Card,
  Button,
  Switch,
  Input,
  Row,
  Col,
  Space,
  Form,
} from 'antd'

import { postRequest, getRequest } from 'services'
import configs from 'server'
import { thru } from 'lodash'

class Wificonfig extends PureComponent {
  formRef = React.createRef()

  constructor(props) {
    super(props)
    this.state = {
      wifi: this.props.wifi,
      loading: false,
      require: this.props?.wifi?.require,
    }
  }

  onSwitchChange = (checked) => {
    this.setState({ require: checked })
  }

  handleOk = () => {
    this.formRef.current
      .validateFields()
      .then((values) => {
        this.setState({ loading: true })
        const { config } = this.props
        const data = {
          ...config,
          wifi: { ...values, require: this.state.require },
        }
        postRequest(`${configs.apiUrl}timekeep/update`, data)
      })
      .then((res) => {
        this.setState({ loading: false })
      })
      .catch((errorInfo) => {
        console.log(errorInfo)
      })
  }

  render() {
    const { wifi } = this.state
    return (
      <Form
        ref={this.formRef}
        name="config-ref"
        initialValues={{
          ...wifi,
        }}
        layout="horizontal"
      >
        <Card
          style={{ width: '100%' }}
          title="Wifi Configuation"
          extra={
            <Switch
              onChange={this.onSwitchChange}
              checked={this.state?.require}
            />
          }
        >
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true }]}
                hasFeedback
                name="ssid"
                label="SSID"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={[{ required: true }]}
                hasFeedback
                name="bssid"
                label="BSSID"
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row align="middle" justify="center">
            <Button onClick={this.handleOk} type="primary">
              Save
            </Button>
          </Row>
        </Card>
      </Form>
    )
  }
}

export default Wificonfig
