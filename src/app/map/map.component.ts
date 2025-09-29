import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import * as sitesData from '../../../public/sites-of-interest.json';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  sites: any = (sitesData as any).default;
  displayedSites: string = 'all';

  icon = L.icon({
    iconUrl: 'marker-icon.png',
    shadowUrl: 'marker-shadow.png',
    iconSize: [19, 41],
    shadowSize: [25, 32],
    iconAnchor: [10, 41],
    shadowAnchor: [7, 32],
    popupAnchor: [0, -35]
  });

  ngAfterViewInit() {
    this.map = L.map('map').setView([48.85, 2.35], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    const customControl = (L.control as any)({ position: 'topright' });

    customControl.onAdd = () => {
      const div = L.DomUtil.create('div', 'my-custom-buttons');
      div.innerHTML = `
      <button id="btn-all">Tout</button>
      <button id="btn-cities">Villes</button>
      <button id="btn-castels">Châteaux</button>
      <button id="btn-nature">Nature</button>
      <button id="btn-monument">Monuments</button>
    `;
      return div;
    };

    customControl.addTo(this.map);

    L.DomEvent.on(document.getElementById('btn-all')!, 'click', () => this.display('all'));
    L.DomEvent.on(document.getElementById('btn-cities')!, 'click', () => this.display('city'));
    L.DomEvent.on(document.getElementById('btn-castels')!, 'click', () => this.display('castel'));
    L.DomEvent.on(document.getElementById('btn-nature')!, 'click', () => this.display('natural site'));
    L.DomEvent.on(document.getElementById('btn-monument')!, 'click', () => this.display('monument'));

    this.updateMarkers();
  }

  display(value: string) {
    this.displayedSites = value;
    this.updateMarkers();
  }

  private updateMarkers() {
    for (let m of this.markers) {
      this.map.removeLayer(m);
    }

    this.markers = this.sites
              .filter((site: { type: string; }) => this.displayedSites === 'all' || site.type === this.displayedSites)
              .map((site: { latitude: number; longitude: number; picture: any; name: any; address: any; }) => 
                L.marker([site.latitude, site.longitude], { icon: this.icon })
                  .bindPopup(`<img style="max-height: 200px; width: auto;" src="${site.picture}">
                            <br>${site.name}
                            <br>${site.address}`)
                  .addTo(this.map)
              );
  }
}
