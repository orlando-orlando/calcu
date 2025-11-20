import { useEffect, useRef } from "react";



const temperatura = {
    "guadalajara": {
        min: [9.5, 10.3, 12.3, 14.3, 16.4, 17.3, 16.5, 16.4, 16.5, 14.9, 12.1, 10.3],
        max: [24.7, 26.5, 29.0, 31.2, 32.5, 30.5, 27.5, 27.3, 27.1, 27.1, 26.4, 24.7]
    },
    "mexicali": {
        min: [5.8, 7.6, 10.0, 12.8, 16.7, 20.9, 25.6, 25.5, 22.1, 16.1, 9.8, 5.7],
        max: [20.5, 23.0, 26.0, 29.7, 35.0, 40.0, 42.3, 41.5, 38.7, 32.5, 25.3, 20.4]
    },
    "losCabos": {
        min: [13.0, 12.7, 13.5, 15.4, 17.0, 19.0, 22.8, 24.2, 23.9, 21.4, 17.5, 14.5],
        max: [25.4, 25.9, 26.9, 29.0, 30.7, 31.7, 33.3, 33.7, 33.0, 32.1, 29.4, 26.8]
    },
    "hermosillo": {
        min: [9.4, 10.6, 12.4, 15.0, 18.5, 23.5, 25.6, 25.4, 24.1, 19.3, 13.0, 9.7],
        max: [23.7, 25.7, 28.0, 31.8, 35.3, 39.5, 39.0, 37.8, 37.2, 33.6, 28.0, 23.8]
    },
    "chihuahua": {
        min: [1.3, 3.0, 6.5, 9.3, 13.3, 17.6, 18.2, 17.2, 15.0, 10.0, 5.0, 1.5],
        max: [18.0, 20.3, 24.0, 27.3, 31.3, 33.3, 31.7, 30.0, 28.6, 26.2, 22.0, 18.0]
    },
    "torreon": {
        min: [6.8, 8.6, 11.9, 15.6, 19.0, 20.8, 20.5, 20.3, 18.6, 15.2, 10.3, 7.4],
        max: [22.3, 25.3, 26.0, 32.5, 35.3, 35.4, 34.3, 33.7, 31.8, 29.5, 26.1, 22.8]
    },
    "monterrey": {
        min: [8.2, 10.0, 13.2, 16.7, 20.2, 22.0, 22.3, 22.5, 20.9, 17.2, 12.7, 9.1],
        max: [20.7, 23.2, 26.9, 30.0, 32.2, 33.8, 34.8, 34.5, 31.5, 27.6, 24.1, 21.2]
    },
    "tampico": {
        min: [4.0, 13.0, 15.0, 16.0, 21.0, 23.0, 22.0, 23.0, 22.0, 16.0, 8.0, 10.0],
        max: [29.0, 29.0, 30.0, 32.0, 33.0, 34.0, 44.0, 34.0, 33.0, 32.0, 30.0, 33.0]
    },
    "veracruz": {
        min: [17.0, 17.0, 20.0, 22.0, 24.0, 24.0, 23.0, 23.0, 23.0, 22.0, 19.0, 18.0],
        max: [26.0, 27.0, 29.0, 31.0, 32.0, 32.0, 31.0, 32.0, 32.0, 30.0, 29.0, 27.0]
    },
    "sanLuisPotosi": {
        min: [5.5, 6.8, 9.3, 11.9, 13.7, 14.1, 13.4, 13.4, 12.9, 10.8, 8.2, 6.4],
        max: [20.6, 22.5, 25.4, 27.7, 28.4, 26.7, 24.8, 25.0, 23.8, 23.2, 22.4, 20.7]
    },
    "durango": {
        min: [1.3, 2.4, 5.3, 8.2, 11.1, 14.0, 14.0, 13.7, 12.2, 9.1, 5.0, 2.1],
        max: [20.5, 22.1, 24.5, 27.2, 30.0, 30.4, 28.0, 27.6, 26.7, 25.6, 23.0, 20.5]
    },
    "culiacan": {
        min: [10.9, 11.3, 12.1, 14.5, 18.0, 23.2, 24.1, 23.8, 23.6, 20.7, 15.6, 12.2],
        max: [27.8, 28.9, 30.5, 32.8, 34.9, 35.9, 35.5, 34.8, 34.4, 34.2, 31.5, 28.2]
    },
    "tepic": {
        min: [8.0, 8.0, 9.0, 10.3, 14.0, 18.0, 19.0, 19.7, 19.6, 17.0, 12.6, 9.0],
        max: [26.0, 27.0, 28.5, 30.0, 31.0, 30.0, 29.0, 28.7, 28.0, 28.6, 27.6, 26.5]
    },
    "colima": {
        min: [14.0, 14.0, 14.5, 16.0, 18.6, 21.5, 22.0, 22.0, 21.6, 20.0, 17.6, 15.0],
        max: [28.0, 28.6, 29.5, 31.0, 32.0, 31.5, 31.0, 30.7, 30.6, 31.0, 30.0, 28.5]
    },
    "aguascalientes": {
        min: [4.0, 5.0, 7.0, 9.3, 12.3, 14.2, 14.0, 14.0, 14.6, 10.2, 6.6, 4.2],
        max: [22.3, 24.0, 26.5, 28.6, 30.0, 28.5, 26.2, 26.0, 25.6, 25.0, 24.0, 22.5]
    },
    "zacatecas": {
        min: [1.0, 2.0, 3.7, 6.3, 9.0, 11.2, 11.0, 10.7, 9.3, 6.5, 3.0, 1.2],
        max: [17.6, 19.3, 22.0, 24.0, 25.6, 25.0, 23.0, 22.5, 22.0, 21.5, 20.3, 18.5]
    },
    "morelia": {
        min: [5.2, 6.1, 8.4, 10.6, 12.5, 13.4, 12.8, 12.9, 12.7, 10.5, 7.8, 5.9],
        max: [23.8, 25.6, 27.9, 30.0, 30.6, 28.4, 26.1, 26.0, 25.5, 25.5, 25.3, 24.2]
    },
    "leon": {
        min: [7.7, 8.9, 10.9, 13.8, 15.7, 16.4, 15.2, 15.2, 14.8, 12.5, 10.0, 8.3],
        max: [23.6, 25.7, 28.2, 30.5, 31.7, 29.9, 27.5, 27.6, 27.1, 26.9, 25.8, 24.0]
    },
    "queretaro": {
        min: [6.0, 7.0, 9.5, 12.0, 13.6, 14.7, 14.5, 14.0, 13.6, 11.5, 8.6, 6.2],
        max: [23.0, 25.0, 27.0, 28.6, 29.6, 28.0, 26.7, 26.6, 26.0, 25.5, 24.6, 23.5]
    },
    "pachuca": {
        min: [2.8, 3.4, 5.6, 7.8, 9.2, 9.4, 9.2, 8.8, 8.4, 6.9, 4.2, 3.5],
        max: [19.8, 20.7, 23.0, 24.6, 24.1, 22.0, 20.7, 20.8, 20.5, 20.4, 20.0, 19.7]
    },
    "ciudadDeMexico": {
        min: [7.4, 8.5, 10.4, 12.3, 13.2, 13.5, 12.5, 12.7, 12.7, 11.2, 9.7, 8.1],
        max: [21.7, 23.4, 25.7, 26.8, 26.8, 25.3, 23.8, 23.9, 23.3, 22.9, 22.9, 21.9]
    },
    "acapulco": {
        min: [23.3, 23.5, 23.5, 24, 25.1, 25.2, 25.1, 25.1, 24.7, 25.1, 24.8, 24.1],
        max: [30.4, 30.4, 30.4, 30.8, 31.6, 31.9, 32.3, 32.2, 31.6, 31.7, 31.4, 30.9]
    },
    "cuernavaca": {
        min: [12.2, 13.3, 15.0, 16.6, 17.3, 16.8, 16.0, 15.9, 15.7, 14.9, 13.7, 12.7],
        max: [25.2, 26.5, 28.8, 30.1, 29.7, 27.1, 26.2, 26.1, 25.1, 25.9, 25.8, 25.2]
    },
    "puebla": {
        min: [6.0, 7.0, 9.0, 11.0, 12.0, 13.0, 12.0, 12.0, 12.0, 10.0, 8.0, 6.0],
        max: [22.0, 23.0, 25.0, 27.0, 26.0, 25.0, 24.0, 24.0, 23.0, 23.0, 23.0, 21.0]
    },
    "tlaxcala": {
        min: [5.0, 6.6, 8.0, 9.3, 11.0, 11.5, 11.0, 11.0, 11.0, 9.5, 7.0, 5.5],
        max: [20.6, 21.6, 23.5, 24.3, 24.3, 23.2, 22.5, 22.5, 22.0, 21.5, 21.0, 20.5]
    },
    "oaxaca": {
        min: [9.0, 10.0, 12.0, 14.0, 15.3, 16.0, 15.5, 15.0, 15.0, 13.5, 11.0, 9.2],
        max: [25.7, 27.2, 29.2, 30.6, 29.3, 27.0, 26.0, 26.0, 26.0, 26.0, 26.0, 25.7]
    },
    "villahermosa": {
        min: [19.3, 19.7, 21.3, 23.1, 24.2, 24.2, 23.8, 23.8, 23.8, 23.0, 21.5, 19.9],
        max: [27.9, 29.2, 31.9, 33.9, 35.1, 34.4, 33.9, 34.0, 33.0, 31.2, 29.8, 28.3]
    },
    "tuxtlaGutierrez": {
        min: [17.0, 17.3, 18.2, 21.0, 22.0, 22.0, 21.0, 21.0, 21.3, 20.5, 19.0, 17.5],
        max: [28.2, 30.0, 31.5, 33.3, 33.3, 31.2, 31.0, 31.0, 30.3, 29.5, 28.6, 28.0]
    },
    "campeche": {
        min: [18.3, 19.3, 20.7, 22.3, 24.0, 24.0, 23.5, 23.7, 23.6, 22.2, 20.6, 19.2],
        max: [28.0, 29.0, 31.0, 33.0, 34.0, 33.2, 33.0, 33.0, 32.0, 31.0, 29.6, 28.2]
    },
    "merida": {
        min: [17.2, 17.3, 18.6, 20.2, 21.7, 21.6, 21.4, 21.3, 21.6, 20.8, 19.3, 17.5],
        max: [30.8, 31.5, 34.0, 35.6, 36.3, 35.3, 35.0, 34.9, 34.2, 32.7, 31.5, 30.6]
    },
    "cancun": {
        min: [19.8, 20.3, 21.0, 22.6, 23.9, 24.7, 24.8, 24.6, 24.3, 23.3, 21.9, 20.5],
        max: [28.3, 29.4, 30.7, 32.2, 33.5, 33.7, 34.3, 34.8, 33.7, 31.6, 29.8, 28.6]
    },
    "manzanillo": {
        min: [20.3, 19.8, 19.5, 20.5, 22.5, 24.6, 24.9, 24.8, 24.5, 24.3, 22.9, 21.5],
        max: [29.4, 29.2, 29.0, 29.4, 30.5, 31.6, 32.4, 32.5, 31.7, 31.9, 31.1, 30.0]
    },
    "puertoVallarta": {
        min: [16.7, 16.3, 16.9, 17.2, 20.2, 22.8, 22.9, 23.0, 22.9, 22.2, 19.7, 18.0],
        max: [28.8, 29.0, 29.2, 29.9, 31.0, 32.3, 33.3, 33.7, 33.6, 33.6, 32.3, 29.9]
    },
};
const velocidadViento = {
    "guadalajara": {
        max: [8.8, 9.2, 9.6, 9.5, 9.2, 8.0, 7.0, 7.4, 7.9, 7.9, 8.0, 8.2]
    },
    "mexicali": {
        max: [10.5, 11.4, 12.9, 14.0, 14.0, 13.4, 11.9, 10.8, 11.1, 11.1, 10.7, 10.4]
    },
    "losCabos": {
        max: [14.3, 13.6, 13.6, 13.2, 13.1, 12.9, 11.3, 11.6, 12.1, 12.0, 13.9, 14.6]
    },
    "hermosillo": {
        max: [12.4, 12.7, 13.4, 13.9, 14.1, 14.1, 12.8, 9.6, 10.7, 11.4, 12.3, 12.5]
    },
    "chihuahua": {
        max: [13.9, 15.4, 16.6, 16.6, 16.0, 13.4, 11.4, 9.9, 10.6, 11.8, 13.0, 13.2]
    },
    "torreon": {
        max: [10.2, 11.1, 11.7, 11.8, 11.5, 12.3, 12.2, 11.6, 11.6, 10.4, 9.6, 9.7]
    },
    "monterrey": {
        max: [10.8, 12.2, 13.1, 13.4, 13.9, 15.1, 15.2, 14.4, 12.9, 11.3, 10.7, 10.1]
    },
    "tampico": {
        max: [15.5, 16.0, 16.6, 16.7, 16.6, 15.5, 14.3, 12.7, 13.8, 14.7, 15.3, 15.6]
    },
    "veracruz": {
        max: [15.6, 15.3, 14.9, 14.8, 13.5, 12.3, 10.4, 10.3, 14.4, 15.7, 15.9, 15.7]
    },
    "sanLuisPotosi": {
        max: [13.9, 15.0, 15.5, 15.2, 14.0, 16.2, 16.2, 15.6, 15.5, 14.2, 12.5, 13.0]
    },
    "durango": {
        max: [11.9, 12.7, 13.3, 13.1, 12.0, 9.8, 9.5, 9.3, 9.4, 9.3, 10.5, 11.2]
    },
    "culiacan": {
        max: [9.1, 9.5, 10.0, 10.2, 11.0, 11.1, 9.9, 7.9, 7.9, 8.6, 8.8, 8.8]
    },
    "tepic": {
        max: [8.3, 8.7, 8.9, 9.1, 9.3, 9.3, 7.8, 6.9, 7.0, 7.5, 7.8, 7.9]
    },
    "colima": {
        max: [8.6, 9.1, 9.7, 10.2, 10.4, 10.1, 8.3, 7.9, 8.0, 7.5, 7.7, 8.0]
    },
    "aguascalientes": {
        max: [12.4, 13.0, 13.3, 13.1, 12.0, 12.3, 12.3, 12.4, 12.6, 12.1, 11.3, 11.6]
    },
    "zacatecas": {
        max: [15.1, 15.7, 16.3, 16.0, 14.5, 14.4, 14.5, 14.3, 14.2, 13.2, 13.2, 14.1]
    },
    "morelia": {
        max: [8.0, 8.6, 9.1, 9.1, 8.4, 7.2, 6.7, 6.8, 7.6, 7.5, 7.4, 7.4]
    },
    "leon": {
        max: [12.8, 13.3, 13.6, 13.3, 12.3, 13.7, 13.7, 14.0, 14.3, 14.0, 12.8, 12.1]
    },
    "queretaro": {
        max: [11.9, 12.7, 12.9, 12.7, 11.9, 13.1, 13.1, 13.1, 13.2, 13.0, 11.8, 11.1]
    },
    "pachuca": {
        max: [9.3, 10.1, 10.5, 10.6, 10.9, 11.4, 11.4, 11.2, 10.9, 10.5, 9.2, 8.5]
    },
    "ciudadDeMexico": {
        max: [7.9, 8.3, 8.6, 8.4, 7.0, 7.1, 7.1, 7.0, 7.6, 7.6, 7.1, 7.2]
    },
    "acapulco": {
        max: [9.7, 10.5, 10.8, 10.8, 11.1, 11.1, 10.4, 10.7, 11.2, 10.5, 9.1, 9.0]
    },
    "cuernavaca": {
        max: [8.4, 8.9, 9.1, 8.9, 7.8, 7.2, 7.3, 7, 6.9, 7.3, 7.5, 7.9]
    },
    "puebla": {
        max: [10.2, 10.9, 12.1, 13.0, 13.0, 12.2, 10.9, 10.2, 10.4, 10.5, 10.3, 10.1]
    },
    "tlaxcala": {
        max: [9.3, 9.8, 10.0, 9.5, 8.2, 9.3, 9.6, 9.4, 9.8, 9.8, 9.5, 8.6]
    },
    "oaxaca": {
        max: [10.2, 10.0, 9.7, 9.1, 8.5, 10.0, 10.7, 10.3, 10.3, 11.7, 11.8, 10.7]
    },
    "villahermosa": {
        max: [12.1, 11.9, 11.5, 10.9, 10.8, 12.9, 13.5, 12.9, 10.9, 11.8, 12.0, 12.0]
    },
    "tuxtlaGutierrez": {
        max: [12.6, 12.5, 12.3, 11.6, 10.0, 7.8, 7.2, 7.3, 8.9, 11.6, 12.1, 12.3]
    },
    "campeche": {
        max: [11.8, 12.3, 12.7, 12.9, 12.7, 11.6, 11.2, 10.4, 10.3, 11.3, 11.5, 11.5]
    },
    "merida": {
        max: [7.2, 7.8, 8.2, 8.2, 8.1, 7.0, 6.4, 5.9, 5.9, 6.7, 6.9, 7.0]
    },
    "cancun": {
        max: [14.1, 14.6, 15.0, 14.6, 13.6, 13.0, 11.8, 10.8, 11.6, 13.7, 13.9, 14.0]
    },
    "manzanillo": {
        max: [8.7, 9.1, 9.6, 9.7, 10.3, 10.3, 9.6, 9.5, 9.8, 9.0, 8.0, 8.0]
    },
    "puertoVallarta": {
        max: [10.0, 10.6, 10.9, 11.1, 11.1, 10.7, 9.1, 9.1, 9.4, 9.3, 9.4, 9.5]
    },
};
const humedad = {
    "guadalajara": {
        promedio: [52.0, 49.0, 41.0, 36.0, 41.0, 60.0, 78.0, 81.0, 82.0, 73.0, 64.0, 57.0]
    },
    "mexicali": {
        promedio: [38.0, 36.0, 32.0, 28.0, 24.0, 20.0, 22.0, 24.0, 26.0, 30.0, 34.0, 38.0]
    },
    "losCabos": {
        promedio: [70.0, 68.0, 65.0, 60.0, 55.0, 50.0, 55.0, 60.0, 65.0, 70.0, 75.0, 78.0]
    },
    "hermosillo": {
        promedio: [40.0, 38.0, 35.0, 30.0, 25.0, 20.0, 25.0, 30.0, 35.0, 40.0, 45.0, 50.0]
    },
    "chihuahua": {
        promedio: [48.0, 46.0, 44.0, 42.0, 40.0, 38.0, 36.0, 34.0, 32.0, 30.0, 28.0, 26.0]
    },
    "torreon": {
        promedio: [43, 41, 39, 37, 35, 33, 31, 29, 27, 25, 23, 21]
    },
    "monterrey": {
        promedio: [65, 63, 61, 59, 57, 55, 53, 51, 49, 47, 45, 43]
    },
    "tampico": {
        promedio: [76, 77, 75, 74, 74, 75, 76, 77, 77, 76, 75, 75]
    },
    "veracruz": {
        promedio: [78, 79, 78, 74, 74, 75, 76, 77, 77, 76, 75, 78]
    },
    "sanLuisPotosi": {
        promedio: [60, 58, 56, 54, 52, 50, 48, 46, 44, 42, 40, 38]
    },
    "durango": {
        promedio: [55, 53, 51, 49, 47, 45, 43, 41, 39, 37, 35, 33]
    },
    "culiacan": {
        promedio: [72, 70, 68, 64, 64, 65, 70, 75, 75, 74, 73, 72]
    },
    "tepic": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
    "colima": {
        promedio: [75, 73, 70, 65, 60, 55, 60, 65, 70, 75, 80, 85]
    },
    "aguascalientes": {
        promedio: [50, 48, 46, 44, 42, 40, 38, 36, 34, 32, 30, 28]
    },
    "zacatecas": {
        promedio: [51, 49, 47, 29, 31, 33, 35, 37, 68, 66, 64, 62]
    },
    "morelia": {
        promedio: [70, 68, 65, 60, 55, 50, 55, 60, 79, 75, 73, 71]
    },
    "leon": {
        promedio: [54, 52, 50, 32, 34, 36, 38, 40, 77, 75, 73, 71]
    },
    "queretaro": {
        promedio: [60, 58, 56, 35, 37, 39, 41, 43, 72, 70, 68, 66]
    },
    "pachuca": {
        promedio: [60, 58, 51, 53, 55, 57, 59, 61, 82, 80, 78, 76]
    },
    "ciudadDeMexico": {
        promedio: [60, 58, 42, 44, 46, 48, 50, 52, 78, 76, 74, 72]
    },
    "acapulco": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
    "cuernavaca": {
        promedio: [70, 68, 65, 60, 55, 50, 55, 60, 65, 70, 75, 78]
    },
    "puebla": {
        promedio: [65, 63, 61, 59, 57, 55, 53, 51, 49, 47, 45, 43]
    },
    "tlaxcala": {
        promedio: [60, 58, 56, 54, 52, 50, 48, 46, 44, 42, 40, 38]
    },
    "oaxaca": {
        promedio: [70, 68, 65, 60, 55, 50, 55, 60, 65, 70, 75, 78]
    },
    "villahermosa": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
    "tuxtlaGutierrez": {
        promedio: [75, 73, 70, 65, 60, 55, 60, 65, 70, 75, 80, 85]
    },
    "campeche": {
        promedio: [78, 76, 73, 68, 63, 58, 63, 68, 73, 78, 83, 88]
    },
    "merida": {
        promedio: [75, 73, 70, 65, 60, 55, 60, 65, 70, 75, 80, 85]
    },
    "cancun": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
    "manzanillo": {
        promedio: [75, 73, 70, 65, 60, 55, 60, 65, 70, 75, 80, 85]
    },
    "puertoVallarta": {
        promedio: [80, 78, 75, 70, 65, 60, 65, 70, 75, 80, 85, 88]
    },
};
const calorVaporizacion = [
  { tempC: 6.7,  whKg: 688.79 },
  { tempC: 17.2, whKg: 681.95 },
  { tempC: 23.7, whKg: 677.77 },
  { tempC: 26.4, whKg: 676.03 },
  { tempC: 28.6, whKg: 674.40 },
  { tempC: 32.6, whKg: 671.85 },
  { tempC: 40.0, whKg: 666.97 }
];
const humedadAbsoluta = [
  { tempC: 0,  kgKg: 0.0000000 },
  { tempC: 1,  kgKg: 0.0040570 },
  { tempC: 2,  kgKg: 0.0043610 },
  { tempC: 3,  kgKg: 0.0046853 },
  { tempC: 4,  kgKg: 0.0050310 },
  { tempC: 5,  kgKg: 0.0054008 },
  { tempC: 6,  kgKg: 0.0057910 },
  { tempC: 7,  kgKg: 0.0062067 },
  { tempC: 8,  kgKg: 0.0066494 },
  { tempC: 9,  kgKg: 0.0071206 },
  { tempC: 10, kgKg: 0.0076219 },
  { tempC: 11, kgKg: 0.0081549 },
  { tempC: 12, kgKg: 0.0087214 },
  { tempC: 13, kgKg: 0.0093232 },
  { tempC: 14, kgKg: 0.0099623 },
  { tempC: 15, kgKg: 0.0106406 },
  { tempC: 16, kgKg: 0.0113601 },
  { tempC: 17, kgKg: 0.0121230 },
  { tempC: 18, kgKg: 0.0129315 },
  { tempC: 19, kgKg: 0.0137880 },
  { tempC: 20, kgKg: 0.0146949 },
  { tempC: 21, kgKg: 0.0156546 },
  { tempC: 22, kgKg: 0.0166698 },
  { tempC: 23, kgKg: 0.0177432 },
  { tempC: 24, kgKg: 0.0188774 },
  { tempC: 25, kgKg: 0.0200755 },
  { tempC: 26, kgKg: 0.0213404 },
  { tempC: 27, kgKg: 0.0226752 },
  { tempC: 28, kgKg: 0.0240830 },
  { tempC: 29, kgKg: 0.0255866 },
  { tempC: 30, kgKg: 0.0271822 },
  { tempC: 31, kgKg: 0.0288641 },
  { tempC: 32, kgKg: 0.0306374 },
  { tempC: 33, kgKg: 0.0325074 },
  { tempC: 34, kgKg: 0.0344801 },
  { tempC: 35, kgKg: 0.0365613 },
  { tempC: 36, kgKg: 0.0387575 },
  { tempC: 37, kgKg: 0.0410756 },
  { tempC: 38, kgKg: 0.0435227 },
  { tempC: 39, kgKg: 0.0461065 },
  { tempC: 40, kgKg: 0.0488350 }
];

