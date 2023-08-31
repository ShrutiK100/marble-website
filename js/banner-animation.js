document.addEventListener("DOMContentLoaded", function () {

    let marbleDataPath = '/datasets/banner.geojson';

    // Display location markers on globe for the nodes in the network
    // This feature currently does not display the marker large enough to identify the node.
    // The marker is also too big for locations that are close together.  The markers obscure each other.
    // Marker data is also hardcoded for the prototype phase and has not been linked to the node registry so it can be
    // auto-updated.
    // Code will be left commented here in case the feature will be further developed in the future.
    /*
    // Generic marker
    const markerSvg = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
  </svg>`;

    //Custom PAVICS marker
    let markerSvgPavics = `<svg viewBox="-4 0 36 36">
    <path fill="currentColor" d="M14,0 C21.732,0 28,5.641 28,12.6 C28,23.963 14,36 14,36 C14,36 0,24.064 0,12.6 C0,5.641 6.268,0 14,0 Z"></path>
    <circle fill="black" cx="14" cy="14" r="7"></circle>
    <image href="/images/logos/pavics_no_text.svg" width="30px" height="30px"></image>
    </svg>`

    //NOTE: Does not work
    //Create label for node to show on hover
    let uoftLabel = `<div id="uoftLabel" style="background-color: white;">U of T</div>`
    let pavicsLabel = `<div id="pavicsLabel" style="background-color: white;">PAVICS</div>`
    let crimLabel = `<div id="crimLabel" style="background-color: white;">Hirondelle</div>`

    // Create data for location markers for the nodes
    let nodeKeys = ["UofT", "PAVICS", "Hirondelle"]
    let nodeArray = [
        {lat:43.65, lng:-79.39, size: 7 + Math.random() * 30, color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)], markerSvg:markerSvg, url:"https://daccs.cs.toronto.edu", labelID: "uoftLabel", label:uoftLabel},
        {lat:45.5, lng:-73.57, size: 7 + Math.random() * 30, color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)], markerSvg:markerSvgPavics, url:"https://pavics.ouranos.ca", labelID: "pavicsLabel", label:pavicsLabel},
        {lat:45.5303976, lng:-73.627318, size: 7 + Math.random() * 30, color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)], markerSvg:markerSvg, url:"https://hirondelle.crim.ca", labelID: "crimLabel", label:crimLabel}
    ];

    //Map the node keys to the node array values
    nodeKeys.map(()=>(nodeArray))
    */
    //Default colour scale
    //const colorScale = d3.scaleSequentialSqrt(d3.interpolateTurbo);

    //Logo colour scale
    // Black, dark blue, light blue, green, yellow, orange, dark red
    let daccsColours = ["#000000", "#2D3367", "#1F81B6", "#336D66", "#F6DC3D", "#C66B33","#762F24"];

    const colorScale = d3.scaleLinear()
        .domain([null,-10,  5, 15, 25, 35, 45])
        .range(daccsColours);

    const getVal = feat => feat.properties.AvgTempCelcius;

    // Get the width and height of the containing div on refresh
    let bannerContainer = document.getElementById('banner');
    let bannerContainerWidth = bannerContainer.offsetWidth
    let bannerContainerHeight = bannerContainer.offsetHeight

    fetch(marbleDataPath).then(res => res.json()).then(countries =>
    {
      //Create globe, plot countries, create and plot choropleths
      //Colour countries according to average temperature
      const earth = Globe()
        .width(bannerContainerWidth)
        .height(bannerContainerHeight)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        //.globeImageUrl('images/banner/DACCS-Logo-Rectangle-Waves-Gradient.png')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        //.backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
        .polygonAltitude(0.06)
        .polygonCapColor(feat => colorScale(getVal(feat)))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          Avg. Temp: <i>${d.AvgTempCelcius}</i> &deg; C <br/>
          Year: <i>${d.Year}</i>
        `)
        .onPolygonHover(hoverD => earth
          .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
          .polygonCapColor(d => d === hoverD ? 'steelblue' : colorScale(getVal(d)))
        )
        .polygonsTransitionDuration(300)

      (document.getElementById('banner'))

        // Add location markers for node locations OPTIONAL
        // See comments about this feature above
        /*
        earth.htmlElementsData(nodeArray)
        earth.htmlElement(d => {
          const el = document.createElement('div');
          const labelElem = document.getElementById(d.labelID)
          el.innerHTML = d.markerSvg;
          el.style.color = d.color;
          el.style.width = `${d.size}px`;
          el.style['pointer-events'] = 'auto';
          el.style.cursor = 'pointer';
          el.onclick = () => window.open(d.url);

          return el;
        })
        */

    // Auto-rotate
    earth.controls().autoRotate = true;
    earth.controls().autoRotateSpeed = 0.35;

    // Remove zoom on mouse scroll
    earth.controls().enableZoom = false;

    // Add clouds sphere OPTIONAL
    // Used to wrap Marble logo around globe
    /*
    const DACCS_IMG_URL = 'images/banner/DACCS-Logo-Rectangle-Waves-Gradient.png'; // from https://github.com/turban/webgl-earth
    const DACCS_ALT = 0.004;
    const DACCS_ROTATION_SPEED = -0.006; // deg/frame

    new THREE.TextureLoader().load(DACCS_IMG_URL, daccsTexture => {
      const daccsLogo = new THREE.Mesh(
        new THREE.SphereGeometry(earth.getGlobeRadius() * (1 + DACCS_ALT), 75, 75),
        new THREE.MeshPhongMaterial({ map: daccsTexture, transparent: false})
      );
      //earth.scene().add(daccsLogo);

      (function rotateClouds() {
        daccsLogo.rotation.y += DACCS_ROTATION_SPEED * Math.PI / 180;
        requestAnimationFrame(rotateClouds);
      })();
      });*/

    });

});
