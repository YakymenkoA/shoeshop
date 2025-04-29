import React from "react";

export default function Home() {
  return (
    <div>
      <div
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/images/banner.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100vw',
          height: '100vh',
          position: 'absolute',
          left: '0',
          top: '0',
          zIndex: '-1',
        }}
      >
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{ zIndex: 2 }}
        >
          <img
            src={`${process.env.PUBLIC_URL}/images/bannershoe.png`}
            alt="Featured Shoe"
            className="img-fluid"
            style={{
              width: '800px',
              position: 'relative',
              right: '850px',
              transform: 'scaleX(-1)',
            }}
          />
        </div>
      </div>

      <div
        className="position-absolute top-50 start-50 translate-middle text-center text-white"
        style={{ left: '1000px', textShadow: '2px 2px 4px #7225FF, -2px -2px 4px #7225FF, 2px -2px 4px #7225FF, -2px 2px 4px #7225FF'}}
      >
        <h1 className="display-4 fw-bold mb-4"  style={{ fontSize: '8rem'}}>Welcome to <span style={{color: '#fffff'}}>MyShop</span></h1>
        <p className="lead mb-4" style={{ fontSize: '2.4rem'}}>Find the perfect shoes for every occasion</p>
      </div>

    </div>
  );
}
