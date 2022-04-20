// react
import React from 'react'

// third-party
import { Helmet } from 'react-helmet-async'

// data stubs
import theme                from '../../data/theme'
import { useEffect }        from 'react'
import { url, domainUrl }   from '../../helper'
import { useSelector }      from 'react-redux'
import { useState }         from 'react'
import { FormattedMessage } from 'react-intl'



export default function AccountPageEditAddress ({ addressId, dbName }) {
  const customer = useSelector((state) => state.customer)
  const [success, setSuccess] = useState(false)
  // const [address, setAddress] = useState()
  const [successData, setSuucessData] = useState()
  const [errors] = useState()
  const [input, setInput] = useState({})
  const [address, setAddress] = useState('')
  const [appartment, setAppartment] = useState('')

  useEffect(() => {
    const abortController = new AbortController()
    const single = abortController.single
    if (addressId && customer.token) {
      fetch(
        domainUrl(`${dbName}/api/addresses/${addressId}?token=${customer.token}`),
        {
          single: single,
        },
      )
        .then((responce) => responce.json())
        .then((res) => {
          if (res.data) {
            console.log(res, 'oooo')
            setAddress(res.data.address1[0])
            setAppartment(res.data.address1[1])
            setInput({
              first_name  : res.data.first_name,
              last_name   : res.data.last_name,
              country     : res.data.country_name,
              country_name: res.data.country_name,
              address1    : [address, appartment],
              city        : res.data.city,
              state       : res.data.state,
              postcode    : res.data.postcode,
              phone       : res.data.phone,
              country_name: res.data.country,
            })
          }
        })
        .catch((err) => console.error(err))
    }

    return function cleaup () {
      abortController.abort()
    }
  }, [addressId])

  const [countryList, setCountryList] = useState()

  useEffect(() => {
    fetch(domainUrl(`${dbName}/api/countries?pagination=0`))
      .then((res) => res.json())
      .then((res) => setCountryList(res.data.reverse()))
  }, [])

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    })
  }

  const handleChangeAdd = (e) => {
    setAddress(e.target.value)
  }

  const handleChangeApp = (e) => {
    setAppartment(e.target.value)
  }

  let selectCountry

  const handleClick = (event) => {
    event.preventDefault()
    let option = {
      method : 'PUT',
      headers: {
        Accept        : 'application/json',
        'Content-Type': 'application/json',
      },
      body   : JSON.stringify({
        token     : customer.token,
        first_name: input.first_name,
        last_name : input.last_name,
        id        : addressId,
        address1  : [address, appartment],
        city      : input.city,
        // country: "AM",
        country_name: input.country_name,
        country     : input.country_name,
        phone       : input.phone,
        postcode    : input.postcode,
        state       : input.state,
        // apartment   : input.apartment,
      }),
    }
    fetch(domainUrl(`${dbName}/api/addresses/${addressId}`), option)
      .then((response) => response.json())
      .then((res) => {
        console.log(res, 'res in accountpageAditAddress')
        setSuccess(true)
        setSuucessData(res.message)
      })
  }
  //////console.log(input, "kkk");
  // if (!address) return true;

  if (countryList) {
    selectCountry = (
      <div className="select-container form-group col-md-6">
        <select
          className={
            input.country_name
              ? 'dark-opacity checkout-select checkout-input'
              : 'checkout-select checkout-input'
          }
          name="country_name"
          onChange={handleChange}
        >
          <FormattedMessage id="s" defaultMessage={input.country_name}>
            {(placeholder) => (
              <option selected="true" disabled="disabled">
                {placeholder}
              </option>
            )}
          </FormattedMessage>
          {countryList.map((option, index) => {
            return (
              <option key={index} value={option.name}>
                {option.name}
              </option>
            )
          })}
        </select>
      </div>
    )
  }
  const ErrorsOutput = () => {
    const arr = []
    for (let error in errors) {
      arr.push(<div>{errors[error]}</div>)
    }
    return arr
  }

  return (
    <div className="card">
      <Helmet>
        <title>{`Edit Address — ${theme.name}`}</title>
      </Helmet>

      <div className="card-header">
        <h5>
          <FormattedMessage id="editAddress" defaultMessage="Edit Address"/>
        </h5>
      </div>

      {errors ? <div className="alert alert-danger">{ErrorsOutput()}</div> : ''}

      {success ? <div className="alert alert-success">{successData}</div> : ''}
      <div className="card-divider"/>

      <div className="card add-new-address-body">
        {console.log(input, 'input')}
        <h5 className="address-page-title">
          <FormattedMessage
            id="add-an-address"
            defaultMessage="Add an address"
          />
        </h5>
        <div className="card-divider mb-5"/>

        <form onSubmit={handleClick}>
          <div className="card-body">
            <div className="row no-gutters">
              <div className="col-12">
                <div className="form-row">
                  <div className="form-group col-md-6">
                    <FormattedMessage
                      id="firstname.address"
                      defaultMessage="First name"
                    >
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          name="first_name"
                          value={input.first_name}
                          // defaultValue={address.first_name}
                          type="text"
                          className={
                            input.first_name
                              ? 'dark-opacity form-control checkout-input f15'
                              : 'form-control checkout-input f15'
                          }
                          id="checkout-first-name"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group col-md-6">
                    <FormattedMessage
                      id="lastname.address"
                      defaultMessage="Last name"
                    >
                      {(placeholder) => (
                        <input
                          value={input.last_name}
                          // defaultValue={address.last_name}
                          onChange={handleChange}
                          name="last_name"
                          type="text"
                          className={
                            input.last_name
                              ? 'dark-opacity form-control checkout-input f15'
                              : 'form-control checkout-input f15'
                          }
                          id="checkout-last-name"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>

                <div className="form-group">
                  <FormattedMessage
                    id="address.address"
                    defaultMessage="Address"
                  >
                    {(placeholder) => (
                      <input
                        onChange={handleChangeAdd}
                        value={address}
                        // defaultValue={address.address1}
                        name="address1"
                        type="text"
                        className={
                          address
                            ? 'dark-opacity form-control checkout-input f15'
                            : 'form-control checkout-input f15'
                        }
                        id="checkout-street-address"
                        placeholder={placeholder}
                      />
                    )}
                  </FormattedMessage>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <FormattedMessage
                      id="account.apartment"
                      defaultMessage="Apartment, suite"
                    >
                      {(placeholder) => (
                        <input
                          onChange={handleChangeApp}
                          name="apartment"
                          value={appartment}
                          // defaultValue={address.apartment}
                          type="text"
                          className={
                            appartment
                              ? 'dark-opacity form-control checkout-input f15'
                              : 'form-control checkout-input f15'
                          }
                          id="checkout-apartment"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group col-md-6">
                    <FormattedMessage id="city.address" defaultMessage="City">
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          name="city"
                          value={input.city}
                          // defaultValue={address.city}
                          type="text"
                          className={
                            input.city
                              ? 'dark-opacity form-control checkout-input f15'
                              : 'form-control checkout-input f15'
                          }
                          id="checkout-city"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>

                <div className="form-row">
                  {selectCountry}

                  <div className="form-group col-md-6">
                    <FormattedMessage id="state.address" defaultMessage="State">
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          name="state"
                          value={input.state}
                          // defaultValue={address.state}
                          type="text"
                          className={
                            input.state
                              ? 'dark-opacity form-control checkout-input f15'
                              : 'form-control checkout-input f15'
                          }
                          id="checkout-state"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <FormattedMessage
                      id="account.postal"
                      defaultMessage="Postal Code"
                    >
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          // defaultValue={address.postcode}
                          value={input.postcode}
                          name="postcode"
                          type="text"
                          className={
                            input.postcode
                              ? 'dark-opacity form-control checkout-input f15'
                              : 'form-control checkout-input f15'
                          }
                          id="checkout-postcode"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className="form-group col-md-6">
                    <FormattedMessage
                      id="phonenumber.address"
                      defaultMessage="Phone number"
                    >
                      {(placeholder) => (
                        <input
                          onChange={handleChange}
                          // defaultValue={address.phone}
                          value={input.phone}
                          name="phone"
                          type="text"
                          className={
                            input.phone
                              ? 'dark-opacity form-control checkout-input f15'
                              : 'form-control checkout-input f15'
                          }
                          id="checkout-phone"
                          placeholder={placeholder}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>

                <div className="form-group mt-3 mb-0">
                  <button className="btn btn-primary btn-lg f15" type="submit">
                    <FormattedMessage id="save" defaultMessage="Save"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