const diametros = {
    //"tuberia 0.75": 0.81,
    //"tuberia 1.00": 1.03,
    "tuberia 1.50": 1.61,
    "tuberia 2.00": 2.07,
    "tuberia 2.50": 2.47,
    "tuberia 3.00": 3.07,
    "tuberia 4.00": 4.03,
    "tuberia 6.00": 6.07,
    "tuberia 8.00": 7.98,
    "tuberia 10.00": 9.98,
    "tuberia 12.00": 11.89,
    "tuberia 14.00": 13.13,
    "tuberia 16.00": 14.94,
    "tuberia 18.00": 16.81
};
const teeLinea = {
    //"tuberia 0.75": 2.40,
    //"tuberia 1.00": 3.20,
    "tuberia 1.50": 5.60,
    "tuberia 2.00": 7.70,
    "tuberia 2.50": 9.30,
    "tuberia 3.00": 12.0,
    "tuberia 4.00": 2.80,
    "tuberia 6.00": 3.80,
    "tuberia 8.00": 4.70,
    "tuberia 10.00": 5.20,
    "tuberia 12.00": 6.00,
    "tuberia 14.00": 6.00,
    "tuberia 16.00": 6.00,
    "tuberia 18.00": 6.00
};
const teeBranch = {
    //"tuberia 0.75": 5.30,
    //"tuberia 1.00": 6.60,
    "tuberia 1.50": 9.90,
    "tuberia 2.00": 12.0,
    "tuberia 2.50": 13.0,
    "tuberia 3.00": 17.0,
    "tuberia 4.00": 12.0,
    "tuberia 6.00": 18.0,
    "tuberia 8.00": 24.0,
    "tuberia 10.00": 30.0,
    "tuberia 12.00": 34.0,
    "tuberia 14.00": 34.0,
    "tuberia 16.00": 34.0,
    "tuberia 18.00": 34.0
};

