import React, { useEffect, useState } from 'react';
import { } from 'react-router-dom';
import './ImageUploader.css';
import { useLocalState } from 'state-pool';
import { Modal } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import { cropImage } from '../utils';
import 'react-image-crop/lib/ReactCrop.scss';


function ImageUploader(props) {
    let images = props.src || []
    images = images.map(img => ({ img_link: img.src, img: img }))
    const [files, updateFiles] = useLocalState(images);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [imageToCropDimensions, setImageToCropDimensions] = useState({
        width: 0,
        height: 0
    });
    const [crop, setCrop] = useState({
        unit: '%',
        aspect: 1.5,
        width: 100,
        height: 100,
        x: 0,
        y: 0
    });

    // Trigger sythentic onChange event when files is updated
    useEffect(() => {
        if (props.onChange !== undefined) {
            let value = files.map(file => file.img)
            props.onChange(value);
        }
    }, [files]);

    let addImage = (e) => {
        let file = e.target.files[0];
        // Reset file input
        e.target.value = null;
        // Reset crop dimensions
        setCrop({
            unit: '%',
            aspect: 1.5,
            width: 100,
            height: 100,
            x: 0,
            y: 0
        });

        setImageToCrop(file);
    }

    let removeImg = (img) => {
        updateFiles(draftFiles => {
            return files.filter(file => file !== img);
        })

        if (props.onDelete !== undefined) {
            props.onDelete(img.img)
        }
    }

    function saveImage(blob) {
        blob.lastModifiedDate = new Date();
        blob.name = imageToCrop.name.replace(/\./g, '') + ".jpeg";

        let src = URL.createObjectURL(blob);

        updateFiles(files => {
            files.push({
                img_link: src,
                img: {
                    id: null, tool_tip: null,
                    is_main: true, src: blob
                }
            })
        });
        setImageToCrop(null);
    }

    function b64toBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);

        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/jpeg' });
    }

    function finishCroping(e) {
        let img = document.createElement('img');
        img.src = URL.createObjectURL(imageToCrop);
        img.height = imageToCropDimensions.height;
        img.width = imageToCropDimensions.width;


        // As base64
        //var b64 = cropImage(img, crop, 6);
        //var blob = b64toBlob(b64);
        //saveImage(blob);

        // As blob
        cropImage(img, crop, saveImage)
    }

    let setImageDimensions = (image) => {
        setImageToCropDimensions({ width: image.width, height: image.height });
    };

    let imageToCropSrc = () => {
        if (imageToCrop !== null) {
            return URL.createObjectURL(imageToCrop);
        }
        return null;
    }

    let croppedImageSrc = () => {
        if (files.length === 0) {
            return null;
        }
        return files[0].img_link
    }

    return (
        <div class="row p-0 m-0 justify-content-center">
            <Modal animation={false} scrollable={true} className="crop-image-modal"
                dialogClassName="custom-modal-dialog" show={imageToCrop !== null}
                onHide={() => setImageToCrop(null)} size="lg" aria-labelledby="" centered>
                <div class="modal-close" onClick={() => setImageToCrop(null)}>
                    <span class="icon icon-close"></span>
                </div>
                <Modal.Body className="p-0 m-0 modal-body">
                    <ReactCrop className="crop-img" src={imageToCropSrc()}
                        crop={crop} onChange={newCrop => setCrop(newCrop)}
                        onImageLoaded={setImageDimensions} />
                    <div class="col-12 text-center crop-done-btn">
                        <div class="btn btn-primary mt-2 col-6 col-md-3" onClick={finishCroping}>Done</div>
                    </div>
                </Modal.Body>
            </Modal>

            {files.length > 0 ?
                <>
                    <i class="fas fa-times remove-main-img" onClick={(e) => { removeImg(files[0]) }}></i>
                    <div class="main-img lazy-container">
                        <div class="lazy-container">
                            <img class="main-img-preview" src={croppedImageSrc()} alt="" />
                        </div>
                    </div>
                </> :
                null
            }

            <input type="file" accept="image/*" name={props.name} id={props.name} class="file-input" onChange={addImage} />
            {files.length === 0 ?
                <label for={props.name} class="file-input-label">
                    <div class="upload-main-img d-flex flex-column align-content-center justify-content-center flex-wrap">
                        <div>Upload main picture</div>
                        <div class="d-flex flex-row justify-content-end">
                            <span class="camera fa fa-camera" />
                            <span class="plus fa fa-plus" />
                        </div>
                    </div>
                </label> :
                null
            }
        </div>
    );
}


export { ImageUploader }
