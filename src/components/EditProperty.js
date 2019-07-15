import React, { useRef, useState } from 'react';
import './EditProperty.css';
import {withRouter} from 'react-router-dom';
import {useGlobal} from 'reactn';
import {Select, FeaturesInput, Fetcher, Loader, Block} from './';
import {API_URL} from '../';
import { useLocalState } from '../hooks';

let options = [
    {id: 1, name: "one"},
    {id: 2, name: "two"},
    {id: 3, name: "three"},
    {id: 4, name: "four"},
    {id: 5, name: "five"},
    {id: 6, name: "six"}
];


function EditProperty(props){
    let [fields, updateFields] = useLocalState(props.property);
    let [user, ] = useGlobal("User");
    let currencies = ["TZS", "USD"];
    let countries = ["Tanzania", "Kenya", "Uganda", "Zambia", "Zanzibar"];
    let categories = ["rent", "sell", "book" ];
    let types = ["room", "house", "apartment", "land", "frame", "office"];

    let postImages = (propertyID, pictures) => {
        if(pictures.length === 0){
            // Render property
            props.history.push(`/property/${propertyID}`);
            return
        }
        let img = pictures.pop();
        let postData = new FormData();
        postData.append("property", propertyID)
        postData.append("is_main", Number(img.is_main))
        postData.append("tool_tip", img.tool_tip)
        postData.append("src", img.src)

        let postUrl = `${API_URL}/picture/`;
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

    let updateLocation = (location) => {
        let locationID = fields.location.id;
        let postUrl = `${API_URL}/location/${locationID}/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`,
            'Content-Type': 'application/json'
        }
        return fetch(postUrl, {method: 'PUT', body: JSON.stringify(location), headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => obj)
        .catch(error => console.log(error));
    }

    let updateContact = (contact, ob) => {
        let contactID = fields.contact.id;
        let postUrl = `${API_URL}/contact/${contactID}/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`,
            'Content-Type': 'application/json'
        }
        return fetch(postUrl, {method: 'PUT', body: JSON.stringify(contact), headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => obj)
        .catch(error => console.log(error));
    }

    let createProperty = (e) => {
        e.preventDefault();
        let form = e.target
        let formData = {
            category: form.category.value,
            price: form.price.value,
            currency: form.currency.value,
        }

        let location = {
            country: form.country.value,
            region: form.region.value,
            distric: form.distric.value,
            street1: form.street1.value,
            street2: form.street2.value
        }

        let contact = {
            name: form._name.value,
            email: form.email.value
            //phones: [form.phone.value]
        }

        let amenities = JSON.parse(form.amenities.value)
        let services = JSON.parse(form.services.value)
        let potentials = JSON.parse(form.potentials.value)
        let other_features = fields.other_features

        let postUrl = `${API_URL}/${form.type.value}/${fields.id}/`;
        let headers = {
            'Authorization': `Token ${user.authToken}`,
            'Content-Type': 'application/json'
        }
        fetch(postUrl, {method: 'PUT', body: JSON.stringify(formData), headers: headers})
        .then(res =>  res.json().then(data => ({status: res.status, data: data})))
        .then(obj => updateLocation(location))
        .then(obj => updateContact(contact, obj))
        .then(obj => props.history.push(`/edit-property/${fields.id}`))
        //.then(obj => updatePropertyImages(obj))
        .catch(error => console.log(error));
    }

    let updateValue = (e) => {
        updateFields({
            field: e.target.getAttribute("data-field"),
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
        updateFields({
            field: target.name,
            value: target.selected
        })

    }

    let updateOtherImages = (value) => {
        updateFields({
            field: "other_pictures",
            value: value
        })
    }

    let updateMainImage = (value) => {
        updateFields({
            field: "main_picture",
            value: value
        })
    }

    let updateFeatures = (features) => {
        updateFields({
            field: "other_features",
            value: features
        })
    }

    return (
        <div class="custom-container">
            <form class="property-form text-secondary" onSubmit={createProperty}>
                <div class="row">
                    <div class="col-12 col-md-6 justify-content-center ">

                            <div class="row p-0 m-0 my-2 my-lg-1">
                                <label class="form-check-label col-12 px-2">Property type</label>
                                <div class="col-12 my-1 px-2">
                                    <select class="custom-select" data-field="type" name="type" value={fields.type} onChange={updateValue} required>
                                        <option value="" disabled selected>Select Type</option>
                                        {types.map((type)=><option value={type}>{type}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-2 my-lg-1">
                                <label class="form-check-label col-12 px-2">Available for</label>
                                <div class="col-12 my-1 px-2">
                                    <select class="custom-select" data-field="category" name="category" value={fields.category} onChange={updateValue} required>
                                        <option value="" disabled selected>Select Category</option>
                                        {categories.map((category)=><option value={category}>{category}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-0 my-lg-3">
                                <label class="form-check-label col-12 px-2">Pricing</label>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-8 px-2">
                                            <input type="number" data-field="price" name="price" value={fields.price} onChange={updateValue}
                                                class="form-control" placeholder="Price" required/>
                                        </div>
                                        <div class="col-4 px-2">
                                            <select class="custom-select" data-field="currency" name="currency" value={fields.currency} onChange={updateValue} required>
                                                <option value="" disabled selected>Currency</option>
                                                {currencies.map((currency)=><option  value={currency}>{currency}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Location</label>
                                <div class="col-12 my-1 px-2">
                                    <select class="custom-select" data-field="location.country" name="country" value={fields.location.country} onChange={updateValue}>
                                        <option value="" disabled selected>Country</option>
                                        {countries.map((country)=><option value={country}>{country}</option>)}
                                    </select>
                                </div>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-6 px-2">
                                            <input type="text" data-field="location.region" name="region" value={fields.location.region} onChange={updateValue}
                                            class="form-control" placeholder="Region" />
                                        </div>
                                        <div class="col-6 px-2">
                                            <input type="text" data-field="location.distric" name="distric" value={fields.location.distric} onChange={updateValue}
                                            class="form-control" placeholder="Distric" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 my-1">
                                    <div class="row">
                                        <div class="col-6 px-2">
                                            <input type="text" data-field="location.street1" name="street1" value={fields.location.street1} onChange={updateValue}
                                            class="form-control" placeholder="Street1" />
                                        </div>
                                        <div class="col-6 px-2">
                                            <input type="text" data-field="location.street2" name="street2" value={fields.location.street2} onChange={updateValue}
                                            class="form-control" placeholder="Street2" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Amenities</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" name="amenities" options={fields.amenities} onChange={updateSelection}
                                     value={fields.amenities} optionName={optionName} optionValue={optionValue} placeholder="Select Amenity"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Services</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" name="services" options={fields.services} onChange={updateSelection}
                                     value={fields.services} optionName={optionName} optionValue={optionValue} placeholder="Select Service"/>
                                </div>
                            </div>

                            <div class="row col-12 p-0 m-0 my-2 my-lg-3">
                                <label class="form-check-label col-12 px-2">Potentials</label>
                                <div class="col-12 px-2">
                                    <Select class="custom-select" name="potentials" options={fields.potentials} onChange={updateSelection}
                                      value={fields.potentials} optionName={optionName} optionValue={optionValue} placeholder="Select Potential"/>
                                </div>
                            </div>

                            <div class="row p-0 m-0 my-4">
                                <FeaturesInput label="Add Other Features" onChange={updateFeatures}
                                value={fields.other_features}/>
                            </div>

                    </div>

                    <div class="col-12 col-md-6">
                        <label class="form-check-label col-12 p-0 m-0 px-0 mt-1">Main Picture</label>
                        <ImageUploader name="main_picture" src={fields.pictures.filter(img=>img.is_main)[0]} onChange={updateMainImage} />
                        <hr class="mx-0 mx-lg-0"/>
                        <label class="form-check-label col-12 p-0 m-0 px-0 mt-1">Other Pictures</label>
                        <MultipleImageUploader name="other_pictures" src={fields.pictures} onChange={updateOtherImages}/>
                        <hr class="mx-0 mx-lg-0"/>
                        <div class="row p-0 m-0 my-2 my-lg-3">
                            <label class="form-check-label col-12 px-0">Contact</label>
                            <div class="col-12 my-1 px-0">
                                <input type="text" data-field="contact.phone" name="phone" value={fields.contact.phone} onChange={updateValue}
                                class="form-control" placeholder="Phone Number" />
                            </div>
                            <div class="col-12 my-1">
                                <div class="row">
                                    <div class="col m-0 p-0 pr-1">
                                        <input type="text" data-field="contact.name" name="_name" value={fields.contact.name} onChange={updateValue}
                                        class="form-control" placeholder="Name" />
                                    </div>
                                    <div class="col m-0 p-0 pl-1">
                                        <input type="text" data-field="contact.email" name="email" value={fields.contact.email} onChange={updateValue}
                                        class="form-control" placeholder="Email" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row justify-content-center">
                    <button type="submit" class="btn btn-info mt-4 col-11 col-sm-6">Save</button>
                </div>

            </form>
        </div>
    )
}

function ImageUploader(props){
    let image = (props.src&&props.src.src)||null;
    let [preview, setPreview] = useState(image)
    let fileInput = useRef(null);

    let loadFile = (e) => {
        if(props.onChange !== undefined){
            let value = [{src: e.target.files[0], is_main: true}]
            props.onChange(value);
        }
        let src = URL.createObjectURL(e.target.files[0]);
        setPreview(src)
    }

    let removeImg = (e) => {
        fileInput.current.value = null;
        setPreview(null)
        if(props.onChange !== undefined){
            let value = []
            props.onChange(value);
        }
    }

    return (
        <div class="row p-0 m-0 mt-3 mt-md-1 justify-content-center">
            {preview !== null?
                <div class="remove-img col-12">
                    <i class="far fa-times-circle" onClick={removeImg}></i>
                </div>:
                null
            }
            <div class="main-img">
                <img class="main-img-preview" src={preview} alt=""/>
            </div>
            <input ref={fileInput} type="file" name={props.name} id={props.name} class="file-input" onChange={loadFile}/>
            {preview === null?
                <label for={props.name} class="file-input-label">
                    <div class="upload-main-img d-flex flex-column align-content-center justify-content-center flex-wrap">
                        <div>Upload main image</div>
                        <div class="d-flex flex-row justify-content-end">
                            <span class="camera fa fa-camera"/>
                            <span class="plus fa fa-plus"/>
                        </div>
                    </div>
                </label>:
                null
            }
        </div>
    );
}


function MultipleImageUploader(props){
    let images = []
    if(props.src !== undefined){
        props.src.map(img=>{
            img.value = null;
        })
        images = props.src
    }

    let [files, updateFiles] = useLocalState([...images]);

    let loadFile = (e) => {
        let src = URL.createObjectURL(e.target.files[0]);
        updateFiles({
            action: "push",
            value: {src: src, value: e.target.files[0]}
        });
        if(props.onChange !== undefined){
            let value = files.map(file=>({src: file.value, is_main: false}))
            props.onChange(value);
            //props.onChange({create: [], delete: []})
        }
    }

    let removeImg = (img) => {
        updateFiles({
            action: "remove",
            value: img
        })

        if(props.onChange !== undefined){
            let value = files.map(file=>({src: file.value, is_main: false}))
            props.onChange(value);
            //props.onChange({create: [], delete: []})
        }
    }

    return (
        <div class="row p-0 m-0 mt-3 mt-md-1 justify-content-start">
            {files.map(img =>
                <Block>
                    <div class="col-6 col-sm-6 col-md-6 col-lg-4 py-1 px-1 m-0">
                        <div class="col-12 p-0 m-0">
                            <div class="other-img col-12">
                                <i class="remove-other-img far fa-times-circle" onClick={(e)=>{removeImg(img)}}></i>
                                <img src={img.src} alt="" />
                            </div>
                        </div>
                    </div>
                </Block>
            )}
            <label for={props.name} class="other-file-input-label">
                <div class="upload-other-img d-flex flex-column align-content-center justify-content-center flex-wrap">
                    <div class="d-flex flex-row justify-content-end mt-2">
                        <span class="camera fa fa-camera"/>
                        <span class="plus fa fa-plus"/>
                    </div>
                </div>
            </label>
            <input type="file" name={props.name} class="file-input" id={props.name} onChange={loadFile}/>
        </div>
    );
}


function PropertyFetcher(props){
    let fetchProperty = () => {
        return fetch(`${API_URL}/room/${props.id}/?
            query={
                id,
                category,
                price,
                currency,
                location{
                    region,
                    country
                },
                rating,
                payment_terms,
                unit_of_payment_terms,
                amenities,
                services,
                potentials,
                pictures{
                    id,
                    is_main,
                    src
                },
                other_features{
                    feature{
                        name
                    },
                    value
                }
            }&format=json`
        )
        .then(res => res.json())
        .then(results => results)
        .catch(error => console.log(error))
    }


    return (
        <Fetcher action={fetchProperty} placeholder={Loader()}>{property => {
            return <EditProperty property={property}/>
        }}</Fetcher>
    );
}

const comp = withRouter(PropertyFetcher);

export { comp as EditProperty }
