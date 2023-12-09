import 'colorts/lib/string';
import EventMonitoring from './Events';
import { CONFIG } from './config';
import ProtocolMonitoring from './ProtocolMonitoring';

class Main {
  eventMonitor_Arb: EventMonitoring;
  // eventMonitor_Pol: EventMonitoring;
  protocolMonitor: ProtocolMonitoring;
  arbitrumStrategies: string[];
  // polygonStrategies: string[];

  constructor() {
    // * Arbitrum Monitoring
    // * ===================
    this.arbitrumStrategies = ['0x5f10546E9316CA9380A2b00a78b78D3C3e7E7340'];
    this.eventMonitor_Arb = new EventMonitoring(CONFIG.CHAIN_NAME_MAPPING.ARBITRUM_GOERLI, this.arbitrumStrategies);

    // * Polygon POS Monitoring
    // * ======================
    // this.polygonStrategies = ['0xB8A3D563c7A68d847e648B5d114D2ADC43E8444d'];
    // this.eventMonitor_Pol = new EventMonitoring(CONFIG.CHAIN_NAME_MAPPING.POLYGON_MUMBAI, this.polygonStrategies);

    // * Protocol Monitoring
    // * ===================
    // -> Monitors the dapps for best option to invest
    this.protocolMonitor = new ProtocolMonitoring();
  }

  run = () => {
    this._consoleLog('Main engine started');
    this.eventMonitor_Arb.startMonitor();
    // this.eventMonitor_Pol.startMonitor();
    this.protocolMonitor.startMonitor();
  };

  _consoleLog = (s: any) => {
    console.log('>>>> [Main] :'.bgCyan);
    console.log(s);
  };

  _consoleError = (s: any) => {
    console.log('>>>> [Main] :'.bgCyan);
    console.log(s);
  };
}

if (require.main === module) {
  const main = new Main();
  main.run();
}
