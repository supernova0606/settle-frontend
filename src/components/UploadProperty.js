import React, { useState, useEffect } from 'react';
import './UploadProperty.css';
import { useHistory } from 'react-router';
import { useGlobalState, useLocalState } from 'simple-react-state';
import {
    Select, FeaturesInput, ImageUploader,
    MultipleImageUploader, Loader
} from './';
import { API_URL } from '../';
import { getPropertyRoute } from '../utils';


let initialData = {
    amenities: {"add": []},
    service: {"add": []},
    potentials: {"add": []},
    main_picture: [],
    other_pictures: [],
    other_features: []
}


function UploadProperty(props){
    let history = useHistory();
    let [fields, setFields] = useLocalState(initialData);
    let [user, ] = useGlobalState("user");

    let currencies = ["TZS", "USD"];
    let countries = ["Tanzania", "Kenya", "Uganda", "Zambia", "Zanzibar"];

    let postImages = (propertyID, pictures) => {
        if(pictures.length === 0){
            return history.push(`/${getPropertyRoute(props.type)}/${propertyID}`);
        }
        let img = pictures.pop();
        let postData = new FormData();
        postData.append("property", propertyID)
        postData.append("is_main", Number(img.is_main))
        postData.append("tool_tip", img.tool_tip)
        postData.append("src", img.src)

        let postUrl = `${API_URL}/pictures/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`
        }
        fetch(postUrl, {method: 'POST', body: postData, headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => postImages(propertyID, pictures))
        .catch(error => console.log(error));
    }

    let updatePropertyImages = (response) => {
        if(response.status !== 201){
            // Report error
            return
        }
        let id = response.data.id;
        let pictures = [...fields.main_picture, ...fields.other_pictures]
        postImages(id, pictures)
    }

    let createProperty = (e) => {
        e.preventDefault();
        let form = e.target
        let formData = {
            available_for: form.available_for.value,
            price: form.price.value,
            currency: form.currency.value,
            location: {
                country: form.country.value,
                region: form.region.value,
                distric: form.distric.value,
                street1: form.street1.value,
                street2: form.street2.value
            },
            contact: {
                name: form.full_name.value,
                email: form.email.value,
                phone: form.phone.value
            },
            amenities: {
                "add": fields.amenities.add
            },
            services: {
                "add": fields.services.add
            },
            potentials: {
                "add": fields.potentials.add
            },
            other_features: {
                "create": fields.other_features
            }
        }

        let postUrl = `${API_URL}/${getPropertyRoute(props.type)}/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`,
            'Content-Type': 'application/json'
        }
        fetch(postUrl, {method: 'POST', body: JSON.stringify(formData), headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => updatePropertyImages(obj))
        .catch(error => alert(error));
    }

    let updateValue = (e) => {
        setFields({
            field: e.target.name,
            value: e.target.value
        })
    }

    let optionName = (opt) => {
        return opt.name
    }

    let optionValue = (opt) => {
        return opt.id
    }

    let updateSelection = (target) => {
        setFields({
            field: target.name,
            value: target.values
        })
    }

    let updateOtherImages = (value) => {
        setFields({
            field: 'other_pictures',
            "value": value
        })
    }

    let updateMainImage = (value) => {
        setFields({
            field: 'main_picture',
            "value": value
        })
    }

    let updateFeatures = (features) => {
        setFields({
            field: 'other_features',
            value: features
        })
    }

    return (
        <div class="custom-container mt-2 mt-sm-3">
            <form class="property-form text-secondary px-3 px-sm-4" onSubmit={createProperty}>
                <div class="row">
                    <div class="col-12 col-md-6">

                            <div class="row p-0 m-0 my-0 my-lg-1">
                                <label class="form-check-label col-12 p-0 m-0">Available for</label>
                                <div class="col-12 p-0 m-0 my-1">
                                    <select class="custom-select" name="available_for" value={fields.available_for} onChange={updateValue} required>
                                        <option value="" disabled selected>Select Category</option>
                                        <option value="rent">Rent</option>
                                        <option value="sale">Sale</option>
                                        <option value="book">Book</option>
                                    </select>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <label class="form-check-label col-12 p-0 m-0">Pricing</label>
                                <div class="col-12 p-0 m-0 my-1">
                                    <div class="row">
                                        <div class="col-8 pr-1">
                                            <input type="number" name="price" value={fields.price} onChange={updateValue}
                                                class="form-control" placeholder="Price" required/>
                                        </div>
                                        <div class="col-4 pl-1">
                                            <select class="custom-select" name="currency" value={fields.currency} onChange={updateValue} required>
                                                <option value="" disabled selected>Currency</option>
                                                {currencies.map((currency)=><option  value={currency}>{currency}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <label class="form-check-label col-12 p-0 m-0">Location</label>
                                <div class="col-12 p-0 m-0 my-1">
                                    <select class="custom-select" name="country" value={fields.country} onChange={updateValue}>
                                        <option value="" disabled selected>Country</option>
                                        {countries.map((country)=><option value={country}>{country}</option>)}
                                    </select>
                                </div>
                                <div class="col-12 p-0 m-0 my-1">
                                    <div class="row">
                                        <div class="col pr-1">
                                            <input type="text" name="region" value={fields.region} onChange={updateValue}
                                            class="form-control" placeholder="Region" />
                                        </div>
                                        <div class="col pl-1">
                                            <input type="text" name="distric" value={fields.distric} onChange={updateValue}
                                            class="form-control" placeholder="Distric" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 p-0 m-0 my-1">
                                    <div class="row">
                                        <div class="col pr-1">
                                            <input type="text" name="street1" value={fields.street1} onChange={updateValue}
                                            class="form-control" placeholder="Street1" />
                                        </div>
                                        <div class="col pl-1">
                                            <input type="text" name="street2" value={fields.street2} onChange={updateValue}
                                            class="form-control" placeholder="Street2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="my-4">
                                <label class="form-check-label col-12 p-0 m-0">Features</label>
                                <div class="row mt-1 mb-3">
                                    <div class="col-12">
                                        <Select className="custom-select" name="amenities" options={props.options.amenities} onChange={updateSelection}
                                         optionName={optionName} optionValue={optionValue} placeholder="Amenities"/>
                                    </div>
                                </div>

                                <div class="row my-3 my-lg-3">
                                    <div class="col-12">
                                        <Select className="custom-select" name="services" options={props.options.services} onChange={updateSelection}
                                         optionName={optionName} optionValue={optionValue} placeholder="Services"/>
                                    </div>
                                </div>

                                <div class="row my-3 my-lg-3">
                                    <div class="col-12">
                                        <Select className="custom-select" name="potentials" options={props.options.potentials} onChange={updateSelection}
                                        optionName={optionName} optionValue={optionValue} placeholder="Potentials"/>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12 p-0 m-0 my-4">
                                <FeaturesInput label="Add Other Features" onChange={updateFeatures} value={fields.other_features}/>
                            </div>
                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-check-label col-12 p-0 m-0 my-1">Main Picture</label>
                        <ImageUploader name="main_picture" onChange={updateMainImage} />
                        <hr class="line p-0 m-0 my-2"/>

                        <label class="form-check-label col-12 p-0 m-0 my-1">Other Pictures</label>
                        <MultipleImageUploader name="other_pictures" onChange={updateOtherImages}/>
                        <hr class="line p-0 m-0 my-2"/>

                        <div class="row p-0 m-0 my-4">
                            <label class="form-check-label col-12 p-0 m-0">Contact</label>
                            <div class="col-12 my-1 px-0">
                                <input type="text" name="phone" value={fields.phone} onChange={updateValue}
                                class="form-control" placeholder="Phone Number" required/>
                            </div>
                            <div class="col-12 my-1">
                                <div class="row">
                                    <div class="col m-0 p-0 pr-1">
                                        <input type="text" name="full_name" value={fields.name} onChange={updateValue}
                                        class="form-control" placeholder="Name" required/>
                                    </div>
                                    <div class="col m-0 p-0 pl-1">
                                        <input type="text" name="email" value={fields.email} onChange={updateValue}
                                        class="form-control" placeholder="Email" required/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row p-0 m-0 justify-content-center mt-4">
                    <button type="submit" class="col-12 col-sm-6 btn btn-info">Submit</button>
                </div>

            </form>
        </div>
    )
}

function OptionsFetcher(props) {
    let [amenities, setAmenities] = useState(null);
    let [services, setServices] = useState(null);
    let [potentials, setPotentials] = useState(null);
    let fetchOptions = () => {
        fetch(`${API_URL}/amenities/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setAmenities(results.results))
        .catch(error => console.log(error));

        fetch(`${API_URL}/services/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setServices(results.results))
        .catch(error => console.log(error));

        fetch(`${API_URL}/potentials/?query={id,name}&format=json`)
        .then(res => res.json())
        .then(results => setPotentials(results.results))
        .catch(error => console.log(error));
    }
    useEffect(fetchOptions, []);
    let options = {
        amenities: amenities,
        services: services,
        potentials: potentials
    }

    return (
        amenities !== null && services !== null && potentials !== null?
            <UploadProperty options={options} {...props}/>:
            <Loader/>
    );
}


export { OptionsFetcher as UploadProperty }
