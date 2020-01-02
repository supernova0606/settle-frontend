import React, { useState } from 'react';
import './Loader.css';
import {Spinner} from 'react-bootstrap';


let LOADER_DELAY = 150

function PageLoader(props) {
    let [visible, setVisibility] = useState(false);
    setTimeout(function(){setVisibility(true)}, LOADER_DELAY);

    if(!visible){
        return null
    }
    return (
        <div class="col-12 text-center">
            <div class="col-12 page-loader">
                <Spinner animation="border" variant="secondary" size="sm"/>
            </div>
        </div>
    );
}

function InlineLoader(props) {
    let [visible, setVisibility] = useState(false);
    setTimeout(function(){setVisibility(true)}, LOADER_DELAY);

    if(!visible){
        return null
    }
    return (
        <div class="col-12 text-center mx-0 px-0">
            <div class="col-12 inline-loader">
                <Spinner animation="border" variant="secondary" size="sm"/>
            </div>
        </div>
    );
}

function GlowInlineLoader(props){
    let [visible, setVisibility] = useState(false);
    setTimeout(function(){setVisibility(true)}, LOADER_DELAY);

    if(!visible){
        return null
    }
    return (
        <div class="glow-inline-loader col-12 my-3 text-center">
            <Spinner animation="grow" variant="info" size="sm"/>
            <Spinner animation="grow" variant="info" size="sm"/>
            <Spinner animation="grow" variant="info" size="sm"/>
        </div>
    );
}

export { PageLoader as Loader, InlineLoader, GlowInlineLoader};