const codo = {
    //"tuberia 0.75": 4.40,
    //"tuberia 1.00": 5.20,
    "tuberia 1.50": 7.40,
    "tuberia 2.00": 8.50,
    "tuberia 2.50": 9.30,
    "tuberia 3.00": 11.0,
    "tuberia 4.00": 5.90,
    "tuberia 6.00": 8.90,
    "tuberia 8.00": 12.0,
    "tuberia 10.00": 14.0,
    "tuberia 12.00": 17.0,
    "tuberia 14.00": 17.0,
    "tuberia 16.00": 17.0,
    "tuberia 18.00": 17.0
};

const reduccion = {
    //"tuberia 0.75": 8.0,
    //"tuberia 1.00": 8.0,
    "tuberia 1.50": 10.0,
    "tuberia 2.00": 12.0,
    "tuberia 2.50": 12.0,
    "tuberia 3.00": 15.0,
    "tuberia 4.00": 20.0,
    "tuberia 6.00": 25.0,
    "tuberia 8.00": 30.0,
    "tuberia 10.00": 35.0,
    "tuberia 12.00": 40.0,
    "tuberia 14.00": 45.0,
    "tuberia 16.00": 50.0,
    "tuberia 18.00": 55.0
};

// -------------------- VARIABLES GLOBALES (tal cual / mínimas añadidas) --------------------
const meses = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
let ciudadSeleccionada = null; // ciudad activa (se mantiene global)
let mesesSeleccionados = Array(12).fill(true); // ✔ todos los meses seleccionados por defecto
let climaResumen = {
  mes: null,
  tempProm: null,
  viento: null,
  humedad: null
};
const datos = {}; // objeto que tus funciones usan para leer inputs (tal como en tu código)
let graficaPerdidas; // referencia global a la gráfica
let debounceTimer = null; // para ejecutarCalculosDebounced

// -------------------- FUNCIONES (tal cual las enviaste) --------------------

