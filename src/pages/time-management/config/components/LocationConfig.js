import React from 'react'
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Autocomplete,
} from '@react-google-maps/api'
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete'

import './LocationConfig.less'
import Geocode from 'react-geocode'
import { postRequest, getRequest } from 'services'
import configs from 'server'

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

const mapStyles = {
  height: '60vh',
  width: '100%',
}

const API_KEY = 'AIzaSyDejMEw7iAaAFt7QvmHDhiY1NpZK7R-MRw'
// const API_KEY = 'AIzaSyBwGBUooyjN3J92BzumOmkwlI25lKtmK_E'

Geocode.setApiKey(`${API_KEY}`)
Geocode.setLanguage('vi')
Geocode.setRegion('vi')
Geocode.enableDebug()

class LocationConfig extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      location: {
        lat: props?.location?.lat ? props?.location?.lat : 10.523153,
        lng: props?.location?.long ? props?.location?.long : 106.716475,
      },
      address: props?.location?.address ? props?.location?.address : '',
      search: '',
      viewInfo: false,
      copied: false,
      loading: false,
      require: this.props?.location?.require,
      // markers: [],
    }
  }

  onSwitchChange = (checked) => {
    this.setState({ require: checked })
  }

  handleChange = (search) => {
    this.setState({ location: this.state.location, search: search })
  }

  onSave = async () => {
    const { config, location: oldLocation } = this.props
    const {
      require,
      address,
      location: { lat, lng },
    } = this.state
    const newLocation = { ...oldLocation, require, address, lat, long: lng }
    const data = { ...config, location: newLocation }
    try {
      this.setState({ loading: true })
      await postRequest(`${configs.apiUrl}timekeep/update`, data)
      this.setState({ loading: false })
    } catch (error) {
      console.log(error)
    }
  }

  handleSelect = (newAddress) => {
    console.log('handleSelect', newAddress)
    this.setState({ location: this.state.location, search: newAddress })
    geocodeByAddress(newAddress)
      .then((results) => {
        console.log('handleSelect', results)
        // getLatLng(results[0])
        const lat = results[0]?.geometry?.location.lat()
        const lng = results[0]?.geometry?.location.lng()
        this.setState({
          location: { lat, lng },
          address: this.state.address,
        })
        this.getAddress()
      })
      // .then((latLng) => {
      //   console.log('handleSelect', latLng)
      //   this.setState({ location: latLng, address: this.state.address })
      //   this.getAddress()
      // })
      .catch((error) => console.error('Error', error))
  }

  getAddress = () => {
    Geocode.fromLatLng(this.state.location.lat, this.state.location.lng).then(
      (response) => {
        const address = response.results[0].formatted_address
        this.setState({ ...this.state, address: address, copied: false })
      },
      (error) => {
        console.error(error)
      }
    )
  }

  onMarkerDragEnd = (e) => {
    const lat = e.latLng.lat()
    const lng = e.latLng.lng()
    this.setState({ location: { lat, lng }, copied: false })
    this.getAddress()
  }

  componentDidMount() {
    if (!navigator.geolocation) {
      alert('Allow to track your loaction')
      return
    }

    // navigator.geolocation.getCurrentPosition(
    //   (position) => {
    //     this.setState({
    //       location: {
    //         lat: position.coords.latitude,
    //         lng: position.coords.longitude,
    //       },
    //       markers: [
    //         {
    //           text: 'Current Location',
    //           lat: position.coords.latitude,
    //           lng: position.coords.longitude,
    //         },
    //       ],
    //     })

    //     this.getAddress()
    //   },
    //   (error) => {
    //     alert(JSON.stringify(error))
    //   },
    //   {
    //     enableHighAccuracy: true,
    //     timeout: 20000,
    //     maximumAge: 1000,
    //   }
    // )
  }
  render() {
    console.log(this.state)
    return (
      <Card
        style={{ width: '100%', height: '100%' }}
        title="Thiết lập ví trí chấm công"
        extra={
          <Switch onChange={this.onSwitchChange} checked={this.state.require} />
        }
      >
        <LoadScript libraries={['places']} googleMapsApiKey={API_KEY}>
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={16}
            center={this.state.location}
          >
            <Marker
              onClick={() => this.setState({ ...this.state, viewInfo: true })}
              position={this.state.location}
              draggable={true}
              onDragEnd={(e) => this.onMarkerDragEnd(e)}
            />
            {/* {this.state.markers.map((mark, index) => {
							// if (index)
							return (
								<Marker
									key={index}
									// onClick={() => this.setState({...this.state, viewInfo: true})}
									position={{lat: mark.lat, lng: mark.lng}}
									// draggable={true}
									// onDragEnd={(e) => this.onMarkerDragEnd(e)}
								/>
							);
						})} */}
            {this.state.viewInfo ? (
              <InfoWindow
                position={this.state.location}
                onCloseClick={() =>
                  this.setState({ ...this.state, viewInfo: false })
                }
              >
                <p>{this.state.address}</p>
              </InfoWindow>
            ) : (
              ''
            )}
          </GoogleMap>
          <PlacesAutocomplete
            value={this.state.search}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({
              getInputProps,
              suggestions,
              getSuggestionItemProps,
              loading,
            }) => (
              <div className="App__input">
                <input
                  {...getInputProps({
                    placeholder: 'Search Places ...',
                    className: 'location-search-input',
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && (
                    <div style={{ fontSize: 'bold', textAlign: 'center' }}>
                      Loading...
                    </div>
                  )}
                  {suggestions.map((suggestion, index) => {
                    const className = suggestion.active
                      ? 'suggestion-active'
                      : 'suggestion-item'
                    const style = suggestion.active
                      ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                      : { backgroundColor: '#ffffff', cursor: 'pointer' }
                    return (
                      <div
                        key={index}
                        {...getSuggestionItemProps(suggestion, {
                          className,
                          style,
                        })}
                      >
                        <span>{suggestion.description}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <div className="App__Address">
            <Space align="center">
              {this.state.address.length === 0
                ? 'This Site request a location Access,Enable it to get your current Location'
                : this.state.address}
            </Space>
          </div>
          <div className="App__Button">
            <Button
              onClick={this.onSave}
              type="primary"
              loading={this.state.loading}
            >
              Lưu
            </Button>
          </div>
        </LoadScript>
      </Card>
    )
  }
}

export default LocationConfig
