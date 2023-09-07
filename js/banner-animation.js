document.addEventListener("DOMContentLoaded", function () {

    let marbleDataPath = '/datasets/banner.geojson';

    //Default colour scale
    //const colorScale = d3.scaleSequentialSqrt(d3.interpolateTurbo);

    //Custom logo colour scale
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
        .backgroundColor('#000000')
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        //.globeImageUrl('images/banner/DACCS-Logo-Rectangle-Waves-Gradient.png')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
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
        .polygonsTransitionDuration(300)

      (document.getElementById('banner'))

    // Auto-rotate
    earth.controls().autoRotate = true;
    earth.controls().autoRotateSpeed = 0.35;

    // Remove zoom on mouse scroll
    earth.controls().enableZoom = false;
    });
});
