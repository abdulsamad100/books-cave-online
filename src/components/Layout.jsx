import React, { useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { AuthContext } from '../context/AuthContext';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const Layout = () => {
    const { signin } = useContext(AuthContext);
    const [circles, setCircles] = useState([
        { id: 1, x: 0, y: 0, size: 200, opacity: 0.3 },
        { id: 2, x: 0, y: 0, size: 150, opacity: 0.4 },
        { id: 3, x: 0, y: 0, size: 100, opacity: 0.2 },
        { id: 4, x: 0, y: 0, size: 250, opacity: 0.5 },
        { id: 5, x: 0, y: 0, size: 120, opacity: 0.3 },
        { id: 6, x: 0, y: 0, size: 180, opacity: 0.4 },
    ]);

    const getRandomPosition = (size) => {
        const maxX = window.innerWidth - size;        
        const maxY = window.innerHeight - size;
        const randomX = Math.random() * (maxX * 2) - maxX;
        const randomY = Math.random() * maxY;
        return {
            x: randomX,
            y: randomY,
        };
    };

    const getRandomRotationAndScale = () => {
        return {
            rotate: Math.random() * 360,
            scale: 0.5 + Math.random(),
        };
    };

    useEffect(() => {
        const moveCircles = () => {
            setCircles((prevCircles) =>
                prevCircles.map((circle) => {
                    const { x, y } = getRandomPosition(circle.size);
                    const { rotate, scale } = getRandomRotationAndScale();
                    return { ...circle, x, y, rotate, scale };
                })
            );
        };
        const interval = setInterval(moveCircles, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <Header />
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#000',
                    position: 'relative',
                    margin: "-8px",
                    overflow: 'hidden',
                }}
            >
                {/* {circles.map((circle) => (
                    <motion.div
                        key={circle.id}
                        style={{
                            position: 'absolute',
                            width: circle.size + 'px',
                            height: circle.size + 'px',
                            borderRadius: '50%',
                            backgroundColor: '#FFD700',
                            opacity: circle.opacity,
                        }}
                        animate={{
                            x: circle.x,
                            y: circle.y,
                            rotate: circle.rotate,
                            scale: circle.scale,
                        }}
                        transition={{
                            type: 'spring',
                            stiffness: 100,
                            damping: 10,
                            bounce: 0.5,
                        }}
                    />
                ))} */}
                <Outlet />
            </Box>
            {!signin.userLoggedIn ? <Footer /> : null}
        </>
    );
};

export default Layout;
