import { buildUrlWithParams } from './index'

export async function postRequest(url, data) {
  console.log('post Request', url, data)
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${global.token}`,
    },
    body: JSON.stringify(data),
  })

  const json = await response.json()

  console.log('post Request res', json)

  // console.log(hi)
  return Promise.resolve(json)

  if (json.error_code == 0) {
    return Promise.resolve(json)
  } else {
    let { message, error_code } = json
    return Promise.reject({
      success: false,
      statusCode: error_code,
      message,
    })
  }
}

export async function getRequest(url, params) {
  const getUrl = buildUrlWithParams(url, params)
  console.log('get Request', getUrl, params)
  const response = await fetch(getUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${global.token}`,
    },
  })
  const json = await response.json()

  return Promise.resolve(json)

  console.log('get Request res', response, json)
  if (json.error_code == 0) {
    return Promise.resolve(json)
  } else {
    let { message, error_code } = json

    return Promise.reject({
      success: false,
      statusCode: error_code,
      message,
    })
  }
}
