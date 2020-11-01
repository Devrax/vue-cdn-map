export default Vue.component('g-map', {
    template: `
        <div id="google-map"></div>
    `,
    props: {
        'apiKey': String,
        'mapOptions': Object,
        'mapCenter': Object
    },
    data() {
        return {
            Gmap: null,
            coords: this.mapCenter,
            mapKey: this.apiKey
        };
    },
    methods: {
        reDrawMap() {
            this.removeMap();
            setTimeout(() => {
                this.drawMap();
            }, 50)
        },
        removeMap() {
            const scriptInyected = document.querySelector('#map-loaded');
            if(!scriptInyected) {
                document.head.removeChild(scriptInyected);
            }
        },
        drawMap() {
            
            if((typeof this.mapKey === 'string' && this.mapKey === 'Poner-aqui-tu-api-key') || !this.mapKey) {
                throw new Error(`
                [No Api Key]: No se proporcionó ningun api key
                
                Asegurese de que el componente tenga el atributo: "api-key"
                
                <g-map api-key="Aqui-pone-su-api-key"></g-map>
                `);
            }
            
            if(this.coords) {
                const scriptInyected = document.querySelector('#map-loaded');
                if(!this.Gmap && !scriptInyected) {
                    // Create the script tag, set the appropriate attributes
                    let script = document.createElement('script');
                    script.src = `https://maps.googleapis.com/maps/api/js?key=${this.mapKey}&callback=initMap`;
                    script.defer = true;
                    script.id = 'map-loaded';

                    const vueComponent = this;
                    // Attach your callback function to the `window` object
                    window.initMap = function() {
                        const center = vueComponent.coords || {
                            lat: -34.397,
                            lng: 150.644
                        }

                        const mapOptions = {
                            gestureHandling: "none",
                            disableDefaultUI: true,
                            zoom: 16,
                            center,
                            ...vueComponent.options
                        }

                        vueComponent.Gmap = new google.maps.Map(document.getElementById("google-map"), mapOptions);

                        new google.maps.Marker({
                            position: {...center},
                            map: vueComponent.Gmap,
                        });

                    };

                    // Append the 'script' element to 'head'
                    document.head.appendChild(script);
                }
            } else {
                throw new Error(`
                [No coordenadas]: No coordenadas proporcionadas
                
                Asegurese de que el componente tenga el atributo: "map-center"

                y recibe un objeto de tipo { lat: number, lng: number}, por lo que tiene que ser dinamico
                
                <g-map api-key="Aqui-pone-su-api-key" :map-center="coordenadas"></g-map>
                `);
            }

        }
    },
    watch: {
        mapCenter: function() {
            this.reDrawMap()
        }
    },
    created: function () {
        this.drawMap();
    }
});