// qEvaporacion (copiada exactamente según lo remitido)
function qEvaporacion() {
  // 📌 Comprobamos que exista climaResumen.tempProm
  if (!climaResumen?.tempProm) return 0;

  // 📌 Lectura de inputs desde DOM
  const area = parseFloat(datos["area"]) || 0;
  const tempDeseada = parseFloat(datos["tempDeseada"]) || 0;
  const techado = datos["cuerpoTechado"] || "no";
  const cubierta = datos["cubiertaTermica"] || "no";

  // 📌 Constantes
  const b = 6.9;
  const n = area / 5.6;

  // 📌 Clima del mes más frío
  const tProm = climaResumen.tempProm; // temp promedio
  const velViento = (techado === "si") ? 0 : climaResumen.viento; // viento
  const ga = climaResumen.humedad / 100; // humedad relativa

  // 🔹 Buscar Calor de Vaporización (primer tempC >= tempDeseada)
  const calorVapObj = calorVaporizacion.find(c => tempDeseada <= c.tempC) 
                      || calorVaporizacion[calorVaporizacion.length - 1];
  const calorVap = calorVapObj.whKg;

  // 🔹 Buscar humedad absoluta We y Was (primer tempC >= tempDeseada / Tprom)
  const weObj = humedadAbsoluta.find(h => tempDeseada <= h.tempC) 
                || humedadAbsoluta[humedadAbsoluta.length - 1];
  const wasObj = humedadAbsoluta.find(h => tProm <= h.tempC) 
                 || humedadAbsoluta[humedadAbsoluta.length - 1];
  const we = weObj.kgKg;
  const was = wasObj.kgKg;

  // 📌 Fórmula de evaporación
  let qEvap = (((area * 16) + (133 * n) * (we - ga * was) * calorVap / 1000 * 3412.14)) * ((b * velViento / 100) + 1);

  // 📌 Si lleva cubierta térmica
  if (cubierta === "si") qEvap *= 0.5;

  // 🔹 Debug (opcional)
  console.log("area =", area);
  console.log("nadadores =", n);
  console.log("We =", we);
  console.log("Ga =", ga);
  console.log("Was =", was);
  console.log("CalorVap =", calorVap);
  console.log("b =", b);
  console.log("v =", velViento);
  console.log("qEvap =", qEvap);
  mostrarGrafica(qEvap);

  return qEvap;
}

// qTuberia (tal cual)
function qTuberia(resumenTramosR = {}, resumenDisparosR = {}) {
  // 🔹 Combinar los resúmenes
  const resumenMateriales = { ...(resumenTramosR || {}) };

  for (const [diam, info] of Object.entries(resumenDisparosR || {})) {
    if (!resumenMateriales[diam]) {
      resumenMateriales[diam] = { ...info };
    } else {
      resumenMateriales[diam].tuberia_m += info.tuberia_m || 0;
      resumenMateriales[diam].tees += info.tees || 0;
      resumenMateriales[diam].codos += info.codos || 0;
      resumenMateriales[diam].reducciones += info.reducciones || 0;
    }
  }

  // 🔹 Si no hay materiales, regreso objeto vacío
  if (Object.keys(resumenMateriales).length === 0) {
    console.log("⚠️ No hay tuberías para calcular pérdidas");
    return { porDiametro: {}, total_BTU_h: 0 };
  }

  if (!climaResumen?.tempProm) return { porDiametro: {}, total_BTU_h: 0 };

  const INCH_TO_M = 0.0254;
  const KCALH_TO_BTUH = 3.96832;
  const k_kcal_m_h_C = 0.22;

  const T2 = climaResumen.tempProm;
  const T1 = parseFloat(datos["tempDeseada"]) || 0;
  const deltaT = T1 - T2;

  const pvcSch40 = {
    "tuberia 1.50":  { OD_m: 1.90 * INCH_TO_M, ID_m: 1.61 * INCH_TO_M },
    "tuberia 2.00":  { OD_m: 2.37 * INCH_TO_M, ID_m: 2.07 * INCH_TO_M },
    "tuberia 2.50":  { OD_m: 2.87 * INCH_TO_M, ID_m: 2.47 * INCH_TO_M },
    "tuberia 3.00":  { OD_m: 3.50 * INCH_TO_M, ID_m: 3.07 * INCH_TO_M },
    "tuberia 4.00":  { OD_m: 4.50 * INCH_TO_M, ID_m: 4.03 * INCH_TO_M },
    "tuberia 6.00":  { OD_m: 6.62 * INCH_TO_M, ID_m: 6.07 * INCH_TO_M },
    "tuberia 8.00":  { OD_m: 8.62 * INCH_TO_M, ID_m: 7.98 * INCH_TO_M },
    "tuberia 10.00": { OD_m: 10.75 * INCH_TO_M, ID_m: 9.98 * INCH_TO_M },
    "tuberia 12.00": { OD_m: 12.75 * INCH_TO_M, ID_m: 11.89 * INCH_TO_M },
    "tuberia 14.00": { OD_m: 14.00 * INCH_TO_M, ID_m: 13.13 * INCH_TO_M },
    "tuberia 16.00": { OD_m: 16.00 * INCH_TO_M, ID_m: 14.94 * INCH_TO_M },
    "tuberia 18.00": { OD_m: 18.00 * INCH_TO_M, ID_m: 16.81 * INCH_TO_M }
  };

  const qTub = { porDiametro: {}, total_BTU_h: 0 };

  for (const [diamNom, info] of Object.entries(resumenMateriales)) {
    const length_m = (info && typeof info.tuberia_m === "number") ? info.tuberia_m : 0;
    if (length_m <= 0) {
      qTub.porDiametro[diamNom] = { length_m, Q_BTU_h: 0, note: "longitud 0" };
      continue;
    }

    const entry = pvcSch40[diamNom];
    if (!entry) {
      qTub.porDiametro[diamNom] = { length_m, Q_BTU_h: 0, note: "diámetro no en tabla" };
      continue;
    }

    const r1 = entry.ID_m / 2;
    const r2 = entry.OD_m / 2;

    const Q_kcal_h = (2 * Math.PI * k_kcal_m_h_C * length_m * deltaT) / Math.log(r2 / r1);
    const Q_BTU_h = Q_kcal_h * KCALH_TO_BTUH;

    qTub.porDiametro[diamNom] = {
      length_m,
      Q_BTU_h: Number(Q_BTU_h.toFixed(2))
    };

    qTub.total_BTU_h += Q_BTU_h;
        console.log(
      `✅ Tubería ${diamNom} | Longitud: ${length_m} m | Pérdida: ${Q_BTU_h.toFixed(2)} BTU/h`
    );
  }

  qTub.total_BTU_h = Number(qTub.total_BTU_h.toFixed(2));
  console.log(`👉 Pérdida total en tubería = ${qTub.total_BTU_h} BTU/h`);
  return qTub;
}

// qRadiacion (tal cual)
function qRadiacion() {
  const sigma = 5.67e-8; // Constante de Stefan-Boltzmann (W/m²K⁴)
  const emisividad = 0.95;

  // 🔹 Obtener valores desde los datos globales
  const tempAguaC = parseFloat(datos["tempDeseada"]) || 0; // °C
  const area = parseFloat(datos["area"]) || 0; // m²

  if (!tempAguaC || !area) return 0; // si faltan datos, no calculamos

  // 🔹 Convertir a Kelvin
  const T_agua = tempAguaC + 273;
  const T_cerramiento = (tempAguaC - 1) + 273;

  // 🔹 Calcular pérdida por radiación (W)
  const Qrad_W = sigma * emisividad * (Math.pow(T_agua, 4) - Math.pow(T_cerramiento, 4)) * area;

  // 🔹 Convertir a BTU/h (1 W = 3.412142 BTU/h)
  const Qrad_BTUh = Qrad_W * 3.412142;

  return Qrad_BTUh;
}

// qConveccion (tal cual)
function qConveccion() {
  const constante = 0.6246; // constante de convección
  const area = parseFloat(datos["area"]) || 0; // m²

  // 🔹 Temperaturas en °C
  const T_agua = climaResumen.tempProm - 3; // vaso de agua
  const T_aire = climaResumen.tempProm;     // aire del ambiente
  // 🔹 Cálculo de convección en W
  const Qconv_W = (constante * Math.pow((T_aire - T_agua), 4 / 3)) * area;

  // 🔹 Convertir a BTU/h (1 W = 3.412142 BTU/h)
  const Qconv_BTUh = Qconv_W * 3.412142;
  console.log("area =", area);
  console.log("Temp prom aire - 2 =", T_agua);
  console.log("Temp prom aire =", T_aire);
  console.log("Perdida conveccion =", Qconv_BTUh);
  return Qconv_BTUh;
}

// qTransmision (tal cual)
function qTransmision() {
  const C_T = 1.5; // W/m²°C
  const area = parseFloat(datos["area"] || 0);
  const profMax = parseFloat(datos["profMax"] || 0);
  const tempDeseada = parseFloat(datos["tempDeseada"] || 0);

  // 🔹 Clima promedio (temperatura exterior)
  const tempExterior = climaResumen?.tempProm ?? 0;

  if (area <= 0 || tempDeseada <= 0 || tempExterior === null) {
    console.warn("⚠️ Datos insuficientes para qTransmision");
    return 0;
  }

  // 🔹 Superficie de cerramiento S
  const S = area + (Math.sqrt(area) * 4) * profMax;

  // 🔹 Cálculo de Q
  const Q = C_T * S * (tempDeseada - tempExterior); // [W]

  // 🔹 Convertimos a BTU/h
  const Q_BTU_h = Q * 3.412;
  console.log(`prof max qTrans =`, profMax);

  console.log(`qTransmision = ${Q_BTU_h.toFixed(2)} BTU/h`);

  return Q_BTU_h;
}

