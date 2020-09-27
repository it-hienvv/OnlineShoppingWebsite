import React, { useEffect, useRef, useState } from 'react';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faAngleRight, faCar, faCartPlus, faChevronLeft, faChevronRight, faDivide, faHeart, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';

// Import Swiper React components
// import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
// import 'swiper/swiper.scss';

import ReactStars from "react-rating-stars-component";

export default function ProductBody(props) {

    function slugify(str){
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        var to   = "aaaaaeeeeeiiiiooooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;    // Trim - from end of text
    }
    const slugSex = "/" + slugify(props.productSex);

    const productImgSmall = props.productImg;
    // const [productImgBig, setProductImgBig] = useState([].concat(props.productImg));
    // const productImgBig = [].concat(props.productImg);
    
    const [imgIndex, setImgIndex] = useState(0);
    const [hover, setHover] = useState(false);
    const [zoom, setZoom] = useState(`0% 0%`);
    const width = 500;
    const productSmall = useRef(null);

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoom(`${x}% ${y}%`);
    };
    
    if (imgIndex >= productImgSmall.length) { //infinity slider loop
        // setProductImgBig(productImgBig.concat(props.productImg))
        setImgIndex(0);
    }

    if (productImgSmall.length > 4) {
        if (imgIndex === 1 || imgIndex === 2) {
            productSmall.current.style.transform= `translateY(0px)`
        } else if (imgIndex === productImgSmall.length - 1) {
            productSmall.current.style.transform= `translateY(-${(imgIndex-5) * 110 + 50}px)`
        } else if (imgIndex === productImgSmall.length - 2) {
            productSmall.current.style.transform= `translateY(-${(imgIndex-4) * 110 + 50}px)`
        } else if (imgIndex === productImgSmall.length - 3) {
            productSmall.current.style.transform= `translateY(-${(imgIndex-3) * 110 + 50}px)`
        } else if (imgIndex > 2) {
            productSmall.current.style.transform= `translateY(-${(imgIndex-2) * 110}px)`
        } else {
            if (productSmall.current) {
                productSmall.current.style.transform= `translateY(0px)`
            }
        }
    }

    useEffect(() => {
        if (hover === false) {
            var interval = setInterval(() => {
                setImgIndex(imgIndex => imgIndex + 1);
            }, 500000);
        }
        return() => {
            clearInterval(interval);
        }
    },[hover])

    //Counting star vote
    let ratingList = props.productVote.map(a => a.ratingStar); // get all rating
    const totalRating = ratingList.reduce((a, b) => a + b, 0)
    const averageRating = totalRating/ratingList.length;

    const ratingStar = {
        size: 12,
        value: averageRating,
        edit: false,
        activeColor: "#fda32a",
        color: "#ddd",
        isHalf: true
    };
      

    return(
        <div className="ProductBody">
            <div className="product-breadcrumb flex">
                <Link to="/" className="breadcrumb-item breadcrumb-link">Home</Link>
                <FontAwesomeIcon icon={ faAngleRight } className="breadcrumb-arrow"/>
                <Link to={slugSex} className="breadcrumb-item breadcrumb-link">{props.productCate}</Link>
                <FontAwesomeIcon icon={ faAngleRight } className="breadcrumb-arrow"/>
                <div className="breadcrumb-item breadcrumb-product">{props.productName}</div>
            </div>

            <div className="product-detail flex">
                <div className="product-gallery flex"
                    onMouseEnter={()=> {setHover(true)}}
                    onMouseLeave={()=> {setHover(false)}}>
                    <div 
                        className="product-small" ref={productSmall}
                        >
                        {productImgSmall.map((item, index) => {
                            return (
                                <div 
                                    key={index}
                                    className={imgIndex === index ? "product-small-item product-small-item-active" : "product-small-item"}>
                                    <img 
                                        src={item}
                                        onClick={()=>{ setImgIndex(index)}}
                                        alt=""
                                        ></img>
                                </div>
                            )
                        })}
                    </div>
                    <div
                        // thumbs={{ swiper: thumbsSwiper }}
                        className="product-slider flex"
                        // spaceBetween={0}
                        // slidesPerView={1}
                        // width={width}
                        // onSlideChange={updateIndex}
                        onMouseMove={handleMouseMove}
                        >
                        {productImgSmall.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className="product-big flex" 
                                    style={{ 
                                        transform: `translateX(-${width * imgIndex}px`,
                                        backgroundImage: `url(${item})`,
                                        backgroundPosition: `${zoom}`
                                    }}>
                                    <div className="product-big-item">
                                        <img 
                                            id={index}
                                            className="nodrag"
                                            style={{ width: `${width}px`}}
                                            src={item}
                                            alt=""
                                            ></img>
                                    </div>
                                </div>
                            )
                        })}
                        <div 
                            className="change-product left"
                            onClick={()=> {
                                if (imgIndex > 0) setImgIndex(imgIndex - 1)
                            }}
                            >
                            <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
                        </div>
                        <div className="change-product right"
                            onClick={()=> {
                                if (imgIndex < productImgSmall.length) setImgIndex(imgIndex + 1)
                            }}
                            >
                            <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                        </div>
                    </div>
                </div>
                <div className="product-info-detail">
                    <div className="product-info-title">
                        {props.productName}
                    </div>
                    <div className="product-info-des">
                        {props.productDes}
                    </div>
                    <div className="product-info-vote">
                        <ReactStars {...ratingStar} />
                        <p>
                            ({ratingList.length} customer reviews)
                        </p>
                    </div>
                    <div className="product-info-price">
                        {props.productPrice}
                    </div>
                    <div className="product-info-cart flex">
                        <div className="count-cart">
                            <div className="count-cart-item left flex-center">
                                <FontAwesomeIcon icon={faMinus}/>
                            </div> 
                            <div className="count-cart-item text flex-center">
                                <form>
                                    <input type="text" defaultValue="1"/>
                                </form>
                            </div>
                            <div className="count-cart-item right flex-center">
                                <FontAwesomeIcon icon={faPlus}/>
                            </div>
                        </div>
                        <div className="product-info-addtocart flex-center">
                            <FontAwesomeIcon icon={faCartPlus}/>
                            <p>Add to cart</p>
                        </div>
                        <div className="product-info-wishlist flex-center">
                            <FontAwesomeIcon icon={faHeart}></FontAwesomeIcon>
                        </div>
                    </div>
                    <div className="product-info-line"></div>
                    <div className="product-info-cate flex">
                        <p>Category:</p>
                        <p>{props.productCate}</p>
                    </div>
                    <div className="product-info-line"></div>
                </div>
            </div>
                <div className="product-info-line"></div>
        </div>
    )
}
