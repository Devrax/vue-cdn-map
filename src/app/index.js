import './components/gmap.js';

new Vue({
    el: "#app",
    filters: {
        htmlJson(value, ...args) {
        const html = Object.values(value).map((cv, index) => {
            return args[index] ? `<p>${args[index]}: ${cv.toFixed(4)}</p>` : `<p>${cv.toFixed(4)}</p>`; 
        })

        return html.join('\n');
        }
    },
    data() {
        return {
            coords: null,
            showCoords: false
        }
    },
    methods: {
        success(position) {
            const { latitude, longitude } = position.coords;
            this.coords = {
                lat: latitude,
                lng: longitude
            }
        },
        error(error) {
        switch(error.code) {
            case 1:
            console.log('Se denego la obtencion de posicion, por favor desbloqueela');
            break;
            case 2:
            console.log('No se pudo obtener su direccion');
            break;
            case 3:
            console.log('Se agoto el tiempo para obtener su ubicación');
            break;
            default:
            console.log('No se pudo obtener su direccion');
            break;
        }

        this.coords = {
            lat: 18.5412279,
            lng: -69.861,
        }
        }
    },
    mounted() {
        if(!navigator.geolocation) {
            alert('Geolocation api no se encuentra en este browser');
        } else {
            const options = {
                enableHighAccuracy: true, 
                maximumAge: 5000, 
                timeout: 4000
            }

            navigator.geolocation.getCurrentPosition(this.success, this.error, options);
        }
    }
});