// qInfinity (tal cual)
function qInfinity() {
  const profMin = parseFloat(datos["profMin"]) || 0;
  const profMax = parseFloat(datos["profMax"]) || 0;
  const profMaxTotal = Math.max(profMin, profMax);
  const largoInfinity = parseFloat(datos["largoInfinity"]) || 0;
  const tempDeseada = parseFloat(datos["tempDeseada"]) || 0;

  if (!climaResumen) {
    console.warn("⚠️ climaResumen no definido");
    return 0;
  }

  const tempProm = parseFloat(climaResumen.tempProm) || 0;
  let velViento = parseFloat(climaResumen.viento) || 0;
  // si tu viento viene en m/s convierte: velViento = velViento * 3.6;
  if (climaResumen.vientoUnidad === "mph") velViento *= 1.60934;

  if (profMaxTotal <= 0 || largoInfinity <= 0 || tempDeseada === 0) {
    console.warn("⚠️ Datos insuficientes para qInfinity");
    return 0;
  }

  const areaCortina = (largoInfinity / 0.3048) * (profMaxTotal / 0.3048); // ft²

  // Tabla completa de factores
  const factores = [
    { tAire: 26.7, tAgua: 26.7, vel: 0, factor: 17 },
    { tAire: 26.7, tAgua: 26.7, vel: 0.5, factor: 34 },
    { tAire: 26.7, tAgua: 26.7, vel: 1.1, factor: 40 },
    { tAire: 26.7, tAgua: 26.7, vel: 2.2, factor: 49 },
    { tAire: 26.7, tAgua: 26.7, vel: 5.5, factor: 60 },
    { tAire: 26.7, tAgua: 26.7, vel: 11.0, factor: 106 },
    { tAire: 26.7, tAgua: 26.7, vel: 21.9, factor: 185 },
    { tAire: 26.7, tAgua: 26.7, vel: 54.9, factor: 330 },
    { tAire: 26.7, tAgua: 37.8, vel: 0, factor: 50 },
    { tAire: 26.7, tAgua: 37.8, vel: 0.5, factor: 96 },
    { tAire: 26.7, tAgua: 37.8, vel: 1.1, factor: 113 },
    { tAire: 26.7, tAgua: 37.8, vel: 2.2, factor: 135 },
    { tAire: 26.7, tAgua: 37.8, vel: 5.5, factor: 186 },
    { tAire: 26.7, tAgua: 37.8, vel: 11.0, factor: 280 },
    { tAire: 26.7, tAgua: 37.8, vel: 21.9, factor: 460 },
    { tAire: 26.7, tAgua: 37.8, vel: 54.9, factor: 920 },
    { tAire: 26.7, tAgua: 43.3, vel: 0, factor: 210 },
    { tAire: 26.7, tAgua: 43.3, vel: 0.5, factor: 265 },
    { tAire: 26.7, tAgua: 43.3, vel: 1.1, factor: 320 },
    { tAire: 26.7, tAgua: 43.3, vel: 2.2, factor: 380 },
    { tAire: 26.7, tAgua: 43.3, vel: 5.5, factor: 540 },
    { tAire: 26.7, tAgua: 43.3, vel: 11.0, factor: 780 },
    { tAire: 26.7, tAgua: 43.3, vel: 21.9, factor: 1250 },
    { tAire: 26.7, tAgua: 43.3, vel: 54.9, factor: 2550 },

    { tAire: 21.1, tAgua: 26.7, vel: 0, factor: 47 },
    { tAire: 21.1, tAgua: 26.7, vel: 0.5, factor: 72 },
    { tAire: 21.1, tAgua: 26.7, vel: 1.1, factor: 82 },
    { tAire: 21.1, tAgua: 26.7, vel: 2.2, factor: 99 },
    { tAire: 21.1, tAgua: 26.7, vel: 5.5, factor: 129 },
    { tAire: 21.1, tAgua: 26.7, vel: 11.0, factor: 210 },
    { tAire: 21.1, tAgua: 26.7, vel: 21.9, factor: 347 },
    { tAire: 21.1, tAgua: 26.7, vel: 54.9, factor: 690 },
    { tAire: 21.1, tAgua: 37.8, vel: 0, factor: 127 },
    { tAire: 21.1, tAgua: 37.8, vel: 0.5, factor: 163 },
    { tAire: 21.1, tAgua: 37.8, vel: 1.1, factor: 216 },
    { tAire: 21.1, tAgua: 37.8, vel: 2.2, factor: 242 },
    { tAire: 21.1, tAgua: 37.8, vel: 5.5, factor: 342 },
    { tAire: 21.1, tAgua: 37.8, vel: 11.0, factor: 495 },
    { tAire: 21.1, tAgua: 37.8, vel: 21.9, factor: 806 },
    { tAire: 21.1, tAgua: 37.8, vel: 54.9, factor: 1610 },
    { tAire: 21.1, tAgua: 43.3, vel: 0, factor: 250 },
    { tAire: 21.1, tAgua: 43.3, vel: 0.5, factor: 327 },
    { tAire: 21.1, tAgua: 43.3, vel: 1.1, factor: 370 },
    { tAire: 21.1, tAgua: 43.3, vel: 2.2, factor: 430 },
    { tAire: 21.1, tAgua: 43.3, vel: 5.5, factor: 632 },
    { tAire: 21.1, tAgua: 43.3, vel: 11.0, factor: 690 },
    { tAire: 21.1, tAgua: 43.3, vel: 21.9, factor: 1425 },
    { tAire: 21.1, tAgua: 43.3, vel: 54.9, factor: 2925 },

    { tAire: 15.6, tAgua: 26.7, vel: 0, factor: 70 },
    { tAire: 15.6, tAgua: 26.7, vel: 0.5, factor: 140 },
    { tAire: 15.6, tAgua: 26.7, vel: 1.1, factor: 125 },
    { tAire: 15.6, tAgua: 26.7, vel: 2.2, factor: 160 },
    { tAire: 15.6, tAgua: 26.7, vel: 5.5, factor: 210 },
    { tAire: 15.6, tAgua: 26.7, vel: 11.0, factor: 315 },
    { tAire: 15.6, tAgua: 26.7, vel: 21.9, factor: 510 },
    { tAire: 15.6, tAgua: 26.7, vel: 54.9, factor: 1050 },
    { tAire: 15.6, tAgua: 37.8, vel: 0, factor: 205 },
    { tAire: 15.6, tAgua: 37.8, vel: 0.5, factor: 270 },
    { tAire: 15.6, tAgua: 37.8, vel: 1.1, factor: 320 },
    { tAire: 15.6, tAgua: 37.8, vel: 2.2, factor: 350 },
    { tAire: 15.6, tAgua: 37.8, vel: 5.5, factor: 480 },
    { tAire: 15.6, tAgua: 37.8, vel: 11.0, factor: 710 },
    { tAire: 15.6, tAgua: 37.8, vel: 21.9, factor: 1150 },
    { tAire: 15.6, tAgua: 37.8, vel: 54.9, factor: 2300 },
    { tAire: 15.6, tAgua: 43.3, vel: 0, factor: 290 },
    { tAire: 15.6, tAgua: 43.3, vel: 0.5, factor: 370 },
    { tAire: 15.6, tAgua: 43.3, vel: 1.1, factor: 420 },
    { tAire: 15.6, tAgua: 43.3, vel: 2.2, factor: 480 },
    { tAire: 15.6, tAgua: 43.3, vel: 5.5, factor: 670 },
    { tAire: 15.6, tAgua: 43.3, vel: 11.0, factor: 1000 },
    { tAire: 15.6, tAgua: 43.3, vel: 21.9, factor: 1600 },
    { tAire: 15.6, tAgua: 43.3, vel: 54.9, factor: 3300 },

    { tAire: 10.0, tAgua: 26.7, vel: 0, factor: 1060 },
    { tAire: 10.0, tAgua: 26.7, vel: 0.5, factor: 140 },
    { tAire: 10.0, tAgua: 26.7, vel: 1.1, factor: 160 },
    { tAire: 10.0, tAgua: 26.7, vel: 2.2, factor: 187 },
    { tAire: 10.0, tAgua: 26.7, vel: 5.5, factor: 260 },
    { tAire: 10.0, tAgua: 26.7, vel: 11.0, factor: 382 },
    { tAire: 10.0, tAgua: 26.7, vel: 21.9, factor: 615 },
    { tAire: 10.0, tAgua: 26.7, vel: 54.9, factor: 1255 },
    { tAire: 10.0, tAgua: 37.8, vel: 0, factor: 232 },
    { tAire: 10.0, tAgua: 37.8, vel: 0.5, factor: 292 },
    { tAire: 10.0, tAgua: 37.8, vel: 1.1, factor: 340 },
    { tAire: 10.0, tAgua: 37.8, vel: 2.2, factor: 385 },
    { tAire: 10.0, tAgua: 37.8, vel: 5.5, factor: 540 },
    { tAire: 10.0, tAgua: 37.8, vel: 11.0, factor: 785 },
    { tAire: 10.0, tAgua: 37.8, vel: 21.9, factor: 1275 },
    { tAire: 10.0, tAgua: 37.8, vel: 54.9, factor: 2550 },
    { tAire: 10.0, tAgua: 43.3, vel: 0, factor: 320 },
    { tAire: 10.0, tAgua: 43.3, vel: 0.5, factor: 395 },
    { tAire: 10.0, tAgua: 43.3, vel: 1.1, factor: 445 },
    { tAire: 10.0, tAgua: 43.3, vel: 2.2, factor: 515 },
    { tAire: 10.0, tAgua: 43.3, vel: 5.5, factor: 670 },
    { tAire: 10.0, tAgua: 43.3, vel: 11.0, factor: 1065 },
    { tAire: 10.0, tAgua: 43.3, vel: 21.9, factor: 1740 },
    { tAire: 10.0, tAgua: 43.3, vel: 54.9, factor: 3500 }
  ];

  // listas únicas ordenadas
  const tAireVals = [...new Set(factores.map(f => f.tAire))].sort((a,b)=>a-b);
  const tAguaVals = [...new Set(factores.map(f => f.tAgua))].sort((a,b)=>a-b);
  const velVals   = [...new Set(factores.map(f => f.vel))].sort((a,b)=>a-b);

  // floorMatch -> el umbral más alto que no exceda el target
  const floorMatch = (target, arr) => {
    const menores = arr.filter(v => v <= target);
    return menores.length ? Math.max(...menores) : arr[0];
  };

  // Usamos floorMatch para aire, agua y velocidad (rangos inferiores)
  const selectedTAire = floorMatch(tempProm, tAireVals);
  const selectedTAgua = floorMatch(tempDeseada, tAguaVals);
  const selectedVel = floorMatch(velViento, velVals);

  // buscar factor exacto
  let factorObj = factores.find(f =>
    f.tAire === selectedTAire && f.tAgua === selectedTAgua && f.vel === selectedVel
  );

  // si no hay combinación exacta, elegir candidato por vel cercano dentro del tAire/tAgua seleccionados
  if (!factorObj) {
    const candidates = factores.filter(f => f.tAire === selectedTAire && f.tAgua === selectedTAgua);
    if (candidates.length) {
      factorObj = candidates.reduce((best, f) =>
        Math.abs(f.vel - velViento) < Math.abs(best.vel - velViento) ? f : best
      , candidates[0]);
    }
  }

  // fallback robusto (muy raro que se llegue aquí)
  if (!factorObj) {
    factorObj = factores.reduce((best, curr) => {
      const dBest = Math.abs(best.tAire - tempProm) + Math.abs(best.tAgua - tempDeseada) + Math.abs(best.vel - velViento);
      const dCurr = Math.abs(curr.tAire - tempProm) + Math.abs(curr.tAgua - tempDeseada) + Math.abs(curr.vel - velViento);
      return dCurr < dBest ? curr : best;
    }, factores[0]);
  }

  const Q_BTU_h = Number((factorObj.factor * areaCortina).toFixed(2));

  console.log("tempProm =", tempProm, "→ sección aire usada =", selectedTAire);
  console.log("tempDeseada =", tempDeseada, "→ sección agua usada =", selectedTAgua);
  console.log("velViento =", velViento, "→ sección vel usada =", selectedVel);
  console.log("factor seleccionado =", factorObj.factor);
  console.log("area cortina =", areaCortina.toFixed(2), "ft²");
  console.log("qInfinity =", Q_BTU_h, "BTU/h");

  return Q_BTU_h;
}

