document.addEventListener("DOMContentLoaded", function () {

    //const colorScale = d3.scaleSequentialSqrt(d3.interpolateYlOrRd);
    //const colorScale = d3.scaleSequentialSqrt(d3.interpolateTurbo);
    //const colorScale = d3.scaleSequentialSqrt(d3.interpolateCubehelixDefault);

    //var colors = d3.scaleQuantize().domain([minTemp,maxTemp]).range(["#2D3367", "#1F81B6", "#336D66", "#F6DC3D", "#C66B33","#762F24"]);

    var daccsColours = ["#2D3367", "#1F81B6", "#336D66", "#F6DC3D", "#C66B33","#762F24"];
    //const colorScale = d3.scaleLinear().domain([0, 100]).range(["#2D3367","#762F24"]);
    const colorScale = d3.scaleLinear().range(['#2F3269', '#793125']);
    // GDP per capita (avoiding countries with small pop)
    const getVal = feat => feat.properties.GDP_MD_EST / Math.max(1e5, feat.properties.POP_EST);

    fetch('/datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()).then(countries =>
    {
      const maxVal = Math.max(...countries.features.map(getVal));
      colorScale.domain([0, maxVal]);

      const earth = Globe()
        .height([550])
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .lineHoverPrecision(0)
        .polygonsData(countries.features.filter(d => d.properties.ISO_A2 !== 'AQ'))
        .polygonAltitude(0.06)
        .polygonCapColor(feat => colorScale(getVal(feat)))
        .polygonSideColor(() => 'rgba(0, 100, 0, 0.15)')
        .polygonStrokeColor(() => '#111')
        .polygonLabel(({ properties: d }) => `
          <b>${d.ADMIN} (${d.ISO_A2}):</b> <br />
          GDP: <i>${d.GDP_MD_EST}</i> M$<br/>
          Population: <i>${d.POP_EST}</i>
        `)
        .onPolygonHover(hoverD => earth
          .polygonAltitude(d => d === hoverD ? 0.12 : 0.06)
          .polygonCapColor(d => d === hoverD ? 'steelblue' : colorScale(getVal(d)))
        )
        .polygonsTransitionDuration(300)
      (document.getElementById('banner'))

    // Auto-rotate
    earth.controls().autoRotate = true;
    earth.controls().autoRotateSpeed = 0.35;

    // Remove zoom on mouse scroll
    earth.controls().enableZoom = false;


    // Add clouds sphere
    const CLOUDS_IMG_URL = 'images/banner/DACCS-Logo-Rectangle-Waves-Gradient.png'; // from https://github.com/turban/webgl-earth
    const CLOUDS_ALT = 0.004;
    const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

    new THREE.TextureLoader().load(CLOUDS_IMG_URL, cloudsTexture => {
      const clouds = new THREE.Mesh(
        new THREE.SphereGeometry(earth.getGlobeRadius() * (1 + CLOUDS_ALT), 75, 75),
        new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
      );
      //earth.scene().add(clouds);

      (function rotateClouds() {
        clouds.rotation.y += CLOUDS_ROTATION_SPEED * Math.PI / 180;
        requestAnimationFrame(rotateClouds);
      })();
      });




    });






});