// qCanal (tal cual)
function qCanal() {
  const profMaxTotal = 0.3;
  const largoCanal = parseFloat(datos["largoCanal"]) || 0;
  const tempDeseada = parseFloat(datos["tempDeseada"]) || 0;

  if (!climaResumen) {
    console.warn("⚠️ climaResumen no definido");
    return 0;
  }

  const tempProm = parseFloat(climaResumen.tempProm) || 0;
  let velViento = parseFloat(climaResumen.viento) || 0;
  // si tu viento viene en m/s convierte: velViento = velViento * 3.6;
  if (climaResumen.vientoUnidad === "mph") velViento *= 1.60934;

  if (profMaxTotal <= 0 || largoCanal <= 0 || tempDeseada === 0) {
    console.warn("⚠️ Datos insuficientes para qCanal");
    return 0;
  }

  const areaCortina = (largoCanal / 0.3048) * (profMaxTotal / 0.3048); // ft²

  // Tabla completa de factores
  const factores = [
    { tAire: 26.7, tAgua: 26.7, vel: 0, factor: 17 },
    { tAire: 26.7, tAgua: 26.7, vel: 0.5, factor: 34 },
    { tAire: 26.7, tAgua: 26.7, vel: 1.1, factor: 40 },
    { tAire: 26.7, tAgua: 26.7, vel: 2.2, factor: 49 },
    { tAire: 26.7, tAgua: 26.7, vel: 5.5, factor: 60 },
    { tAire: 26.7, tAgua: 26.7, vel: 11.0, factor: 106 },
    { tAire: 26.7, tAgua: 26.7, vel: 21.9, factor: 185 },
    { tAire: 26.7, tAgua: 26.7, vel: 54.9, factor: 330 },
    { tAire: 26.7, tAgua: 37.8, vel: 0, factor: 50 },
    { tAire: 26.7, tAgua: 37.8, vel: 0.5, factor: 96 },
    { tAire: 26.7, tAgua: 37.8, vel: 1.1, factor: 113 },
    { tAire: 26.7, tAgua: 37.8, vel: 2.2, factor: 135 },
    { tAire: 26.7, tAgua: 37.8, vel: 5.5, factor: 186 },
    { tAire: 26.7, tAgua: 37.8, vel: 11.0, factor: 280 },
    { tAire: 26.7, tAgua: 37.8, vel: 21.9, factor: 460 },
    { tAire: 26.7, tAgua: 37.8, vel: 54.9, factor: 920 },
    { tAire: 26.7, tAgua: 43.3, vel: 0, factor: 210 },
    { tAire: 26.7, tAgua: 43.3, vel: 0.5, factor: 265 },
    { tAire: 26.7, tAgua: 43.3, vel: 1.1, factor: 320 },
    { tAire: 26.7, tAgua: 43.3, vel: 2.2, factor: 380 },
    { tAire: 26.7, tAgua: 43.3, vel: 5.5, factor: 540 },
    { tAire: 26.7, tAgua: 43.3, vel: 11.0, factor: 780 },
    { tAire: 26.7, tAgua: 43.3, vel: 21.9, factor: 1250 },
    { tAire: 26.7, tAgua: 43.3, vel: 54.9, factor: 2550 },

    { tAire: 21.1, tAgua: 26.7, vel: 0, factor: 47 },
    { tAire: 21.1, tAgua: 26.7, vel: 0.5, factor: 72 },
    { tAire: 21.1, tAgua: 26.7, vel: 1.1, factor: 82 },
    { tAire: 21.1, tAgua: 26.7, vel: 2.2, factor: 99 },
    { tAire: 21.1, tAgua: 26.7, vel: 5.5, factor: 129 },
    { tAire: 21.1, tAgua: 26.7, vel: 11.0, factor: 210 },
    { tAire: 21.1, tAgua: 26.7, vel: 21.9, factor: 347 },
    { tAire: 21.1, tAgua: 26.7, vel: 54.9, factor: 690 },
    { tAire: 21.1, tAgua: 37.8, vel: 0, factor: 127 },
    { tAire: 21.1, tAgua: 37.8, vel: 0.5, factor: 163 },
    { tAire: 21.1, tAgua: 37.8, vel: 1.1, factor: 216 },
    { tAire: 21.1, tAgua: 37.8, vel: 2.2, factor: 242 },
    { tAire: 21.1, tAgua: 37.8, vel: 5.5, factor: 342 },
    { tAire: 21.1, tAgua: 37.8, vel: 11.0, factor: 495 },
    { tAire: 21.1, tAgua: 37.8, vel: 21.9, factor: 806 },
    { tAire: 21.1, tAgua: 37.8, vel: 54.9, factor: 1610 },
    { tAire: 21.1, tAgua: 43.3, vel: 0, factor: 250 },
    { tAire: 21.1, tAgua: 43.3, vel: 0.5, factor: 327 },
    { tAire: 21.1, tAgua: 43.3, vel: 1.1, factor: 370 },
    { tAire: 21.1, tAgua: 43.3, vel: 2.2, factor: 430 },
    { tAire: 21.1, tAgua: 43.3, vel: 5.5, factor: 632 },
    { tAire: 21.1, tAgua: 43.3, vel: 11.0, factor: 690 },
    { tAire: 21.1, tAgua: 43.3, vel: 21.9, factor: 1425 },
    { tAire: 21.1, tAgua: 43.3, vel: 54.9, factor: 2925 },

    { tAire: 15.6, tAgua: 26.7, vel: 0, factor: 70 },
    { tAire: 15.6, tAgua: 26.7, vel: 0.5, factor: 140 },
    { tAire: 15.6, tAgua: 26.7, vel: 1.1, factor: 125 },
    { tAire: 15.6, tAgua: 26.7, vel: 2.2, factor: 160 },
    { tAire: 15.6, tAgua: 26.7, vel: 5.5, factor: 210 },
    { tAire: 15.6, tAgua: 26.7, vel: 11.0, factor: 315 },
    { tAire: 15.6, tAgua: 26.7, vel: 21.9, factor: 510 },
    { tAire: 15.6, tAgua: 26.7, vel: 54.9, factor: 1050 },
    { tAire: 15.6, tAgua: 37.8, vel: 0, factor: 205 },
    { tAire: 15.6, tAgua: 37.8, vel: 0.5, factor: 270 },
    { tAire: 15.6, tAgua: 37.8, vel: 1.1, factor: 320 },
    { tAire: 15.6, tAgua: 37.8, vel: 2.2, factor: 350 },
    { tAire: 15.6, tAgua: 37.8, vel: 5.5, factor: 480 },
    { tAire: 15.6, tAgua: 37.8, vel: 11.0, factor: 710 },
    { tAire: 15.6, tAgua: 37.8, vel: 21.9, factor: 1150 },
    { tAire: 15.6, tAgua: 37.8, vel: 54.9, factor: 2300 },
    { tAire: 15.6, tAgua: 43.3, vel: 0, factor: 290 },
    { tAire: 15.6, tAgua: 43.3, vel: 0.5, factor: 370 },
    { tAire: 15.6, tAgua: 43.3, vel: 1.1, factor: 420 },
    { tAire: 15.6, tAgua: 43.3, vel: 2.2, factor: 480 },
    { tAire: 15.6, tAgua: 43.3, vel: 5.5, factor: 670 },
    { tAire: 15.6, tAgua: 43.3, vel: 11.0, factor: 1000 },
    { tAire: 15.6, tAgua: 43.3, vel: 21.9, factor: 1600 },
    { tAire: 15.6, tAgua: 43.3, vel: 54.9, factor: 3300 },

    { tAire: 10.0, tAgua: 26.7, vel: 0, factor: 1060 },
    { tAire: 10.0, tAgua: 26.7, vel: 0.5, factor: 140 },
    { tAire: 10.0, tAgua: 26.7, vel: 1.1, factor: 160 },
    { tAire: 10.0, tAgua: 26.7, vel: 2.2, factor: 187 },
    { tAire: 10.0, tAgua: 26.7, vel: 5.5, factor: 260 },
    { tAire: 10.0, tAgua: 26.7, vel: 11.0, factor: 382 },
    { tAire: 10.0, tAgua: 26.7, vel: 21.9, factor: 615 },
    { tAire: 10.0, tAgua: 26.7, vel: 54.9, factor: 1255 },
    { tAire: 10.0, tAgua: 37.8, vel: 0, factor: 232 },
    { tAire: 10.0, tAgua: 37.8, vel: 0.5, factor: 292 },
    { tAire: 10.0, tAgua: 37.8, vel: 1.1, factor: 340 },
    { tAire: 10.0, tAgua: 37.8, vel: 2.2, factor: 385 },
    { tAire: 10.0, tAgua: 37.8, vel: 5.5, factor: 540 },
    { tAire: 10.0, tAgua: 37.8, vel: 11.0, factor: 785 },
    { tAire: 10.0, tAgua: 37.8, vel: 21.9, factor: 1275 },
    { tAire: 10.0, tAgua: 37.8, vel: 54.9, factor: 2550 },
    { tAire: 10.0, tAgua: 43.3, vel: 0, factor: 320 },
    { tAire: 10.0, tAgua: 43.3, vel: 0.5, factor: 395 },
    { tAire: 10.0, tAgua: 43.3, vel: 1.1, factor: 445 },
    { tAire: 10.0, tAgua: 43.3, vel: 2.2, factor: 515 },
    { tAire: 10.0, tAgua: 43.3, vel: 5.5, factor: 670 },
    { tAire: 10.0, tAgua: 43.3, vel: 11.0, factor: 1065 },
    { tAire: 10.0, tAgua: 43.3, vel: 21.9, factor: 1740 },
    { tAire: 10.0, tAgua: 43.3, vel: 54.9, factor: 3500 }
  ];

  // listas únicas ordenadas
  const tAireVals = [...new Set(factores.map(f => f.tAire))].sort((a,b)=>a-b);
  const tAguaVals = [...new Set(factores.map(f => f.tAgua))].sort((a,b)=>a-b);
  const velVals   = [...new Set(factores.map(f => f.vel))].sort((a,b)=>a-b);

  // floorMatch -> el umbral más alto que no exceda el target
  const floorMatch = (target, arr) => {
    const menores = arr.filter(v => v <= target);
    return menores.length ? Math.max(...menores) : arr[0];
  };

  // Usamos floorMatch para aire, agua y velocidad (rangos inferiores)
  const selectedTAire = floorMatch(tempProm, tAireVals);
  const selectedTAgua = floorMatch(tempDeseada, tAguaVals);
  const selectedVel = floorMatch(velViento, velVals);

  // buscar factor exacto
  let factorObj = factores.find(f =>
    f.tAire === selectedTAire && f.tAgua === selectedTAgua && f.vel === selectedVel
  );

  // si no hay combinación exacta, elegir candidato por vel cercano dentro del tAire/tAgua seleccionados
  if (!factorObj) {
    const candidates = factores.filter(f => f.tAire === selectedTAire && f.tAgua === selectedTAgua);
    if (candidates.length) {
      factorObj = candidates.reduce((best, f) =>
        Math.abs(f.vel - velViento) < Math.abs(best.vel - velViento) ? f : best
      , candidates[0]);
    }
  }

  // fallback robusto (muy raro que se llegue aquí)
  if (!factorObj) {
    factorObj = factores.reduce((best, curr) => {
      const dBest = Math.abs(best.tAire - tempProm) + Math.abs(best.tAgua - tempDeseada) + Math.abs(best.vel - velViento);
      const dCurr = Math.abs(curr.tAire - tempProm) + Math.abs(curr.tAgua - tempDeseada) + Math.abs(curr.vel - velViento);
      return dCurr < dBest ? curr : best;
    }, factores[0]);
  }

  const Q_BTU_h = Number((factorObj.factor * areaCortina).toFixed(2));

  console.log("tempProm =", tempProm, "→ sección aire usada =", selectedTAire);
  console.log("tempDeseada =", tempDeseada, "→ sección agua usada =", selectedTAgua);
  console.log("velViento =", velViento, "→ sección vel usada =", selectedVel);
  console.log("factor seleccionado =", factorObj.factor);
  console.log("area cortina =", areaCortina.toFixed(2), "ft²");
  console.log("qCanal =", Q_BTU_h, "BTU/h");

  return Q_BTU_h;
}

// -------------------- FUNCIONES DE UI / INTEGRACION que me mandaste --------------------

// ejecutarCalculos (centraliza todo) (tal cual)
function ejecutarCalculos() {
    idsRelevantes.forEach(id => syncDatos(id));
    
  // 👉 Si no hay clima válido aún, no calculamos pérdidas
  if (!climaResumen || climaResumen.tempProm === null) {
    console.warn("⚠️ Clima no definido, cálculos incompletos");
    return;
  }

  // 🔹 Recalcular evaporación
  const qEvap = qEvaporacion();
  const qRad = qRadiacion();
  const qConv = qConveccion();
  const qTrans = qTransmision();
  const qInf = qInfinity();
  const qCan = qCanal();

  // 🔹 Generar resúmenes de tuberías
  // Nota: asumir que generarResumenes() está definido en tu código de las otras partes.
  // Si no existe, aquí se debe implementar según tu lógica original (pero según lo enviado, la llamas).
  const { resumenTramosR, resumenDisparosR } = (typeof generarResumenes === "function") ? generarResumenes() : { resumenTramosR: {}, resumenDisparosR: {} };

  // 🔹 Pasar resúmenes y clima a tubería
  const qTubResult = qTuberia(resumenTramosR, resumenDisparosR);
  const qTubTotal = qTubResult.total_BTU_h;

  // 🔹 Actualizar gráfica
  mostrarGrafica(qEvap, qRad, qConv, qTrans, qInf, qCan, qTubTotal);
}

// renderTabla (tal cual)
function renderTabla(ciudad) {
  const datosTemp = temperatura[ciudad];
  const datosViento = velocidadViento[ciudad];
  const datosHumedad = humedad[ciudad];

  if (!datosTemp || !datosViento || !datosHumedad) return;

  let tabla = `
    <p><strong>Selecciona los meses a calentar:</strong></p>
    <table>
      <thead>
        <tr>
          <th>Calentar</th>
          <th>Mes</th>
          <th>Temperatura Min. (°C)</th>
          <th>Temperatura Max. (°C)</th>
          <th>Velocidad Viento Max. (km/h)</th>
          <th>Humedad Relativa Prom. (%)</th>
        </tr>
      </thead>
      <tbody>
  `;

  for (let i = 0; i < 12; i++) {
    tabla += `
      <tr data-mes="${i}" class="${mesesSeleccionados[i] ? '' : 'deshabilitado'}">
        <td><input type="checkbox" class="chk-mes" data-mes="${i}" ${mesesSeleccionados[i] ? 'checked' : ''}></td>
        <td>${meses[i]}</td>
        <td>${datosTemp.min[i].toFixed(1)}</td>
        <td>${datosTemp.max[i].toFixed(1)}</td>
        <td>${datosViento.max[i].toFixed(1)}</td>
        <td>${datosHumedad.promedio[i].toFixed(1)}</td>
      </tr>
    `;
  }

  tabla += `</tbody></table>`;
  const cont = document.getElementById("tablaClima");
  if (cont) cont.innerHTML = tabla;

  // 🔹 Función para actualizar resumen del mes más frío
  function actualizarMesFrio() {
    let minTemp = Infinity;
    let mesMasFrioIndex = -1;

    for (let i = 0; i < 12; i++) {
      if (mesesSeleccionados[i] && datosTemp.min[i] < minTemp) {
        minTemp = datosTemp.min[i];
        mesMasFrioIndex = i;
      }
    }

    if (mesMasFrioIndex === -1) {
      const cont2 = document.getElementById("contenedorMesFrio");
      if (cont2) cont2.innerHTML = "<p>Mes más frío seleccionado: -</p>";
      climaResumen = { mes: null, tempProm: null, viento: null, humedad: null };
      return;
    }

    const tempPromedio = ((datosTemp.min[mesMasFrioIndex] + datosTemp.max[mesMasFrioIndex]) / 2).toFixed(1);
    const vientoMax = datosViento.max[mesMasFrioIndex].toFixed(1);
    const humedadMes = datosHumedad.promedio[mesMasFrioIndex].toFixed(1);

    climaResumen = {
      mes: meses[mesMasFrioIndex],
      tempProm: parseFloat(tempPromedio),
      viento: parseFloat(vientoMax),
      humedad: parseFloat(humedadMes)
    };

    const cont3 = document.getElementById("contenedorMesFrio");
    if (cont3) {
      cont3.innerHTML = `
      <h4>Mes más frío seleccionado:</h4>
      <table id="tablaMesFrio">
        <thead>
          <tr>
            <th>Mes</th>
            <th>Temperatura Min. (°C)</th>
            <th>Temperatura Promedio (°C)</th>
            <th>Velocidad Viento Max. (km/h)</th>
            <th>Humedad Relativa (%)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${meses[mesMasFrioIndex]}</td>
            <td>${minTemp.toFixed(1)}</td>
            <td>${tempPromedio}</td>
            <td>${vientoMax}</td>
            <td>${humedadMes}</td>
          </tr>
        </tbody>
      </table>
    `;
    }

    // 👉 Ejecutar cálculos centralizados
    ejecutarCalculosDebounced();
  }

  actualizarMesFrio();

  // Eventos en checkboxes
  const chks = document.querySelectorAll(".chk-mes");
  chks.forEach(chk => {
    chk.addEventListener("change", (e) => {
      const i = parseInt(e.target.dataset.mes);
      mesesSeleccionados[i] = e.target.checked;
      const tr = document.querySelector(`tr[data-mes="${i}"]`);
      if (tr) tr.classList.toggle("deshabilitado", !e.target.checked);
      actualizarMesFrio();
    });
  });
}

// Listener para cambio de ciudad (tal cual)
document.addEventListener("change", (e) => {
  if (e.target.id === "ciudad") {
    ciudadSeleccionada = e.target.value;
    renderTabla(ciudadSeleccionada);
  }
});

// syncDatos (tal cual)
function syncDatos(id) {
  const el = document.getElementById(id);
  if (el) {
    if (el.type === "checkbox" || el.type === "radio") {
      datos[id] = el.checked ? "si" : "no";
    } else {
      datos[id] = el.value;
    }
  }
}

// idsRelevantes y escucha (tal cual)
const idsRelevantes = [
  "area", "tempDeseada", "cuerpoTechado", "cubiertaTermica",
  "ciudad", "profMin", "profMax", "distCuarto", "rotacion", "largoInfinity", "largoCanal"
];
idsRelevantes.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    const recalcular = () => {
      syncDatos(id);
      ejecutarCalculosDebounced(); // ✅ recalcula TODO
    };

    el.addEventListener("change", recalcular);
    el.addEventListener("input", recalcular);
  }
});

// mostrarGrafica (tal cual)
function mostrarGrafica(qEvap, qRad, qConv, qTrans, qInf, qCan, qTubTotal) {
  const canvas = document.getElementById("graficaPerdidas");
  if (!canvas) return;

  canvas.width = 780;
  canvas.height = 480;

  const ctx = canvas.getContext("2d");

  if (graficaPerdidas) graficaPerdidas.destroy();

  const n = (x) => (Number.isFinite(Number(x)) ? Number(x) : 0);

  const valores = [n(qEvap), n(qConv), n(qRad), n(qTrans), n(qInf), n(qCan), n(qTubTotal)];

  const etiquetas = [
    "Evaporación",
    "Convección",
    "Radiación",
    "Transmisión",
    "Infinity",
    "Canal perimetral",
    "Tubería"
  ];

  const colores = [
    "#36A2EB",
    "#FF6384",
    "#FF9F40",
    "#4BC0C0",
    "#9966FF",
    "#C9CBCF",
    "#FFCE56"
  ];

  // 🔹 Sumatoria total
  const total = valores.reduce((a, b) => a + b, 0);

  graficaPerdidas = new Chart(ctx, {
    type: "pie",
    data: {
      labels: etiquetas,
      datasets: [{
        data: valores,
        backgroundColor: colores,
        borderWidth: 1,
        radius: "92%"
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: -100,
          right: 0,
          top: 50,
          bottom: 70
        }
      },
      plugins: {
        legend: {
          position: "right",
          align: "center",
          labels: {
            usePointStyle: true,
            boxWidth: 14,
            font: { size: 14 },
            padding: 18,
            generateLabels: function (chart) {
              const data = chart.data;
              const dataset = data.datasets[0];
              return data.labels.map((label, i) => {
                const valor = Number(dataset.data[i]) || 0;
                const color = dataset.backgroundColor[i];
                return {
                  text: `${label}: ${valor.toLocaleString("es-MX", {
                    maximumFractionDigits: 0,
                  })} BTU/h`,
                  fillStyle: color,
                  strokeStyle: color,
                  lineWidth: 2,
                };
              });
            },
          },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const val = Number(ctx.parsed) || 0;
              return `${ctx.label}: ${val.toLocaleString("es-MX", {
                maximumFractionDigits: 0,
              })} BTU/h`;
            },
          },
        },
      },
    },
    plugins: [
      {
        id: "tituloPersonalizado",
        afterDraw(chart) {
          const { ctx, chartArea } = chart;
          ctx.save();
          ctx.font = "bold 20px sans-serif";
          ctx.fillStyle = "#222";
          ctx.textAlign = "center";
          ctx.fillText(
            "Distribución de Pérdidas de Calor (BTU/h)",
            (chartArea.left + chartArea.right) / 2 + 170,
            chartArea.top - 15
          );
          ctx.restore();
        }
      },
      {
        id: "totalAbajo",
        afterDraw(chart) {
          const { ctx, chartArea } = chart;
          ctx.save();
          ctx.font = "bold 17px sans-serif";
          ctx.fillStyle = "#333";
          ctx.textAlign = "center";
          ctx.fillText(
            `Total: ${total.toLocaleString("es-MX", { maximumFractionDigits: 0 })} BTU/h`,
            (chartArea.left + chartArea.right) / 2 + 170,
            chartArea.bottom + 40
          );
          ctx.restore();
        }
      }
    ]
  });
}

// -------------------- Debouncer (ejecutarCalculosDebounced) --------------------
function ejecutarCalculosDebounced(ms = 300) {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    try {
      ejecutarCalculos();
    } catch (e) {
      console.error("Error en ejecutarCalculosDebounced:", e);
    }
  }, ms);
}

// -------------------- Exposición como Hook React --------------------
export default function useCalculosHidraulicos() {

  // ---------- React integration: mount listeners + cleanup ----------
  const mountedRef = useRef(false);

  useEffect(() => {
    // Evitar ejecución doble en StrictMode (si aplica)
    if (mountedRef.current) return;
    mountedRef.current = true;

    // ---------- Helpers locales para listeners ----------
    const onGuardarCambio = (e) => {
      try { guardarCambio(e); } catch (err) { console.error("guardarCambio error:", err); }
    };

    const onGlobalChange = (e) => {
      try {
        // Maneja cambio de ciudad (si tu select tiene id="ciudad")
        if (e.target?.id === "ciudad") {
          ciudadSeleccionada = e.target.value;
          renderTabla(ciudadSeleccionada);
        }
        // Ejecutar toggles y demás comportamiento que tenías en el listener global
        // (esto replica lo que tienes en tu code: toggleInputs, etc.)
        try {
          toggleInputs && toggleInputs("chkInfinity", "campoInfinity");
          toggleInputs && toggleInputs("chkCanal", "campoCanal");
          toggleInputs && toggleInputs("chkBombaCalor", "campoBombaCalor");
          toggleInputs && toggleInputs("chkPanel", "campoPanel");
          toggleInputs && toggleInputs("chkCaldera", "campoCaldera");
        } catch (errToggle) {
          console.warn("toggleInputs error:", errToggle);
        }
      } catch (err) {
        console.error("onGlobalChange error:", err);
      }
    };

    // Conectar listeners globales
    document.addEventListener("input", onGuardarCambio);
    document.addEventListener("change", onGlobalChange);
    document.addEventListener("change", onGuardarCambio); // guardarCambio también en change

    // Conectar idsRelevantes (inputs individuales) para sincronizar datos + recalcular
    if (Array.isArray(idsRelevantes)) {
      idsRelevantes.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const recalcular = () => {
          try {
            syncDatos(id);
            ejecutarCalculosDebounced();
          } catch (err) {
            console.error("recalcular error for", id, err);
          }
        };
        el.addEventListener("change", recalcular);
        el.addEventListener("input", recalcular);

        // Guardarlo en la propia element for cleanup later
        el.____recalcularHandler = recalcular;
      });
    }

    // Inicializar tablas/clima si ya hay ciudad seleccionada
    try {
      const initialCiudad = document.getElementById("ciudad")?.value || ciudadSeleccionada;
      if (initialCiudad) {
        ciudadSeleccionada = initialCiudad;
        renderTabla(initialCiudad);
      } else {
        actualizarTablasClima && actualizarTablasClima();
      }
    } catch (errInit) {
      console.warn("Inicialización clima/tablas error:", errInit);
    }

    // Si quieres ejecutar cálculo inicial:
    try { ejecutarCalculosDebounced(0); } catch (e) { /* ignore */ }

    // ---------- CLEANUP ----------
    return () => {
      document.removeEventListener("input", onGuardarCambio);
      document.removeEventListener("change", onGlobalChange);
      document.removeEventListener("change", onGuardarCambio);

      if (Array.isArray(idsRelevantes)) {
        idsRelevantes.forEach(id => {
          const el = document.getElementById(id);
          if (!el) return;
          if (el.____recalcularHandler) {
            el.removeEventListener("change", el.___recalcularHandler);
            el.removeEventListener("input", el.___recalcularHandler);
            // try both names in case of typos
            el.removeEventListener("change", el.______recalcularHandler);
            el.removeEventListener("input", el.______recalcularHandler);
            delete el.___recalcularHandler;
            delete el.______recalcularHandler;
          }
        });
      }
    };
  }, []); // run once on mount



  return {
    // tablas / constantes
    temperatura,
    velocidadViento,
    humedad,
    calorVaporizacion,
    humedadAbsoluta,
    diametros,
    teeLinea,
    teeBranch,
    codo,
    reduccion,
    meses,

    // variables globales
    ciudadSeleccionada,
    mesesSeleccionados,
    climaResumen,
    datos,
    graficaPerdidas,

    // funciones (todas exportadas tal como pediste)
    qEvaporacion,
    qTuberia,
    qRadiacion,
    qConveccion,
    qTransmision,
    qInfinity,
    qCanal,
    ejecutarCalculos,
    ejecutarCalculosDebounced,
    renderTabla,
    syncDatos,
    mostrarGrafica,
    // ids
    idsRelevantes
  };
}
